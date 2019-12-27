'use strict'

let StudentController = require('./studentController'),
    SubjectController = require('./subjectController'),
    ExamController = require('./examController'),
    ExamShiftController = require('./examShiftController'),
    ExamRoomController = require('./examRoomController'),
    StudentExamSubjectController = require('./studentExamSubjectController'),
    ExamScheduleController = require('./examScheduleController'),
    ExamSubjectController = require('./examSubjectController')

let AdminController = {
    student: StudentController,
    subject: SubjectController,
    exam: ExamController,
    exam_shift: ExamShiftController,
    exam_room: ExamRoomController,
    student_exam_subject: StudentExamSubjectController,
    exam_schedule: ExamScheduleController,
    exam_subject: ExamSubjectController 
}

module.exports = AdminController