'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    ExamSchedule = require('../models/exam_schedule')

let ExamRoomDefinition = {
    exam_room_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    room_place: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    computer_max_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    computer_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    room_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}

let ExamRoom = db.define('exam_room', ExamRoomDefinition)
ExamRoom.hasMany(ExamSchedule, { foreignKey: 'exam_room_id' })

module.exports = ExamRoom
