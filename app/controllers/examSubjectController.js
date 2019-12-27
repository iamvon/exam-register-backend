'use strict'

let Sequelize = require('sequelize'),
    ExamSubject = require('../models/exam_subject'),
    db = require('../services/database'),
    { uuid } = require('uuidv4')

let ExamSubjectController = {}

ExamSubjectController.createNewExamSubject = function (req, res) {
    db.sync().then(function () {
        let newExamSubject = {
            exam_subject_id: uuid(),
            subject_id: req.body.subject_id,
            date: req.body.date,
            exam_id: req.body.exam_id
        }

        ExamSubject.findOne({ where: { subject_id: newExamSubject.subject_id, date: newExamSubject.date, exam_id: newExamSubject.exam_id } }).then(function (examSubject) {
            if (examSubject) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `This exam subject already exists!`
                })
                return
            }

            // creating new exam subject
            return ExamSubject.create(newExamSubject).then(function () {
                res.status(200).json({
                    success: true,
                    data: {
                        exam_subject_id: newExamSubject.exam_subject_id
                    },
                    message: `Exam subject created succesfully!`
                });
            })
        })
    })
}

ExamSubjectController.getAllExamSubject = function (req, res) {
    db.sync().then(function () {
        ExamSubject.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all exam subjects from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}


ExamSubjectController.getExamSubjectById = function (req, res) {
    let exam_subject_id = req.params.exam_subject_id
    db.sync().then(function () {
        ExamSubject.findOne({ where: { exam_subject_id: exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam subject ${exam_subject_id} not exist!`
                })
                return
            }

            console.log(data)

            res.status(200).json({
                success: true,
                data: data,
                message: `Get exam subject ${exam_subject_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamSubjectController.updateExamSubjectById = function (req, res) {
    let exam_subject_id = req.params.exam_subject_id
    let updateExamSubject = {
        subject_id: req.body.subject_id,
        date: req.body.date,
        exam_id: req.body.exam_id
    }
    db.sync().then(function () {
        ExamSubject.findOne({ where: { exam_subject_id: exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam subject ${exam_subject_id} not exist!`
                })
                return
            }

            data.update({
                subject_id: updateExamSubject.subject_id,
                date: updateExamSubject.date,
                exam_id: updateExamSubject.exam_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update exam subject ${exam_subject_id} successfully`
                })
            })
        })
    })
}

ExamSubjectController.deleteExamSubjectById = function (req, res) {
    let exam_subject_id = req.params.exam_subject_id
    db.sync().then(function () {
        ExamSubject.findOne({ where: { exam_subject_id: exam_subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam subject ${exam_subject_id} not exist!`
                })
                return
            }

            return ExamSubject.destroy({ where: { exam_subject_id: exam_subject_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Exam subject ${exam_subject_id} deleted!`
                })
            })
        })
    })
}

module.exports = ExamSubjectController