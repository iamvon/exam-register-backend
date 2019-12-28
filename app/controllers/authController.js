'use strict'

const { uuid } = require('uuidv4')
let jwt = require('jsonwebtoken')

let Sequelize = require('sequelize'),
    config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user'),
    Student = require('../models/student')

let AuthController = {}
let randtoken = require('rand-token')

let refreshTokens = {}

// Register an user
AuthController.signUp = function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(404).json({
            success: false,
            data: {},
            message: 'Please provide an username and a password.'
        })
    } else {
        db.sync().then(function () {
            let newUser = {
                user_id: uuid(),
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                role: config.userRoles.user,
            }

            User.findOne({ where: { username: req.body.username } }).then(function (user) {
                if (user) {
                    res.status(403).json({
                        success: false,
                        data: {},
                        message: `Username ${req.body.username} already exists!`
                    })
                    return
                }

                return User.create(newUser).then(function () {
                    res.status(200).json(
                        {
                            success: true,
                            data: {},
                            message: `New account created for user: ${newUser.username}`
                        }
                    );
                })
            })

        }).catch(function (error) {
            console.log(error);
        })
    }
}

// Login an user
AuthController.login = function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(404).json({
            success: false,
            data: {},
            message: 'Username and password are needed!'
        })
    } else {
        let username = req.body.username,
            password = req.body.password,
            potentialUser = { where: { username: username } }

        User.findOne(potentialUser).then(function (user) {
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: {},
                    message: 'Authentication failed!'
                })
            } else {
                // console.log(typeof user._modelOptions.instanceMethods.comparePasswords)
                user.comparePasswords(password, function (error, isMatch) {
                    if (isMatch && !error) {
                        let token = jwt.sign(
                            { username: user.username },
                            config.keys.secret,
                            { expiresIn: config.tokenLifeTime }
                        )

                        let refreshToken = randtoken.uid(256)
                        refreshTokens[refreshToken] = user.username

                        let userRole = ''
                        if (user.role == 1) {
                            userRole = 'guest'
                        } else if (user.role == 2) {
                            userRole = 'user'
                            let student_code = user.dataValues.username

                            const studentInfo = Student.findOne({ where: { student_code: student_code } }).then(function (student) {
                                if (!student) {
                                    console.log(`Student ${student_code} not exist!`)
                                    return
                                }

                                return Object.assign({}, {
                                    student_id: student.student_id,
                                    student_code: student.student_code,
                                    name: student.name,
                                    email: student.email,
                                    gender: student.gender,
                                    phone_number: student.phone_number,
                                    class: student.class,
                                    date_birth: student.date_birth 
                                })
                            })

                            Promise.resolve(studentInfo).then(student => {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        user: {
                                            username: user.dataValues.username,
                                            email: user.dataValues.email,
                                            avatar_url: user.dataValues.avatar_url,
                                            student_info: student
                                        },
                                        token: 'Bearer ' + token,
                                        role: userRole,
                                        refresh_token: refreshToken
                                    },
                                    message: `User ${user.username} login successfully`

                                })
                            })

                        } else if (user.role == 4) {
                            userRole = 'admin'

                            res.status(200).json({
                                success: true,
                                data: {
                                    user: {
                                        username: user.dataValues.username,
                                        email: user.dataValues.email,
                                        avatar_url: user.dataValues.avatar_url,
                                    },
                                    token: 'Bearer ' + token,
                                    role: userRole,
                                    refresh_token: refreshToken
                                },
                                message: `User ${user.username} login successfully`

                            })
                        }

                    } else {
                        res.status(404).json({
                            success: false,
                            data: {},
                            message: 'Login failed!'
                        }
                        )
                    }
                })
            }
        }).catch(function (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                data: {},
                message: 'There was an error!'
            })
        })
    }
}

// Generating new token for user
AuthController.token = function (req, res) {
    let username = req.body.username
    let refreshToken = req.body.refresh_token

    if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == username)) {
        let token = jwt.sign(
            { username: username },
            config.keys.secret,
            { expiresIn: config.tokenLifeTime }
        )
        res.status(200).json({
            success: true,
            data: {
                token: 'Bearer ' + token,
                refresh_token: refreshToken
            },
            message: `Generating new token for user ${username} successfully`
        })
    }
    else {
        res.status(401).json({
            success: false,
            data: {},
            message: 'Generating new token failed!'
        })
    }
}

// Deleting refresh token of an user
AuthController.rejectRefreshToken = function (req, res) {
    let refreshToken = req.body.refresh_token
    if (refreshToken in refreshTokens) {
        delete refreshTokens[refreshToken]
    }
    return res.status(200).json({
        success: true,
        data: {},
        message: 'Delete refresh token successfully'
    })
}

module.exports = AuthController