'use strict'

let Sequelize = require('sequelize'),
    User = require('../models/user'),
    db = require('../services/database')

let UserController = {}

UserController.getUserIdByStudentCode = function (req, res) {
    let student_code = req.params.student_code
    db.sync().then(function () {
        User.findOne({ where: { username: student_code } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `User ${student_code} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: {
                    user_id: data.user_id,
                },
                message: "Get user ID by student's code"
            })
        })
    })
}

UserController.getAllUser = function (req, res) {
    db.sync().then(function () {
        User.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all users from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

UserController.getUserById = function (req, res) {
    let user_id = req.params.user_id
    db.sync().then(function () {
        User.findOne({ where: { user_id: user_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `User ${user_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get user ${user_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

UserController.updateUserById = function (req, res) {
    let user_id = req.params.user_id
    let updateUser = {
        avatar_url: req.body.avatar_url,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }

    db.sync().then(function () {
        User.findOne({ where: { user_id: user_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `User ${user_id} not exist!`
                })
                return
            }

            data.update({
                avatar_url: updateUser.avatar_url,
                email: updateUser.email,
                password: updateUser.password,
                role: updateUser.role,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update user ${user_id} successfully`
                })
            })
        })
    })
}

module.exports = UserController;