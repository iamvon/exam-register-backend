'use strict'

let Sequelize = require('sequelize'),
    bcrypt = require('bcrypt')

let config = require('../config'),
    db = require('../services/database')

let UserDefinition = {
    id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: config.userRoles.guest
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

let UserOptions = {
    hooks: {
        beforeValidate: hashPassword
    }
}

let User = db.define('user', UserDefinition, UserOptions)
User.prototype.comparePasswords = comparePasswords

function comparePasswords(password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error) {
            return callback(error);
        }

        return callback(null, isMatch);
    });
}

function hashPassword(user) {
    if (user.changed('password')) {
        return bcrypt.hash(user.password, 10).then(function (password) {
            user.password = password;
        });
    }
}

module.exports = User
