'use strict'

let router = require('express').Router()
let config = require('../config'),
    AuthController = require('../controllers/authController'),
    allowOnly = require('../services/routesHelper').allowOnly,  
    UserController = require('../controllers/userController'),
    AdminController = require('../controllers/adminController')

let APIRoutes = function(passport) {
    // Registering Users
    router.post('/signup', AuthController.signUp)
    router.post('/authenticate', AuthController.authenticateUser)
    router.get('/profile', passport.authenticate('jwt', {session: false}), allowOnly(config.accessLevels.user, UserController.index))
    
    router.get('/admin', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.index))
    
    // Student api 
    router.post('/student/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.addStudent))
    router.post('/student/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.deleteStudent))

    // Subject api
    router.post('/subject/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.addSubject))
    router.post('/subject/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.deleteSubject))

    return router
}

module.exports = APIRoutes

