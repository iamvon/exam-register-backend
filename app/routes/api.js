'use strict'

let router = require('express').Router()
let config = require('../config'),
    AuthController = require('../controllers/authController'),
    allowOnly = require('../services/routesHelper').allowOnly,
    UserController = require('../controllers/userController'),
    AdminController = require('../controllers/adminController')

let APIRoutes = function (passport) {
    // User api
    router.post('/signup', AuthController.signUp)
    router.post('/login', AuthController.login)
    router.post('/token', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AuthController.token))
    router.post('/user/:user_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, UserController.updateUserById))
    router.get('/user/student/:student_code', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, UserController.getUserIdByStudentCode))
    router.get('/user', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, UserController.getAllUser))
    router.get('/user/:user_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, UserController.getUserById))
    
    // Delete refresh token of an user
    router.post('/token/reject', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AuthController.rejectRefreshToken))

    // Student api 
    router.get('/student', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.getAllStudent))
    router.get('/student/:student_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.getStudentById))
    router.get('/student/student_code/:student_code', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.getStudentByCode))
    router.post('/student/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.createStudent))
    router.post('/student/:student_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.updateStudentById))
    router.post('/student/delete/:student_code', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.deleteStudentByCode))
    router.post('/student/exam_schedule/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.getAllStudentSchedule))

    // Subject api
    router.get('/subject', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.subject.getAllSubject))
    router.get('/subject/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.subject.getSubjectById))
    router.get('/subject/subject_code/:subject_code', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.subject.getSubjectByCode))
    router.post('/subject/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.createNewSubject))
    router.post('/subject/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.updateSubjectById))
    router.post('/subject/delete/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.deleteSubjectById))
    
    // Exam api
    router.get('/exam', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam.getAllExam))
    router.get('/exam/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam.getExamById))
    router.post('/exam/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.createNewExam))
    router.post('/exam/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.updateExamById))
    router.post('/exam/delete/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.deleteExamById))

    // Exam shift api
    router.get('/exam_shift', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_shift.getAllExamShift))
    router.get('/exam_shift/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_shift.getExamShiftById))
    router.post('/exam_shift/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.createNewExamShift))
    router.post('/exam_shift/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.updateExamShiftById))
    router.post('/exam_shift/delete/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.deleteExamShiftById))

    // Exam room api
    router.get('/exam_room', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_room.getAllExamRoom))
    router.get('/exam_room/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_room.getExamRoomById))
    router.post('/exam_room/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.createNewExamRoom))
    router.post('/exam_room/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.updateExamRoomById))
    router.post('/exam_room/delete/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.deleteExamRoomById))

    // Exam schedule api
    router.get('/exam_schedule', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_schedule.getAllExamSchedule))
    router.get('/exam_schedule/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_schedule.getExamScheduleById))
    router.get('/exam_schedule/exam_id/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_schedule.getAllExamScheduleByExamId))
    router.post('/exam_schedule/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.createNewExamSchedule))
    router.post('/exam_schedule/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.updateExamScheduleById))
    router.post('/exam_schedule/delete/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.deleteExamScheduleById))
    
    // Student-subject api
    router.get('/student_subject', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.getAllStudentSubject))
    router.get('/student_subject/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.getStudentSubjectById))
    router.post('/student_subject/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.createNewStudentSubject))
    router.post('/student_subject/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.updateStudentSubjectById))
    router.post('/student_subject/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.getStudentSubjectBySubjectId))
    router.post('/student_subject/delete/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.deleteStudentSubjectById))

    return router
}

module.exports = APIRoutes

