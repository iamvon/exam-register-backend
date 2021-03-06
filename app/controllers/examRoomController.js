'use strict'

let Sequelize = require('sequelize'),
    ExamRoom = require('../models/exam_room'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let ExamRoomController = {}

ExamRoomController.createNewExamRoom = function (req, res) {
    db.sync().then(function () {
        let newExamRoom = {
            exam_room_id: uuid(),
            exam_id: req.body.exam_id,
            room_place: req.body.room_place,
            room_name: req.body.room_name,
            computer_max_amount: req.body.computer_max_amount
        }

        ExamRoom.findOne({ where: { exam_id: newExamRoom.exam_id, room_place: newExamRoom.room_place, room_name: newExamRoom.room_name, computer_max_amount: newExamRoom.computer_max_amount } }).then(function (data) {
            if (data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `This exam room already exists!`
                })
                return
            }

            // creating new exam room
            return ExamRoom.create(newExamRoom).then(function () {
                res.status(200).json({
                    success: true,
                    data: {
                        exam_room_id: newExamRoom.exam_room_id
                    },
                    message: `New exam room created!`,
                });
            })
        })
    })
}

ExamRoomController.getAllExamRoom = function (req, res) {
    db.sync().then(function () {
        ExamRoom.findAll({}).then(function (data) {
            res.status(200).json({
                success: true,
                data: data,
                message: "Get all exam rooms from database"
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamRoomController.getExamRoomById = function (req, res) {
    let exam_room_id = req.params.exam_room_id
    db.sync().then(function () {
        ExamRoom.findOne({ where: { exam_room_id: exam_room_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam room ${exam_room_id} not exist!`
                })
                return
            }

            res.status(200).json({
                success: true,
                data: data,
                message: `Get exam room ${exam_room_id} from database`
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

ExamRoomController.updateExamRoomById = function (req, res) {
    let exam_room_id = req.params.exam_room_id
    let updateExamRoom = {
        exam_id: req.body.exam_id,
        room_place: req.body.room_place,
        room_name: req.body.room_name,
        computer_max_amount: req.body.computer_max_amount
    }

    db.sync().then(function () {
        ExamRoom.findOne({ where: { exam_room_id: exam_room_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam room ${exam_room_id} not exist!`
                })
                return
            }

            data.update({
                exam_id: updateExamRoom.exam_id,
                room_place: updateExamRoom.room_place,
                room_name: updateExamRoom.room_name,
                computer_max_amount: updateExamRoom.computer_max_amount,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Update exam room ${exam_room_id} successfully`
                })
            })
        })
    })
}

ExamRoomController.deleteExamRoomById = function (req, res) {
    let exam_room_id = req.params.exam_room_id
    db.sync().then(function () {
        ExamRoom.findOne({ where: { exam_room_id: exam_room_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    success: false,
                    data: {},
                    message: `Exam room ${exam_room_id} not exist!`
                })
                return
            }

            return ExamRoom.destroy({ where: { exam_room_id: exam_room_id } }).then(function () {
                res.status(200).json({
                    success: true,
                    data: {},
                    message: `Exam room ${exam_room_id} deleted!`
                })
            })
        })
    })
}

module.exports = ExamRoomController