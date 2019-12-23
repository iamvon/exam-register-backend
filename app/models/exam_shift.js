'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    ExamSchedule = require('../models/exam_schedule')

let ExamShiftDefinition = {
    exam_shift_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    exam_shift_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    start_time: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },

    end_time: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

let ExamShift = db.define('exam_shift', ExamShiftDefinition)
ExamShift.hasMany(ExamSchedule, {foreignKey: 'exam_shift_id'})

module.exports = ExamShift
