'use strict'

let Exam = require('../models/exam'),
    db = require('../services/database')

let ExamController = {}

ExamController.addExam = function (req, res) {
    db.sync().then(function () {
        let newExam = {
            exam_id: req.body.exam_id,
            exam_name: req.body.exam_name,
            school_year: req.body.school_year 
        }

        Exam.findOne({ where: { exam_id: req.body.exam_id } }).then(function (exam) {
            if (exam) {
                res.status(403).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} already exists!` })
                return
            }

            // Adding new exam
            return Exam.create(newExam).then(function () {
                res.status(201).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} added!` });
            })
        })
    })
}

ExamController.deleteExam = function (req, res) {
    db.sync().then(function () {
        Exam.findOne({ where: { exam_id: req.body.exam_id } }).then(function (exam) {
            if (!exam) {
                res.status(403).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} not exist!` })
                return
            }

            return Exam.destroy({ where: { exam_id: req.body.exam_id } }).then(function () {
                res.status(201).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} deleted!` })
            })
        })
    })
}

module.exports = ExamController