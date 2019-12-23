'use strict'

let Sequelize = require('sequelize'),
    Exam = require('../models/exam'),
    db = require('../services/database'),
    ExamSchedule = require('../models/exam_schedule'),
    Subject = require('../models/subject'),
    ExamRoom = require('../models/exam_room'),
    ExamShift = require('../models/exam_shift')
const { uuid } = require('uuidv4')

let ExamController = {}

ExamController.createNewExam = function (req, res) {
    db.sync().then(function () {
        let newExam = {
            exam_id: uuid(),
            exam_name: req.body.exam_name,
            school_year: req.body.school_year
        }

        Exam.findOne({ where: { exam_name: req.body.exam_name, school_year: req.body.school_year } }).then(function (exam) {
            if (exam) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam ${req.body.exam_name} - ${req.body.school_year} already exists!`
                })
                return
            }

            // createing new exam
            return Exam.create(newExam).then(function () {
                res.status(200).json({
                    success: true,
                    data: { exam_id: newExam.exam_id },
                    message: `Exam ${req.body.exam_name} - ${req.body.school_year} created!`
                });
            })
        })
    })
}

ExamController.getAllExam = function (req, res) {
    db.sync().then(function () {
        Exam.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all exams from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamController.getExamById = function (req, res) {
    let exam_id = req.params.exam_id
    let subject = [], examRoom = [], examShift = [], exam = []
    let resultData = {
        "exam": exam,
        "subject": subject,
        "exam_room": examRoom,
        "exam_shift": examShift
    }

    db.sync().then(function () {
        ExamSchedule.findOne({ where: { exam_id: exam_id } }).then(function (data) {
            if (!data) {
                return res.status(403).json({
                    success: false,
                    data: {},
                    message: `Table exam_schedule is empty!`
                })
            }
            return
        })

        ExamSchedule.findAll({ where: { exam_id: exam_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam ${exam_id} not exist!`
                })
                return
            }

            data.forEach((item, index) => {
                Exam.findOne({ where: { exam_id: exam_id } }).then((data) => { exam.push(data.dataValues) })
                    .then(Subject.findOne({ where: { subject_id: item.dataValues.subject_id } }).then((data) => { subject.push(data.dataValues) })
                        .then(ExamRoom.findOne({ where: { exam_room_id: item.dataValues.exam_room_id } }).then((data) => { examRoom.push(data.dataValues) })
                            .then(ExamShift.findOne({ where: { exam_shift_id: item.dataValues.exam_shift_id } }).then((data) => { examShift.push(data.dataValues) })
                                .then(() => {
                                    if (index == data.length - 1) {
                                        res.status(200).json({
                                            success: true,
                                            data: resultData,
                                            message: `Get all exam data of exam ${exam_id} from database`
                                        })
                                    }
                                    exam = []
                                }))
                        ))
            })
        })
    })
}

// ExamController.getExamById = function (req, res) {
//     let exam_id = req.params.exam_id
//     db.sync().then(function () {
//         Exam.findOne({ where: { exam_id: exam_id } }).then(function (data) {
//             if (!data) {
//                 res.status(403).json({
//                     success: false,
//                     data: {},
//                     message: `Exam ${exam_id} not exist!`
//                 })
//                 return
//             }

//             res.status(200).json({
//                 success: true,
//                 data: data,
//                 message: `Get exam ${exam_id} from database`
//             })
//         }).catch(function (err) {
//             return next(err)
//         })
//     })
// }

ExamController.updateExamById = function (req, res) {
    let exam_id = req.params.exam_id
    let updateExam = {
        exam_name: req.body.exam_name,
        school_year: req.body.school_year
    }
    db.sync().then(function () {
        Exam.findOne({ where: { exam_id: exam_id } }).then(function (exam) {
            if (!exam) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam ${exam_id} not exist!`
                })
                return
            }

            exam.update({
                exam_name: updateExam.exam_name,
                school_year: updateExam.school_year,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update exam ${exam_id} successfully`
                })
            })
        })
    })
}

ExamController.deleteExamById = function (req, res) {
    let exam_id = req.params.exam_id
    db.sync().then(function () {
        Exam.findOne({ where: { exam_id: exam_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam ${exam_id} not exist!`
                })
                return
            }

            return Exam.destroy({ where: { exam_id: exam_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Exam ${exam_id} deleted!`
                })
            })
        })
    })
}

module.exports = ExamController