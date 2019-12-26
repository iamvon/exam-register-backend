'use strict'

let Sequelize = require('sequelize'),
    ExamRoom = require('../models/exam_room'),
    db = require('../services/database')

const { uuid } = require('uuidv4')

let ExamRoomController = {}

ExamRoomController.createNewExamRoom = function (req, res) {
    db.sync().then(function () {
        let examRoomInputData = JSON.parse(JSON.stringify(req.body))
        let listNewExamRoomCreated = []
        let listExamRoomExisted = []

        examRoomInputData.forEach((examRoom, index) => {
            let newExamRoom = {
                exam_room_id: uuid(),
                exam_id: examRoom.exam_id,
                room_place: examRoom.room_place,
                room_name: examRoom.room_name,
                computer_max_amount: examRoom.computer_max_amount
            }

            ExamRoom.findOne({ where: { exam_id: newExamRoom.exam_id, room_place: newExamRoom.room_place, room_name: newExamRoom.room_name, computer_max_amount: newExamRoom.computer_max_amount } }).then(function (data) {
                if (data) {
                    listExamRoomExisted.push({
                        exam_room_id: data.dataValues.exam_room_id
                        
                    })
                    // console.log(listNewExamRoomCreated.length)
                    if (index == examRoomInputData.length - 1) {
                        if (listNewExamRoomCreated.length == 0) {
                            res.status(403).json({
                                success: false,
                                data: {},
                                message: `Error when creating new exam room, please check the console!`
                            })
                        }
                    }
                    console.log('This exam room already exists!')
                    return
                }

                // Creating new exam room
                ExamRoom.create(newExamRoom).then(function () {
                    listNewExamRoomCreated.push({
                        exam_room_id: newExamRoom.exam_room_id
                    })
                    // console.log(listNewExamRoomCreated.length)

                    console.log(`New exam room ${newExamRoom.exam_room_id} created!`)

                    if (index == examRoomInputData.length - 1) {
                        res.status(200).json({
                            success: true,
                            data: [{
                                new_exam_room_created: listNewExamRoomCreated,
                                exam_room_existed: listExamRoomExisted
                            }],
                            message: `Exam rooms in list new_exam_room_created created!`,
                        })
                    }
                })
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