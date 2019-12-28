'use strict'

let Sequelize = require('sequelize'),
    StudentSubject = require('../models/student_subject'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let StudentSubjectController = {}

StudentSubjectController.createNewStudentSubject = function (req, res) {
    db.sync().then(function () {
        let studentSubjectInputData = JSON.parse(JSON.stringify(req.body))

        const studentSubjectPromises = studentSubjectInputData.map(studentSubject => {
            let newStudentSubject = {
                student_subject_id: uuid(),
                student_id: studentSubject.student_id,
                subject_id: studentSubject.subject_id,
                can_join_exam: studentSubject.can_join_exam,
                exam_schedule_id: ''
            }

            return StudentSubject.findOne({ where: { student_id: newStudentSubject.student_id, subject_id: newStudentSubject.subject_id, exam_schedule_id: newStudentSubject.exam_schedule_id } }).then(function (data) {
                if (data) {
                    console.log('This student-subject already exists!')
                    return {}
                }

                // creating new student-subject
                return StudentSubject.create(newStudentSubject).then(function () {
                    console.log(`New student subject ${newStudentSubject.student_subject_id} created!`)
                    return Object.assign({}, {
                        student_subject_id: newStudentSubject.student_subject_id
                    })
                })
            })
        })

        Promise.all(studentSubjectPromises).then(studentSubject => {
            let newstudentSubjectArray = studentSubject.filter(value => Object.keys(value).length !== 0);
            if (newstudentSubjectArray.length > 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        created_list: newstudentSubjectArray
                    },
                    message: `New student-subject list created!`,
                })
            } else {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Error when creating new exam student-subject, please check the console!`
                })
            }
        })
    })
}

StudentSubjectController.getAllStudentSubject = function (req, res) {
    db.sync().then(function () {
        StudentSubject.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
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
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-subject ${student_subject_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get student-subject ${student_subject_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

StudentSubjectController.getStudentSubjectBySubjectId = function (req, res) {
    let subject_id = req.params.subject_id
    db.sync().then(function () {
        StudentSubject.findOne({ where: { subject_id: subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-subject of subject ${subject_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get student-subject of subject ${subject_id} from database`
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
                    success: false,
                    data: {},
                    message: `Student-subject ${student_subject_id} not exist!`
                })
                return
            }

            if (data.dataValues.can_join_exam) {
                data.update({
                    student_id: updateStudentSubject.student_id,
                    subject_id: updateStudentSubject.subject_id,
                    can_join_exam: 1,
                    exam_schedule_id: updateStudentSubject.exam_schedule_id,
                    updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
                }).then(function () {
                    res.status(200).json({
                        success: true,
                        data: {},
                        message: `Update student-subject ${student_subject_id} successfully`
                    })
                })
            } else {
                res.status(403).json({
                    success: false,
                    data: {
                        can_join_exam: 0,
                    },
                    message: `This student can not join the exam!`
                }) 
            }
        })
    })
}

StudentSubjectController.deleteStudentSubjectById = function (req, res) {
    let student_subject_id = req.params.student_subject_id
    db.sync().then(function () {
        StudentSubject.findOne({ where: { student_subject_id: student_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Student-subject ${student_subject_id} not exist!`
                })
                return
            }

            return StudentSubject.destroy({ where: { student_subject_id: student_subject_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Student-subject ${student_subject_id} deleted!`
                })
            })
        })
    })
}

module.exports = StudentSubjectController