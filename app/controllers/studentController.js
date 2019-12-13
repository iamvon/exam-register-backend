'use strict'

let Sequelize = require('sequelize'),
    Student = require('../models/student'),
    User = require('../models/user'),
    db = require('../services/database'),
    axios = require('axios'),
    config = require('../config')

let StudentController = {}

StudentController.createStudent = function (req, res) {
    db.sync().then(function () {
        let newStudent = {
            student_id: req.body.student_id,
            avatar_url: req.body.avatar_url,
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            phone_number: req.body.phone_number,
            class: req.body.class,
            date_birth: req.body.date_birth,
        }

        Student.findOne({ where: { student_id: req.body.student_id } }).then(function (student) {
            if (student) {
                res.status(403).json({ message: `Student ${req.body.student_id} already exists!` })
                return
            }

            // createing new student
            return Student.create(newStudent).then(function () {
                // Creating account for new student 
                axios.post('/api/signup', {
                    username: req.body.student_id,
                    password: req.body.date_birth.replace(/-/g, ''),
                    email: req.body.email,
                }, {
                    proxy: {
                        host: config.server.host,
                        port: config.server.port
                    }
                }
                ).then(function (res) {
                    // console.log(res)
                })
                    .catch(function (error) {
                        console.log(error);
                    });

                res.status(201).json({ message: `Student ${req.body.student_id} created!` });
            })
        })
    })
}

StudentController.getAllStudent = function (req, res) {
    db.sync().then(function () {
        Student.findAll({}).then(function (data) {
            res.status(200).json({
                status: 'success',
                data: data,
                message: "Get all Students from database"
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
                res.status(403).json({ message: `Student ${student_id} not exist!` })
                return
            }

            res.status(200).json({
                status: 'success',
                data: data,
                message: `Get subject ${student_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentController.updateStudentById = function (req, res) {
    let student_id = req.params.student_id
    let updateStudent = {
        subject_name: req.body.subject_name,
        student_id: req.body.student_id
    }
    db.sync().then(function () {
        Student.findOne({ where: { student_id: student_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({ message: `Student ${student_id} not exist!` })
                return
            }

            data.update({
                subject_name: updateStudent.subject_name,
                student_id: updateStudent.student_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    status: 'success',
                    message: `Update subject ${student_id} successfully`
                })
            })
        })
    })
}

StudentController.deleteStudentById = function (req, res) {
    let student_id = req.params.student_id
    db.sync().then(function () {
        Student.findOne({ where: { student_id: student_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({ message: `Student ${student_id} not exist!` })
                return
            }

            return Student.destroy({ where: { student_id: student_id } }).then(function () {
                res.status(201).json({ message: `Student ${student_id} deleted!` })
            })
        })
    })
}

StudentController.deleteStudent = function (req, res) {
    db.sync().then(function () {
        Student.findOne({ where: { student_id: req.body.student_id } }).then(function (student) {
            if (!student) {
                res.status(403).json({ message: `Student ${req.body.student_id} not exist!` })
                return
            }

            return Student.destroy({ where: { student_id: req.body.student_id } }).then(function () {
                res.status(201).json({ message: `Student ${req.body.student_id} deleted!` })
            })
        })

        User.findOne({ where: { username: req.body.student_id } }).then(function (user) {
            if (!user) {
                res.status(403).json({ message: `User ${req.body.student_id} not exist!` })
                return
            }

            return User.destroy({ where: { username: req.body.student_id } }).then(function () {
                res.status(201).json({ message: `User ${req.body.student_id} deleted!` });
            })
        })
    })
}

module.exports = StudentController