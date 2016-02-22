'use strict';

const Projects = require('../models/project.js');

function save (req, res, next) {
    Projects.createUnique(req.body).then(project => {
        res.json({ data: project });
    }).catch(err => {
        if (err.type && err.type === 'conflict') {
            return next({ status: 409, detail: err.message });
        }
        
        next({ status: 500 });
    });
};

function getAll (req, res, next) {
    Projects.find().then(projects => {
        res.json({ data: projects });
    }).catch(err => {
        next({ status: 500 });
    });
};

function getOne (req, res, next) {
    const projectId = req.params.projectId;

    Projects.findOne({ _id: projectId }).then(project => {
        if (!project) {
            return next({ status: 404, title: 'Project Not Found' });
        }

        res.json({ data: project });
    }).catch(err => { 
        next({ status: 500 });
    });
};

function update (req, res, next) {
    const projectId = req.params.projectId;

    Projects.findByIdAndUpdate(projectId, req.body, { new: true }).then(project => {
        if (!project) {
            return next({ status: 404, title: 'Project Not Found' });
        }

        res.json({ data: project });
    }).catch(err => {
        if (err.code && err.code === 11000) {
            return next({ status: 409, title: 'There is already a project with the same name' });
        }
        
        next({ status: 500 });
    });
};

function remove (req, res, next) {
    const projectId = req.params.projectId;

    Projects.findByIdAndRemove(projectId).then(project => {
        if (!project) {
            return next({ status: 404, title: 'Project Not Found' });
        }

        res.json({ data: project });
    }).catch(err => {
        next({ status: 500 });
    });
};

module.exports = { save, getAll, getOne, update, remove };
