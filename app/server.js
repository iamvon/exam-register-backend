'use strict'

let express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    sequelize = require('sequelize'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    hookJWTStrategy = require('./services/passportStrategy'),
    config = require('./config')

let app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(passport.initialize())
hookJWTStrategy(passport);

app.use('/api', require('./routes/api')(passport))

app.get('/', function(req, res) {
    res.send('Hello !')
})

app.listen(config.server.port, function() {
    console.log('Server is running on http://localhost:8080/')
})