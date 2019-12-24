'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    Student = require('../models/student')

let StudentSubjectDefinition = {
    student_subject_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true
    },

    can_join_exam: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },

    exam_schedule_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: true,
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

let StudentSubject = db.define('student_subject', StudentSubjectDefinition)

module.exports = StudentSubject
