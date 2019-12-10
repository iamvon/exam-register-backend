'use strict'

const { uuid } = require('uuidv4')
let jwt = require('jsonwebtoken')

let config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user')

let AuthController = {}

// Register an user
AuthController.signUp = function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ message: 'Please provide an username and a password.' })
    } else {
        db.sync().then(function () {
            let newUser = {
                id: uuid(),
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                role: config.userRoles.user,
            }

            User.findOne({ where: { username: req.body.username } }).then(function (user) {
                if (user) {
                    res.status(403).json({ message: `Username ${req.body.username} already exists!` })
                    return
                }

                return User.create(newUser).then(function () {
                    res.status(201).json({ message: `New account created for user: ${newUser.username}` });
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
        res.status(404).json({ message: 'Username and password are needed!' })
    } else {
        let username = req.body.username,
            password = req.body.password,
            potentialUser = { where: { username: username } }

        User.findOne(potentialUser).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'Authentication failed!' })
            } else {
                // console.log(typeof user._modelOptions.instanceMethods.comparePasswords)
                user.comparePasswords(password, function(error, isMatch) {
                    if(isMatch && !error) {
                        var token = jwt.sign(
                            { username: user.username },
                            config.keys.secret,
                            { expiresIn: '30m' }
                        )

                        res.json({
                            success: true,
                            token: 'Bearer ' + token,
                            role: user.role
                        })
                    } else {
                        res.status(404).json({ message: 'Login failed!' })
                    }
                })
            }
        }).catch(function (error) {
            console.log(error)
            res.status(500).json({ message: 'There was an error!' })
        })
    }
}

module.exports = AuthController
