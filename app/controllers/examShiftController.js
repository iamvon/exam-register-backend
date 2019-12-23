'use strict'

let Sequelize = require('sequelize'),
    ExamShift = require('../models/exam_shift'),
    db = require('../services/database')
const { uuid } = require('uuidv4')

let ExamShiftController = {}

ExamShiftController.createNewExamShift = function (req, res) {
    db.sync().then(function () {
        let newExamShift = {
            exam_shift_id: uuid(),
            exam_shift_name: req.body.exam_shift_name, 
            exam_id: req.body.exam_id,
            start_time: req.body.start_time,
            end_time: req.body.end_time
        }

        ExamShift.findOne({ where: { exam_id: req.body.exam_id, start_time: req.body.start_time, end_time: req.body.end_time } }).then(function (data) {
            if (data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam shift from ${req.body.start_time} to ${req.body.end_time} already exists!`
                })
                return
            }

            // createing new exam shift
            return ExamShift.create(newExamShift).then(function () {
                res.status(200).json({
                    success: true,
                    data: {
                        exam_shift_id: newExamShift.exam_shift_id
                    },
                    message: `New exam shift from ${req.body.start_time} to ${req.body.end_time} created!`
                });
            })
        })
    })
}

ExamShiftController.getAllExamShift = function (req, res) {
    db.sync().then(function () {
        ExamShift.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all exam shifts from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}


ExamShiftController.getExamShiftById = function (req, res) {
    let exam_shift_id = req.params.exam_shift_id
    db.sync().then(function () {
        ExamShift.findOne({ where: { exam_shift_id: exam_shift_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam shift ${exam_shift_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get exam shift ${exam_shift_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamShiftController.updateExamShiftById = function (req, res) {
    let exam_shift_id = req.params.exam_shift_id
    let updateExamShift = {
        exam_shift_name: req.body.exam_shift_name, 
        exam_id: req.body.exam_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time
    }
    db.sync().then(function () {
        ExamShift.findOne({ where: { exam_shift_id: exam_shift_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam shift ${exam_shift_id} not exist!`
                })
                return
            }

            data.update({
                exam_shift_name: req.body.exam_shift_name, 
                exam_id: updateExamShift.exam_id,
                start_time: updateExamShift.start_time,
                end_time: updateExamShift.end_time,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update exam shift ${exam_shift_id} successfully`
                })
            })
        })
    })
}

ExamShiftController.deleteExamShiftById = function (req, res) {
    let exam_shift_id = req.params.exam_shift_id
    db.sync().then(function () {
        ExamShift.findOne({ where: { exam_shift_id: exam_shift_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam shift ${exam_shift_id} not exist!`
                })
                return
            }

            return ExamShift.destroy({ where: { exam_shift_id: exam_shift_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Exam shift ${exam_shift_id} deleted!`
                })
            })
        })
    })
}

module.exports = ExamShiftController