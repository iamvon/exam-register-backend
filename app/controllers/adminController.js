'use strict'

let StudentController = require('./studentController'),
    SubjectController = require('./subjectController'),
    ExamController = require('./examController'),
    ExamShiftController = require('./examShiftController'),
    ExamRoomController = require('./examRoomController'),
    StudentSubjectController = require('./studentSubjectController'),
    ExamScheduleController = require('./examScheduleController')

let AdminController = {
    index: function (req, res) {
        res.status(200).json({ message: 'Welcome to the admin area ' + req.user.username + '!' })
    },
    student: StudentController,
    subject: SubjectController,
    exam: ExamController,
    exam_shift: ExamShiftController,
    exam_room: ExamRoomController,
    student_subject: StudentSubjectController,
    exam_schedule: ExamScheduleController 
}

module.exports = AdminController