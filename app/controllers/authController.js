'use strict'

const { uuid } = require('uuidv4')
let jwt = require('jsonwebtoken')

let Sequelize = require('sequelize'),
    config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user')

let AuthController = {}

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

// Authenticate (or Login) an user
AuthController.authenticateUser = function (req, res) {
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
                        var token = jwt.sign(
                            { username: user.username },
                            config.keys.secret,
                            { expiresIn: '60000m' }
                        )

                        res.status(200).json({
                            data: {
                                success: true,
                                data: {
                                    token: 'Bearer ' + token,
                                    role: user.role
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

module.exports = AuthController
