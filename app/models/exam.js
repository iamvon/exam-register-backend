'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    ExamRoom = require('../models/exam_room'),
    ExamShift = require('../models/exam_shift'),
    ExamSchedule = require('../models/exam_schedule'),
    Subject = require('../models/subject')

let ExamDefinition = {
    exam_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    exam_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    school_year: {
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

let Exam = db.define('exam', ExamDefinition)
Exam.hasMany(ExamRoom, {foreignKey: 'exam_id'})
Exam.hasMany(ExamShift, {foreignKey: 'exam_id'})
Exam.hasMany(ExamSchedule, {foreignKey: 'exam_id'})
Exam.hasMany(Subject, {foreignKey: 'exam_id'})

module.exports = Exam
