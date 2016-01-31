'use strict';

var Projects = require('../models/project.js');

function save (req, res, next) {
    Projects.createUnique(req.body).then((project) => {
        res.json({
            data: project
        });
    }).catch((err) => {
        if (err.type && err.type === 'conflict') {
            res.errorInfo = { status: 409, detail: err.message };
            return next();
        }
        res.errorInfo = { status: 500 };
        next();
    });
};

function getAll (req, res, next) {
    Projects.find().then((projects) => {
        if (projects.length === 0) {
            res.errorInfo = { status: 404, title: 'No Projects Found' };
            return next();
        }

        res.json({
            data: projects
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
};

function getOne (req, res, next) {
    var projectId = req.params.projectId;

    Projects.findOne({ _id: projectId }).then((project) => {
        if (!project) {
            res.errorInfo = { status: 404, title: 'Project Not Found' };
            return next();
        }

        res.json({
            data: project
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
};

function update (req, res, next) {
    var projectId = req.params.projectId;

    Projects.findByIdAndUpdate(projectId, req.body, { new: true }).then((project) => {
        if (!project) {
            res.errorInfo = { status: 404, title: 'Project Not Found' };
            return next();
        }

        res.json({
            data: project
        });
    }).catch(function (err) {
        res.errorInfo = { status: 500 };
        next();
    });
};

function remove (req, res, next) {
    var projectId = req.params.projectId;

    Projects.findByIdAndRemove(projectId).then((project) => {
        if (!project) {
            res.errorInfo = { status: 404, title: 'Projects Not Found' };
            return next();
        }

        res.json({
            data: project
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
};

module.exports = { save, getAll, getOne, update, remove };
