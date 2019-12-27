'use strict'

let Sequelize = require('sequelize'),
    StudentExamSubject = require('../models/student_exam_subject'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let StudentExamSubjectController = {}

StudentExamSubjectController.createNewStudentExamSubject = function (req, res) {
    db.sync().then(function () {
        let newStudentExamSubject = {
            student_exam_subject_id: uuid(),
            student_id: req.body.student_id,
            exam_subject_id: req.body.subject_id,
            can_join_exam: req.body.can_join_exam,
            exam_schedule_id: req.body.exam_schedule_id
        }
        StudentExamSubject.findOne({ where: { student_id: newStudentExamSubject.student_id, exam_subject_id: newStudentExamSubject.exam_subject_id } }).then(function (data) {
            if (data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: 'This student-exam-subject already exists!'
                })
                return
            }

            if (!parseInt(newStudentExamSubject.can_join_exam)) {
                newStudentExamSubject.exam_schedule_id = ''
            }

            // creating new student-subject
            return StudentExamSubject.create(newStudentExamSubject).then(function () {
                res.status(200).json({
                    success: true,
                    data: {
                        student_exam_subject_id: newStudentExamSubject.student_exam_subject_id
                    },
                    message: 'New student-exam-subject created!'
                });
            })
        })
    })
}

StudentExamSubjectController.getAllStudentExamSubject = function (req, res) {
    db.sync().then(function () {
        StudentExamSubject.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all student-exam-subject from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentExamSubjectController.getStudentExamSubjectById = function (req, res) {
    let student_exam_subject_id = req.params.student_exam_subject_id
    db.sync().then(function () {
        StudentExamSubject.findOne({ where: { student_exam_subject_id: student_exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-exam-subject ${student_exam_subject_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get student-exam-subject ${student_exam_subject_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentExamSubjectController.updateStudentExamSubjectById = function (req, res) {
    let student_exam_subject_id = req.params.student_exam_subject_id
    let updateStudentExamSubject = {
        student_id: req.body.student_id,
        exam_subject_id: req.body.exam_subject_id,
        can_join_exam: req.body.can_join_exam,
        exam_schedule_id: req.body.exam_schedule_id
    }

    if (!parseInt(updateStudentExamSubject.can_join_exam)) {
        updateStudentExamSubject.exam_schedule_id = ''
    }

    db.sync().then(function () {
        StudentExamSubject.findOne({ where: { student_exam_subject_id: student_exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-exam-subject ${student_exam_subject_id} not exist!`
                })
                return
            }

            data.update({
                student_id: updateStudentExamSubject.student_id,
                exam_subject_id: updateStudentExamSubject.exam_subject_id,
                can_join_exam: updateStudentExamSubject.can_join_exam,
                exam_schedule_id: updateStudentExamSubject.exam_schedule_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update student-exam-subject ${student_exam_subject_id} successfully`
                })
            })
        })
    })
}

StudentExamSubjectController.deleteStudentExamSubjectById = function (req, res) {
    let student_exam_subject_id = req.params.student_exam_subject_id
    db.sync().then(function () {
        StudentExamSubject.findOne({ where: { student_exam_subject_id: student_exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-exam-subject ${student_exam_subject_id} not exist!`
                })
                return
            }

            return StudentExamSubject.destroy({ where: { student_exam_subject_id: student_exam_subject_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Student-exam-subject ${student_exam_subject_id} deleted!`
                })
            })
        })
    })
}

module.exports = StudentExamSubjectController