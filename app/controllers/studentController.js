'use strict'

let Sequelize = require('sequelize'),
    Student = require('../models/student'),
    User = require('../models/user'),
    db = require('../services/database'),
    config = require('../config'),
    { uuid } = require('uuidv4')

let StudentController = {}

StudentController.createStudent = function (req, res) {
    db.sync().then(function () {
        let studentInputData = JSON.parse(JSON.stringify(req.body))
        let listNewStudentCreated = []
        let listStudentExisted = []
        let listNewUserCreated = []
        let listUserExisted = []

        studentInputData.forEach((student, index) => {
            let newStudent = {
                student_id: uuid(),
                student_code: student.student_code,
                avatar_url: student.avatar_url,
                name: student.name,
                email: student.email,
                gender: student.gender,
                phone_number: student.phone_number,
                class: student.class,
                date_birth: student.date_birth,
            }

            Student.findOne({ where: { student_code: newStudent.student_code } }).then(function (data) {
                if (data) {
                    listStudentExisted.push({
                        student_id: data.dataValues.student_id
                    })

                    if (index == studentInputData.length - 1) {
                        if (listNewStudentCreated.length == 0 && listNewUserCreated.length == 0) {
                            res.status(200).json({
                                success: true,
                                data: {},
                                message: `Error when creating new student, please check the console!`
                            })
                        }
                    }
                    console.log(`Student ${newStudent.student_code} already exists!`)
                    return
                }

                // creating new student
                Student.create(newStudent).then(function () {
                    console.log(`New student ${newStudent.student_code} created!`)

                    listNewStudentCreated.push({
                        student_id: newStudent.student_id,
                    })

                    // creating new user
                    let newUser = {
                        user_id: uuid(),
                        username: newStudent.student_code,
                        password: newStudent.student_code,
                        email: newStudent.email,
                        role: config.userRoles.user,
                    }
                    listNewUserCreated.push({
                        user_id: newUser.user_id
                    })

                    User.findOne({ where: { username: newUser.username } }).then(function (user) {
                        if (user) {
                            listUserExisted.push({
                                user_id: user.dataValues.user_id
                            })
                            console.log(`Username ${newUser.username} already exists!`)
                        }

                        User.create(newUser).then(function (user) {
                            console.log(`New account created for user: ${newUser.username}`)

                            if (index == studentInputData.length - 1) {

                                if (listNewStudentCreated.length != 0 && listNewUserCreated.length != 0) {
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            "new_student_created": listNewStudentCreated,
                                            "student_existed": listStudentExisted,
                                            "new_user_created": listNewUserCreated,
                                            "user_existed": listUserExisted
                                        },
                                        message: `Students in list new_student_created and users in list new_user_created created!`
                                    })
                                    return
                                }
                            }
                        })
                    })
                })
            }).catch(function (err) {
                return next(err)
            })
        })
    })
}

StudentController.getAllStudent = function (req, res) {
    db.sync().then(function () {
        Student.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all students from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentController.getStudentById = function (req, res) {
    let student_id = req.params.student_id
    db.sync().then(function () {
        Student.findOne({ where: { student_id: student_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student ${student_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get student ${student_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentController.getStudentByCode = function (req, res) {
    let student_code = req.params.student_code
    db.sync().then(function () {
        Student.findOne({ where: { student_code: student_code } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student ${student_code} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get student ${student_code} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentController.updateStudentById = function (req, res) {
    let student_id = req.params.student_id
    let updateStudent = {
        student_code: req.body.student_code,
        avatar_url: req.body.avatar_url,
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone_number: req.body.phone_number,
        class: req.body.class,
        date_birth: req.body.date_birth,
    }
    db.sync().then(function () {
        // Update student 
        Student.findOne({ where: { student_id: student_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student ${student_id} not exist!`
                })
                return
            }

            data.update({
                student_code: req.body.student_code,
                avatar_url: updateStudent.avatar_url,
                name: updateStudent.name,
                email: updateStudent.email,
                gender: updateStudent.gender,
                phone_number: updateStudent.phone_number,
                class: updateStudent.class,
                date_birth: updateStudent.date_birth,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update student ${student_id} successfully`
                })
            })
        })

    })
}

StudentController.deleteStudentByCode = function (req, res) {
    let student_code = req.params.student_code
    db.sync().then(function () {

        // Delete student 
        Student.findOne({ where: { student_code: student_code } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student ${student_code} not exist!`
                })
                return
            }

            Student.destroy({ where: { student_code: student_code } }).then(function () {
                // Also delete user account of student 
                User.findOne({ where: { username: student_code } }).then(function (user) {
                    if (!user) {
                        res.status(403).json({
                            success: false,
                            data: {},
                            message: `User ${student_code} not exist!`
                        })
                        return
                    }

                    User.destroy({ where: { username: student_code } }).then(function () {
                        res.status(200).json({
                            success: true,
                            data: {},
                            message: `Student ${student_code} and user ${student_code} deleted!`
                        });
                    })
                })
            })
        })
    })
}

module.exports = StudentController