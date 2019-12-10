'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    StudentSubject = require('../models/student_subject'),
    ExamSchedule = require('../models/exam_schedule')

let SubjectDefinition = {
    subject_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    subject_name: {
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

let Subject = db.define('subject', SubjectDefinition)
Subject.hasMany(StudentSubject, { foreignKey: 'subject_id' })
Subject.hasMany(ExamSchedule, { foreignKey: 'subject_id' })

module.exports = Subject
