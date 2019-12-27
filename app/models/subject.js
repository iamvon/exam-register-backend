'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    ExamSubject = require('./exam_subject')

let SubjectDefinition = {
    subject_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    subject_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
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
Subject.hasMany(ExamSubject, { foreignKey: 'subject_id' })

module.exports = Subject
