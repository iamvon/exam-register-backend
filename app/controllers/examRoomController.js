// 'use strict'

// let ExamRoom = require('../models/exam_room'),
//     db = require('../services/database')

// let ExamRoomController = {}

// ExamRoomController.addExam = function (req, res) {
//     db.sync().then(function () {
//         let newExamRoom = {
//             exam_room_id: req.body.exam_room_id,
//             room_place: req.body.room_place,
//             computer_max_amount: req.body.computer_max_amount,
//             computer_amount: req.body.computer_amount,
//             room_name: req.body.room_name  
//         }

//         ExamRoom.findOne({ where: { exam_id: req.body.exam_room_id } }).then(function (examRoom) {
//             if (examRoom) {
//                 res.status(403).json({ message: `Exam room ${req.body.exam_room_id} already exists!` })
//                 return
//             }

//             // Adding new exam
//             return ExamRoom.create(newExam).then(function () {
//                 res.status(201).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} added!` });
//             })
//         })
//     })
// }

// ExamController.deleteExam = function (req, res) {
//     db.sync().then(function () {
//         Exam.findOne({ where: { exam_id: req.body.exam_id } }).then(function (examRoom) {
//             if (!examRoom) {
//                 res.status(403).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} not exist!` })
//                 return
//             }

//             return Exam.destroy({ where: { exam_id: req.body.exam_id } }).then(function () {
//                 res.status(201).json({ message: `Exam ${req.body.exam_name} - ${req.body.exam_id} deleted!` })
//             })
//         })
//     })
// }

// module.exports = ExamController