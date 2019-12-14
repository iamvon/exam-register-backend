'use strict'

let Sequelize = require('sequelize'),
    Subject = require('../models/subject'),
    db = require('../services/database')

let SubjectController = {}

SubjectController.createNewSubject = function (req, res) {
    db.sync().then(function () {
        let newSubject = {
            subject_name: req.body.subject_name,
            subject_id: req.body.subject_id
        }

        Subject.findOne({ where: { subject_id: req.body.subject_id } }).then(function (subject) {
            if (subject) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Subject ${req.body.subject_name} - ${req.body.subject_id} already exists!`
                    },
                    status: 403
                })
                return
            }

            // creating new subject
            return Subject.create(newSubject).then(function () {
                res.status(201).json({
                    data: {
                        success: true,
                        data: {
                            subject_id: newSubject.subject_id
                        },
                        message: `Subject ${req.body.subject_name} - ${req.body.subject_id} created!`,
                    },
                    status: 201
                });
            })
        })
    })
}

SubjectController.getAllSubject = function (req, res) {
    db.sync().then(function () {
        Subject.findAll({}).then(function (data) {
            res.status(200).json({
                data: {
                    success: true,
                    data: data,
                    message: "Get all subjects from database",
                },
                status: 200
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}


SubjectController.getSubjectById = function (req, res) {
    let subject_id = req.params.subject_id
    db.sync().then(function () {
        Subject.findOne({ where: { subject_id: subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Subject ${subject_id} not exist!`,
                    },
                    status: 403
                })
                return
            }

            res.status(200).json({
                data: {
                    success: true,
                    data: data,
                    message: `Get subject ${subject_id} from database`
                },
                status: 200
            })
        }).catch(function (err) {
            return next(err)
        })
    })
}

SubjectController.updateSubjectById = function (req, res) {
    let subject_id = req.params.subject_id
    let updateSubject = {
        subject_name: req.body.subject_name,
        subject_id: req.body.subject_id
    }
    db.sync().then(function () {
        Subject.findOne({ where: { subject_id: subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Subject ${subject_id} not exist!`
                    },
                    status: 403
                })
                return
            }

            data.update({
                subject_name: updateSubject.subject_name,
                subject_id: updateSubject.subject_id,
                updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
            }).then(function () {
                res.status(200).json({
                    data: {
                        success: true,
                        data: {},
                        message: `Update subject ${subject_id} successfully`
                    },
                    status: 200
                })
            })
        })
    })
}

SubjectController.deleteSubjectById = function (req, res) {
    let subject_id = req.params.subject_id
    db.sync().then(function () {
        Subject.findOne({ where: { subject_id: subject_id } }).then(function (data) {
            if (!data) {
                res.status(403).json({
                    data: {
                        success: false,
                        data: {},
                        message: `Subject ${subject_id} not exist!`
                    },
                    status: 403
                })
                return
            }

            return Subject.destroy({ where: { subject_id: subject_id } }).then(function () {
                res.status(200).json({
                    data: {
                        success: true,
                        data: {},
                        message: `Subject ${subject_id} deleted!`
                    },
                    status: 200
                })
            })
        })
    })
}

module.exports = SubjectController