'use strict'

let router = require('express').Router()
let config = require('../config'),
    AuthController = require('../controllers/authController'),
    allowOnly = require('../services/routesHelper').allowOnly,
    UserController = require('../controllers/userController'),
    AdminController = require('../controllers/adminController')

let APIRoutes = function (passport) {
    // Registering Users
    router.post('/signup', AuthController.signUp)
    router.post('/authenticate', AuthController.authenticateUser)
    router.get('/profile', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, UserController.index))

    router.get('/admin', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.index))

    // Student api 
    router.post('/student/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.createStudent))
    router.post('/student/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student.deleteStudent))

    // Subject api
    router.post('/subject/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.createNewSubject))
    router.get('/subject', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.subject.getAllSubject))
    router.get('/subject/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.subject.getSubjectById))
    router.post('/subject/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.updateSubjectById))
    router.post('/subject/delete/:subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.subject.deleteSubjectById))

    // Student-subject api
    router.post('/student_subject/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.createNewStudentSubject))
    router.get('/student_subject', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.getAllStudentSubject))
    router.get('/student_subject/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.getStudentSubjectById))
    router.post('/student_subject/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.updateStudentSubjectById))
    router.post('/student_subject/delete/:student_subject_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.student_subject.deleteStudentSubjectById))

    // Exam api
    router.post('/exam/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.createNewExam))
    router.get('/exam', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam.getAllExam))
    router.get('/exam/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam.getExamById))
    router.post('/exam/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.updateExamById))
    router.post('/exam/delete/:exam_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam.deleteExamById))

    // Exam shift api
    router.post('/exam_shift/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.createNewExamShift))
    router.get('/exam_shift', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_shift.getAllExamShift))
    router.get('/exam_shift/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_shift.getExamShiftById))
    router.post('/exam_shift/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.updateExamShiftById))
    router.post('/exam_shift/delete/:exam_shift_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_shift.deleteExamShiftById))

    // Exam room api
    router.post('/exam_room/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.createNewExamRoom))
    router.get('/exam_room', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_room.getAllExamRoom))
    router.get('/exam_room/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_room.getExamRoomById))
    router.post('/exam_room/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.updateExamRoomById))
    router.post('/exam_room/delete/:exam_room_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_room.deleteExamRoomById))

    // Exam schedule api
    router.post('/exam_schedule/create', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.createNewExamSchedule))
    router.get('/exam_schedule', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_schedule.getAllExamSchedule))
    router.get('/exam_schedule/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, AdminController.exam_schedule.getExamScheduleById))
    router.post('/exam_schedule/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.updateExamScheduleById))
    router.post('/exam_schedule/delete/:exam_schedule_id', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.exam_schedule.deleteExamScheduleById))

    return router
}

module.exports = APIRoutes

