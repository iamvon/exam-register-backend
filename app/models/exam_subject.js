'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    StudentExamSubject = require('../models/student_exam_subject'),
    ExamSchedule = require('../models/exam_schedule')

let ExamSubjectDefinition = {
    exam_subject_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    date: {
        type: Sequelize.STRING,
        allowNull: false
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

let ExamSubject = db.define('exam_subject', ExamSubjectDefinition)
ExamSubject.hasMany(StudentExamSubject, { foreignKey: 'exam_subject_id' })
ExamSubject.hasMany(ExamSchedule, { foreignKey: 'exam_subject_id' })

module.exports = Subject
