let ExamSchedule = require('../exam_schedule'),
    ExamRoom = require('../exam_room'),
    ExamShift = require('../exam_shift'),
    Subject = require('../subject'),
    Student = require('../student'),
    StudentSubject = require('../student_subject'),
    Exam = require('../exam')

ExamRoom.hasMany(ExamSchedule, { foreignKey: 'exam_room_id' })
ExamRoom.belongsTo(Exam, {foreignKey: 'exam_id'})

ExamSchedule.belongsTo(ExamRoom, { foreignKey: 'exam_room_id' }) 
ExamSchedule.belongsTo(ExamShift, { foreignKey: 'exam_shift_id' }) 
ExamSchedule.belongsTo(Exam, {foreignKey: 'exam_id'})
ExamSchedule.belongsTo(Subject, { foreignKey: 'subject_id' })

ExamShift.hasMany(ExamSchedule, {foreignKey: 'exam_shift_id'})
ExamShift.belongsTo(Exam, {foreignKey: 'exam_id'})

Exam.hasMany(ExamRoom, {foreignKey: 'exam_id'})
Exam.hasMany(ExamShift, {foreignKey: 'exam_id'})
Exam.hasMany(ExamSchedule, {foreignKey: 'exam_id'})

StudentSubject.belongsTo(Student, { foreignKey: 'student_id' })
StudentSubject.belongsTo(Subject, { foreignKey: 'subject_id' })

Student.hasMany(StudentSubject, { foreignKey: 'student_id' })

Subject.hasMany(StudentSubject, { foreignKey: 'subject_id' })
Subject.hasMany(ExamSchedule, { foreignKey: 'subject_id' })
