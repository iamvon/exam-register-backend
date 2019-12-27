'use strict'

let Sequelize = require('sequelize'),
    ExamSchedule = require('../models/exam_schedule'),
    Subject = require('../models/subject'),
    ExamRoom = require('../models/exam_room'),
    ExamShift = require('../models/exam_shift'),
    StudentSubject = require('../models/student_subject'),
    Exam = require('../models/exam'),
    db = require('../services/database')

const { uuid } = require('uuidv4')
const Op = Sequelize.Op

let ExamScheduleController = {}

ExamScheduleController.createNewExamSchedule = function (req, res) {
    db.sync().then(function () {
        let newExamSchedule = {
            exam_schedule_id: uuid(),
            exam_shift_id: req.body.exam_shift_id,
            date: req.body.date,
            subject_id: req.body.subject_id,
            exam_room_id: req.body.exam_room_id,
            exam_id: req.body.exam_id
        }

        ExamSchedule.findOne({ where: { exam_shift_id: newExamSchedule.exam_shift_id, subject_id: newExamSchedule.subject_id, exam_room_id: newExamSchedule.exam_room_id, date: newExamSchedule.date } }).then(function (data) {
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

ExamScheduleController.getAllExamScheduleByExamId = function (req, res) {
    let exam_id = req.params.exam_id
    let exam = [], subject = [], examRoom = [], examShift = [], schedule = [], registered_amount = 0
    let scheduleData = [{
        "subject": subject,
        "exam_room": examRoom,
        "exam_shift": examShift
    }]

    let resultData = [{
        exam: exam,
        schedule: schedule
    }]
    db.sync().then(function () {
        ExamSchedule.findAll({ where: { exam_id: exam_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam schedule of exam ${exam_id} not exist!`
                })
                return
            }

            data.forEach((item, index) => {
                exam = [], subject = [], examRoom = [], examShift = [], registered_amount = 0
                StudentSubject.findAll({ where: { exam_schedule_id: item.dataValues.exam_schedule_id } }).then(registeredCount => {
                    registered_amount = registeredCount.length
                })
                    .then(
                        Exam.findOne({ where: { exam_id: exam_id } }).then((data) => {
                            if (index == 0) {
                                let examObj = Object.assign({}, {
                                    exam_id: data.dataValues.exam_id,
                                    exam_name: data.dataValues.exam_name,
                                    school_year: data.dataValues.school_year
                                })
                                exam.push(examObj)
                            }
                        })
                            .then(Subject.findOne({ where: { subject_id: item.dataValues.subject_id } }).then((data) => {
                                let subjectObj = Object.assign({}, {
                                    subject_id: data.dataValues.subject_id,
                                    subject_code: data.dataValues.subject_code,
                                    subject_name: data.dataValues.subject_name
                                })
                                subject.push(subjectObj)
                            })
                                .then(ExamRoom.findOne({ where: { exam_room_id: item.dataValues.exam_room_id } }).then((data) => {
                                    let examRoomObj = Object.assign({}, {
                                        exam_room_id: data.dataValues.exam_room_id,
                                        room_place: data.dataValues.room_place,
                                        computer_max_amount: data.dataValues.computer_max_amount,
                                        registered_amount: registered_amount,
                                        room_name: data.dataValues.room_name
                                    })
                                    examRoom.push(examRoomObj)
                                })
                                    .then(ExamShift.findOne({ where: { exam_shift_id: item.dataValues.exam_shift_id } }).then((data) => {
                                        let examShiftObj = Object.assign({}, {
                                            exam_shift_id: data.dataValues.exam_shift_id,
                                            exam_shift_name: data.dataValues.exam_shift_name,
                                            date: item.dataValues.date,
                                            start_time: data.dataValues.start_time,
                                            end_time: data.dataValues.end_time
                                        })
                                        examShift.push(examShiftObj)
                                    })
                                        .then(() => {
                                            scheduleData = {
                                                "subject": subject,
                                                "exam_room": examRoom,
                                                "exam_shift": examShift
                                            }
                                            schedule.push(scheduleData)

                                            resultData = [{
                                                exam: exam,
                                                schedule: schedule
                                            }]
                                            subject = [], examRoom = [], examShift = []

                                            if (index == data.length - 1) {
                                                res.status(200).json({
                                                    success: true,
                                                    data: resultData,
                                                    message: `Get all exam schedules of exam ${exam_id} from database`
                                                })
                                            }
                                        })
                                    ))
                            ))
            })
        })
    })
}

ExamScheduleController.updateExamScheduleById = function (req, res) {
    let exam_schedule_id = req.params.exam_schedule_id
    let updateExamSchedule = {
        exam_shift_id: req.body.exam_shift_id,
        subject_id: req.body.subject_id,
        exam_room_id: req.body.exam_room_id,
        exam_id: req.body.exam_id,
        date: req.body.date,
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
                date: req.body.date,
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
