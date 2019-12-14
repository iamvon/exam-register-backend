'use strict'

let Sequelize = require('sequelize'),
    StudentSubject = require('../models/student_subject'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let StudentSubjectController = {}

StudentSubjectController.createNewStudentSubject = function (req, res) {
    db.sync().then(function () {
        let newStudentSubject = {
            student_subject_id: uuid(),
            student_id: req.body.student_id,
            subject_id: req.body.subject_id,
            can_join_exam: req.body.can_join_exam,
            exam_schedule_id: req.body.exam_schedule_id
        }
        StudentSubject.findOne({ where: { student_id: newStudentSubject.student_id, subject_id: newStudentSubject.subject_id, can_join_exam: newStudentSubject.can_join_exam, exam_schedule_id: newStudentSubject.exam_schedule_id } }).then(function (data) {
            if (data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: 'This student-subject already exists!'
                    },
                    status: 403
                })
                return
            }

            // creating new student-subject
            return StudentSubject.create(newStudentSubject).then(function () {
                res.status(201).json({
                    data: {
                        success: true,
                        data: {
                            student_subject_id: newStudentSubject.student_subject_id
                        },
                        message: 'New student-subject created!',
                    },
                    status: 201
                });
            })
        })
    })
}

StudentSubjectController.getAllStudentSubject = function (req, res) {
    db.sync().then(function () {
        StudentSubject.findAll({}).then(function (data) {
            res.status(200).json({
                data: {
                    success: true,
                    data: data,
                    message: "Get all student-subject from database",
                },
                status: 200
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentSubjectController.getStudentSubjectById = function (req, res) {
    let student_subject_id = req.params.student_subject_id
    db.sync().then(function () {
        StudentSubject.findOne({ where: { student_subject_id: student_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Student-subject ${student_subject_id} not exist!`
                    },
                    status: 403
                })
                return
            }

            res.status(200).json({
                data: {
                    success: true,
                    data: data,
                    message: `Get student-subject ${student_subject_id} from database`
                },
                status: 200
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentSubjectController.updateStudentSubjectById = function (req, res) {
    let student_subject_id = req.params.student_subject_id
    let updateStudentSubject = {
        student_id: req.body.student_id,
        subject_id: req.body.subject_id,
        can_join_exam: req.body.can_join_exam,
        exam_schedule_id: req.body.exam_schedule_id
    }
    db.sync().then(function () {
        StudentSubject.findOne({ where: { student_subject_id: student_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Student-subject ${student_subject_id} not exist!`
                    },
                    status: 403
                })
                return
            }

            data.update({
                student_id: updateStudentSubject.student_id,
                subject_id: updateStudentSubject.subject_id,
                can_join_exam: updateStudentSubject.can_join_exam,
                exam_schedule_id: updateStudentSubject.exam_schedule_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    data: {
                        success: true,
                        data: {},
                        message: `Update student-subject ${student_subject_id} successfully`
                    },
                    status: 200
                })
            })
        })
    })
}

StudentSubjectController.deleteStudentSubjectById = function (req, res) {
    let student_subject_id = req.params.student_subject_id
    db.sync().then(function () {
        StudentSubject.findOne({ where: { student_subject_id: student_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Student-subject ${student_subject_id} not exist!`
                    },
                    status: 403
                })
                return
            }

            return StudentSubject.destroy({ where: { student_subject_id: student_subject_id } }).then(function () {
                res.status(200).json({
                    data: {
                        success: true,
                        data: {},
                        message: `Student-subject ${student_subject_id} deleted!`
                    },
                    status: 200
                })
            })
        })
    })
}

module.exports = StudentSubjectController