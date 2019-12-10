'use strict'

let Student = require('../models/student'),
    User = require('../models/user'),
    db = require('../services/database'),
    axios = require('axios'),
    config = require('../config')

let StudentController = {}

StudentController.addStudent = function (req, res) {
    db.sync().then(function () {
        let newStudent = {
            student_id: req.body.student_id,
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

            // Adding new student
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

                res.status(201).json({ message: `Student ${req.body.student_id} added!` });
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