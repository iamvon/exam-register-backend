'use strict'

let config = module.exports

config.db = {
    user: 'root',
    password: 'conmeo',
    name: 'web_db'
}

config.db.details = {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
        freezeTableName: true
    }
}

config.server = {
    host: '127.0.0.1',
    port: '8080' 
}

config.keys = {
    secret: 'secret'
}

config.tokenLifeTime = '60m' // Time in minutes

let userRoles = config.userRoles = {
    guest: 1,   // ...001
    user: 2,    // ...010
    admin: 4,   // ...100
}

config.accessLevels = {
    guest: userRoles.guest | userRoles.user | userRoles.admin,      // ...111
    user: userRoles.user | userRoles.admin,                         // ...110
    admin: userRoles.admin,                                         // ...100
}