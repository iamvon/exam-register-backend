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
                res.status(403).json({ message: 'This student-subject already exists!' })
                return
            }

            // creating new student-subject
            return StudentSubject.create(newStudentSubject).then(function () {
                res.status(201).json({
                    status: 'success',
                    message: 'New student-subject created!',
                    student_subject_id: newStudentSubject.student_subject_id
                });
            })
        })
    })
}

// TODO
StudentSubjectController.getAllStudentSubject = function (req, res) {
    db.sync().then(function () {
        StudentSubject.findAll({}).then(function (data) {
            res.status(200).json({
                status: 'success',
                data: data,
                message: "Get all student-subject from database"
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
                res.status(403).json({ message: `Student-subject ${student_subject_id} not exist!` })
                return
            }

            res.status(200).json({
                status: 'success',
                data: data,
                message: `Get student-subject ${student_subject_id} from database`
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
                res.status(403).json({ message: `Student-subject ${student_subject_id} not exist!` })
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
                    status: 'success',
                    message: `Update student-subject ${student_subject_id} successfully`
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
                res.status(403).json({ message: `Student-subject ${student_subject_id} not exist!` })
                return
            }

            return StudentSubject.destroy({ where: { student_subject_id: student_subject_id } }).then(function () {
                res.status(201).json({ message: `Student-subject ${student_subject_id} deleted!` })
            })
        })
    })
}

module.exports = StudentSubjectController