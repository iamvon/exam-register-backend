'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database'),
    StudentSubject = require('../models/student_subject')
// let User = require('../models/user')

let StudentDefinition = {
    student_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    
    avatar_url: {
        type: Sequelize.STRING,
        allowNull: false
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false
    },

    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },

    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    },

    class: {
        type: Sequelize.STRING,
        allowNull: false
    },

    date_birth: {
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

let Student = db.define('student', StudentDefinition)
Student.hasMany(StudentSubject, { foreignKey: 'student_id' })
// Student.hasOne(User, { foreignKey: 'username'})

module.exports = Student
