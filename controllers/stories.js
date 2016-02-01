'use strict';

const Stories = require('../models/story.js');

function save (req, res, next) {
    Stories.create(req.body).then((story) => {
        res.json({
            data: story
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    })
};

function getAll (req, res, next) {
    const projectId = req.params.projectId;

    Stories.find({ projectId }).then((stories) => {
         if (stories.length === 0) {
            res.errorInfo = { status: 404, title: 'No Stories Found' };
            return next();
        }

        res.json({
            data: stories
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
}

function getOne (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findOne({ _id: storyId }).then((story) => {
        if (!story) {
            res.errorInfo = { status: 404, title: 'Story not Found' };
            return next();
        }

        res.json({
            data: story
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
}

function update (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findByIdAndUpdate(storyId, req.body, { new: true }).then((story) => {
        if (!story) {
            res.errorInfo = { status: 404, title: 'Story not Found' };
            return next();
        }

        res.json({
            data: story
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
}

function remove (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findByIdAndRemove(storyId).then((story) => {
        if (!story) {
            res.errorInfo = { status: 404, title: 'Story not Found' };
            return next();
        }

        res.json({
            data: story
        });
    }).catch((err) => {
        res.errorInfo = { status: 500 };
        next();
    });
}

module.exports = { save, getAll, getOne, update, remove };
