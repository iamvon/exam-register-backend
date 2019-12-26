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

            // creating new exam
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

    db.sync().then(function () {
        Exam.hasMany(Subject, { foreignKey: 'exam_id' })
        Subject.belongsTo(Exam, { foreignKey: 'exam_id' })

        Exam.hasMany(ExamRoom, { foreignKey: 'exam_id' })
        ExamRoom.belongsTo(Exam, { foreignKey: 'exam_id' })

        Exam.hasMany(ExamShift, {foreignKey: 'exam_id'})
        ExamShift.belongsTo(Exam, {foreignKey: 'exam_id'})

        let examObj, subjectObj, examRoomObj, examShiftObj
        Exam.findAll({ where: { exam_id: exam_id } }).then(exams => {
            examObj = exams.map(exam => {
                return Object.assign({}, {
                    exam_id: exam.exam_id,
                    exam_name: exam.exam_name,
                    school_year: exam.school_year
                })
            })

            Subject.findAll({ where: { exam_id: exam_id }, include: [Exam] }).then(subjects => {
                subjectObj = subjects.map(subject => {
                    return Object.assign({}, {
                        subject_id: subject.subject_id,
                        subject_code: subject.subject_code,
                        subject_name: subject.subject_name
                    })
                })

                ExamRoom.findAll({ where: { exam_id: exam_id }, include: [Exam] }).then(rooms => {
                    examRoomObj = rooms.map(room => {
                        return Object.assign({}, {
                            exam_room_id: room.exam_room_id,
                            room_place: room.room_place,
                            computer_max_amount: room.computer_max_amount,
                            room_name: room.room_name
                        })
                    })

                    ExamShift.findAll({ where: { exam_id: exam_id }, include: [Exam] }).then(shifts => {
                        examShiftObj = shifts.map(shift => {
                            return Object.assign({}, {
                                exam_shift_id: shift.exam_shift_id,
                                exam_shift_name: shift.exam_shift_name,
                                start_time: shift.start_time,
                                end_time: shift.end_time
                            })
                        })
                        res.status(200).json({
                            success: true,
                            data: [{
                                exam: examObj,
                                subject: subjectObj,
                                exam_room: examRoomObj,
                                exam_shift: examShiftObj
                            }],
                            message: `Get all exam data of exam ${exam_id} from database`
                        })
                    })
                })
            })
        })
    })
}

// ExamController.getListRegisteredStudentByRoomId = function (req, res) {
//     let exam_id = req.params.exam_id
//     let exam = [], subject = [], examRoom = [], examShift = [], schedule = [], registered_amount = 0
//     let scheduleData = [{
//         "subject": subject,
//         "exam_room": examRoom,
//         "exam_shift": examShift
//     }]

//     let resultData = [{
//         exam: exam,
//         schedule: schedule
//     }]
//     db.sync().then(function () {
//         ExamSchedule.findAll({ where: { exam_id: exam_id } }).then(function (data) {
//             if (!data) {
//                 res.status(403).json({
//                     success: false,
//                     data: {},
//                     message: `Exam schedule of exam ${exam_id} not exist!`
//                 })
//                 return
//             }

//             data.forEach((item, index) => {
//                 exam = [], subject = [], examRoom = [], examShift = [], registered_amount = 0
//                 StudentSubject.findAll({ where: { exam_schedule_id: item.dataValues.exam_schedule_id } }).then(registeredCount => {
//                     registered_amount = registeredCount.length
//                 })
//                     .then(
//                         Exam.findOne({ where: { exam_id: exam_id } }).then((data) => {
//                             if (index == 0) {
//                                 let examObj = Object.assign({}, {
//                                     exam_id: data.dataValues.exam_id,
//                                     exam_name: data.dataValues.exam_name,
//                                     school_year: data.dataValues.school_year
//                                 })
//                                 exam.push(examObj)
//                             }
//                         })
//                             .then(Subject.findOne({ where: { subject_id: item.dataValues.subject_id } }).then((data) => {
//                                 let subjectObj = Object.assign({}, {
//                                     subject_id: data.dataValues.subject_id,
//                                     subject_code: data.dataValues.subject_code,
//                                     subject_name: data.dataValues.subject_name
//                                 })
//                                 subject.push(subjectObj)
//                             })
//                                 .then(ExamRoom.findOne({ where: { exam_room_id: item.dataValues.exam_room_id } }).then((data) => {
//                                     let examRoomObj = Object.assign({}, {
//                                         exam_room_id: data.dataValues.exam_room_id,
//                                         room_place: data.dataValues.room_place,
//                                         computer_max_amount: data.dataValues.computer_max_amount,
//                                         registered_amount: registered_amount,
//                                         room_name: data.dataValues.room_name
//                                     })
//                                     examRoom.push(examRoomObj)
//                                 })
//                                     .then(ExamShift.findOne({ where: { exam_shift_id: item.dataValues.exam_shift_id } }).then((data) => {
//                                         let examShiftObj = Object.assign({}, {
//                                             exam_shift_id: data.dataValues.exam_shift_id,
//                                             exam_shift_name: data.dataValues.exam_shift_name,
//                                             start_time: data.dataValues.start_time,
//                                             end_time: data.dataValues.end_time
//                                         })
//                                         examShift.push(examShiftObj)
//                                     })
//                                         .then(() => {
//                                             scheduleData = {
//                                                 "subject": subject,
//                                                 "exam_room": examRoom,
//                                                 "exam_shift": examShift
//                                             }
//                                             schedule.push(scheduleData)

//                                             resultData = [{
//                                                 exam: exam,
//                                                 schedule: schedule
//                                             }]
//                                             subject = [], examRoom = [], examShift = []

//                                             if (index == data.length - 1) {
//                                                 res.status(200).json({
//                                                     success: true,
//                                                     data: resultData,
//                                                     message: `Get all exam schedules of exam ${exam_id} from database`
//                                                 })
//                                             }
//                                         })
//                                     ))
//                             ))
//             })
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
