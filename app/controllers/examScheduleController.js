'use strict'

let Sequelize = require('sequelize'),
    ExamSchedule = require('../models/exam_schedule'),
    Subject = require('../models/subject'),
    ExamRoom = require('../models/exam_room'),
    ExamShift = require('../models/exam_shift'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let ExamScheduleController = {}

ExamScheduleController.createNewExamSchedule = function (req, res) {
    db.sync().then(function () {
        let newExamSchedule = {
            exam_schedule_id: uuid(),
            exam_shift_id: req.body.exam_shift_id,
            subject_id: req.body.subject_id,
            exam_room_id: req.body.exam_room_id,
            exam_id: req.body.exam_id
        }

        ExamSchedule.findOne({ where: { exam_shift_id: newExamSchedule.exam_shift_id, subject_id: newExamSchedule.subject_id, exam_room_id: newExamSchedule.exam_room_id } }).then(function (data) {
            if (data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: 'This exam schedule already exists!'
                })
                return
            }

            // creating new exam schedule
            return ExamSchedule.create(newExamSchedule).then(function () {
                res.status(200).json({
                    success: true,
                    data: {
                        exam_schedule_id: newExamSchedule.exam_schedule_id
                    },
                    message: 'New exam schedule created!',
                });
            })
        })
    })
}

ExamScheduleController.getAllExamSchedule = function (req, res) {
    db.sync().then(function () {
        ExamSchedule.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all exam schedules from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamScheduleController.getExamScheduleById = function (req, res) {
    let exam_schedule_id = req.params.exam_schedule_id
    db.sync().then(function () {
        ExamSchedule.findOne({ where: { exam_schedule_id: exam_schedule_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam schedule ${exam_schedule_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get exam schedule ${exam_schedule_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

function getSubjectFromSubjectId(subjectId) {
    db.sync().then(function () {
        Subject.findOne({ where: { subject_id: subjectId } }).then(function (subject) {
            if (!subject) {
                console.log(`Subject ${subjectId} not exist!`)
                return
            }
            console.log(subject.dataValues)

            return subject.dataValues
        }).catch(function (err) {
            return next(err)
        })
    })
}

function getExamRoomFromExamRoomId(examRoomId) {
    db.sync().then(function () {
        ExamRoom.findOne({ where: { exam_room_id: examRoomId } }).then(function (examRoom) {
            if (!examRoom) {
                console.log(`Exam room ${examRoomId} not exist!`)
                return
            }
            console.log(examRoom.dataValues)

            return examRoom.dataValues
        }).catch(function (err) {
            return next(err)
        })
    })
}

function getExamShiftFromExamShiftId(examShiftId) {
    db.sync().then(function () {
        ExamShift.findOne({ where: { exam_shift_id: examShiftId } }).then(function (examShift) {
            if (!examShift) {
                console.log(`Exam shift ${examShiftId} not exist!`)
                return
            }
            console.log(examShift.dataValues)

            return examShift.dataValues
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamScheduleController.getAllExamScheduleByExamId = function (req, res) {
    let exam_id = req.params.exam_id
    let subject = [], examRoom = [], examShift = []
    let resultData = {
        "subject": subject,
        "exam_room": examRoom,
        "exam_shift": examShift
    }
    db.sync().then(function () {
        ExamSchedule.findAll({ where: { exam_id: exam_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `All exam schedules of exam ${exam_id} not exist!`
                })
                return
            }

            data.forEach(item => {
                subject.push(getSubjectFromSubjectId(item.dataValues.subject_id))
                console.log(getSubjectFromSubjectId(item.dataValues.subject_id))
                examRoom.push(getExamRoomFromExamRoomId(item.dataValues.exam_room_id))
                console.log(getExamRoomFromExamRoomId(item.dataValues.exam_room_id))
                examShift.push(getExamShiftFromExamShiftId(item.dataValues.exam_shift_id))
                console.log(getExamShiftFromExamShiftId(item.dataValues.exam_shift_id))
            })

            res.status(200).json({
                success: true,
                data: resultData,
                message: `Get all exam schedules of exam ${exam_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamScheduleController.updateExamScheduleById = function (req, res) {
    let exam_schedule_id = req.params.exam_schedule_id
    let updateExamSchedule = {
        exam_shift_id: req.body.exam_shift_id,
        subject_id: req.body.subject_id,
        exam_room_id: req.body.exam_room_id,
        exam_id: req.body.exam_id
    }
    db.sync().then(function () {
        ExamSchedule.findOne({ where: { exam_schedule_id: exam_schedule_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam schedule ${exam_schedule_id} not exist!`
                })
                return
            }

            data.update({
                exam_shift_id: updateExamSchedule.exam_shift_id,
                subject_id: updateExamSchedule.subject_id,
                exam_room_id: updateExamSchedule.exam_room_id,
                exam_id: req.body.exam_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update exam schedule ${exam_schedule_id} successfully`
                })
            })
        })
    })
}

ExamScheduleController.deleteExamScheduleById = function (req, res) {
    let exam_schedule_id = req.params.exam_schedule_id
    db.sync().then(function () {
        ExamSchedule.findOne({ where: { exam_schedule_id: exam_schedule_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam schedule ${exam_schedule_id} not exist!`
                })
                return
            }

            return ExamSchedule.destroy({ where: { exam_schedule_id: exam_schedule_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Exam schedule ${exam_schedule_id} deleted!`
                })
            })
        })
    })
}

module.exports = ExamScheduleController