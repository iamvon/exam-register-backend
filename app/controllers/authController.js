'use strict'

const { uuid } = require('uuidv4')
let jwt = require('jsonwebtoken')

let Sequelize = require('sequelize'),
    config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user')

let AuthController = {}
let randtoken = require('rand-token')

let refreshTokens = {}

// Register an user
AuthController.signUp = function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(404).json({
            data: {
                success: false,
                data: {},
                message: 'Please provide an username and a password.'
            },
            status: 404
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
                        data: {
                            success: false,
                            data: {},
                            message: `Username ${req.body.username} already exists!`
                        },
                        status: 403
                    })
                    return
                }

                return User.create(newUser).then(function () {
                    res.status(201).json(
                        {
                            data: {
                                success: true,
                                data: {},
                                message: `New account created for user: ${newUser.username}`
                            },
                            status: 201
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
            data: {
                success: false,
                data: {},
                message: 'Username and password are needed!'
            },
            status: 404
        })
    } else {
        let username = req.body.username,
            password = req.body.password,
            potentialUser = { where: { username: username } }

        User.findOne(potentialUser).then(function (user) {
            if (!user) {
                res.status(404).json({
                    data: {
                        success: false,
                        data: {},
                        message: 'Authentication failed!'
                    },
                    status: 404
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
                        } else if (user.role == 4) {
                            userRole = 'admin'
                        }
                        res.status(200).json({
                            data: {
                                success: true,
                                data: {
                                    token: 'Bearer ' + token,
                                    role: userRole,
                                    refresh_token: refreshToken
                                },
                                message: `User ${user.username} login successfully`
                            },
                            status: 200
                        })
                    } else {
                        res.status(404).json({
                            data: {
                                success: false,
                                data: {},
                                message: 'Login failed!'
                            },
                            status: 404
                        }
                        )
                    }
                })
            }
        }).catch(function (error) {
            console.log(error)
            res.status(500).json({
                data: {
                    success: false,
                    data: {},
                    message: 'There was an error!'
                },
                status: 500
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
            data: {
                success: true,
                data: {
                    token: 'Bearer ' + token,
                    refresh_token: refreshToken
                },
                message: `Generating new token for user ${username} successfully`
            },
            status: 200
        })
    }
    else {
        res.send(401).json({
            data: {
                success: false,
                data: {},
                message: 'Generating new token failed!'
            },
            status: 401
        })
    }
}

// Deleting refresh token of an user
AuthController.rejectRefreshToken = function (req, res) {
    let refreshToken = req.body.refreshToken
    if (refreshToken in refreshTokens) {
        delete refreshTokens[refreshToken]
    }
    res.send(204).json({
        data: {
            success: true,
            data: {},
            message: 'Delete refresh token successfully'
        },
        status: 204
    })
}

module.exports = AuthController
