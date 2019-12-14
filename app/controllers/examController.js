'use strict'

let Sequelize = require('sequelize'),
    Exam = require('../models/exam'),
    db = require('../services/database')
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
                res.status(201).json({
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

            res.status(200).json({
                success: true,
                data: data,
                message: `Get exam ${exam_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

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