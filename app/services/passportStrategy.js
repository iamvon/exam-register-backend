'use strict'

let JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt

let User = require('../models/user'),
    config = require('../config')

// Hook the passport JWT strategy
function hookJWTStrategy(passport) {
    let options = {}

    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    options.secretOrKey = config.keys.secret
    options.ignoreExpiration = false

    passport.use(new JWTStrategy(options, function (JWTPayload, callback) {
        User.findOne({ where: { username: JWTPayload.username } })
            .then(function (user) {
                if (!user) {
                    callback(null, false);
                    return;
                }

                callback(null, user);
            })
    }))
}

module.exports = hookJWTStrategy