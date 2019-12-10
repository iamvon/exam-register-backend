'use strict'

let StudentController = require('./studentController'),
    SubjectController = require('./subjectController')

let AdminController = {
    index: function (req, res) {
        res.status(200).json({ message: 'Welcome to the admin area ' + req.user.username + '!' })
    },
    student: StudentController,
    subject: SubjectController
}

module.exports = AdminController