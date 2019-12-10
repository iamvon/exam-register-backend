'use strict'

let Subject = require('../models/subject'),
    db = require('../services/database')

let SubjectController = {}

SubjectController.addSubject = function (req, res) {
    db.sync().then(function () {
        let newSubject = {
            subject_id: req.body.subject_id,
            subject_name: req.body.subject_name
        }

        Subject.findOne({ where: { subject_id: req.body.subject_id } }).then(function (subject) {
            if (subject) {
                res.status(403).json({ message: `Subject ${req.body.subject_name} - ${req.body.subject_id} already exists!` })
                return
            }

            // Adding new subject
            return Subject.create(newSubject).then(function () {
                res.status(201).json({ message: `Subject ${req.body.subject_name} - ${req.body.subject_id} added!` });
            })
        })
    })
}

SubjectController.deleteSubject = function (req, res) {
    db.sync().then(function () {
        Subject.findOne({ where: { subject_id: req.body.subject_id } }).then(function (subject) {
            if (!subject) {
                res.status(403).json({ message: `Subject ${req.body.subject_name} - ${req.body.subject_id} not exist!` })
                return
            }

            return Subject.destroy({ where: { subject_id: req.body.subject_id } }).then(function () {
                res.status(201).json({ message: `Subject ${req.body.subject_name} - ${req.body.subject_id} deleted!` })
            })
        })
    })
}

module.exports = SubjectController