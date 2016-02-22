'use strict';

const Stories = require('../models/story.js');

function save (req, res, next) {
    Stories.create(req.body).then(story => {
        res.json({ data: story });
    }).catch(err => {
        next({ status: 500 });
    })
};

function getAll (req, res, next) {
    const projectId = req.params.projectId;

    Stories.find({ projectId }).then(stories => {
        res.json({ data: stories });
    }).catch(err => {
        next({ status: 500 });
    });
}

function getOne (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findOne({ _id: storyId }).then(story => {
        if (!story) {
            return next({ status: 404, title: 'Story not Found' });
        }

        res.json({ data: story });
    }).catch(err => {
        next({ status: 500 });
    });
}

function update (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findByIdAndUpdate(storyId, req.body, { new: true }).then(story => {
        if (!story) {
            return next({ status: 404, title: 'Story not Found' });
        }

        res.json({ data: story });
    }).catch(err => {
        next({ status: 500 });
    });
}

function remove (req, res, next) {
    const storyId = req.params.storyId;

    Stories.findByIdAndRemove(storyId).then(story => {
        if (!story) {
            return next({ status: 404, title: 'Story not Found' });
        }

        res.json({ data: story });
    }).catch(err => {
        next({ status: 500 });
    });
}

module.exports = { save, getAll, getOne, update, remove };
