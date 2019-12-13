'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    StudentSubject = require('../models/student_subject')

let ExamScheduleDefinition = {
    exam_schedule_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
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

let ExamSchedule = db.define('exam_schedule', ExamScheduleDefinition)
ExamSchedule.hasMany(StudentSubject, { foreignKey: 'exam_schedule_id' })

module.exports = ExamSchedule
