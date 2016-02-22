'use strict';

const formatter = require('../utils/formatter.js'),
    User = require('../models/user');

function save (req, res, next) {

    User.findOne({ email: req.body.email }).then(result => {
        if (result) {
            next({ status: 409, title: 'User Already Exists' });
            return true;
        }

    }).then(userExists => {
        if (userExists) { return; }

        const params = {
            username: req.body.username,
            email   : req.body.email,
            password: req.body.password
        };

        return User.create(params).then(user => {
            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: req.token
            });
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

function getAll (req, res, next) {
    User.find().then(users => {
        res.json({
            data: users.map(function (user) {
                return formatter.excludeProperties(user, { password: 0, token: 0 });
            })
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

function getOne (req, res, next) {
    const userId = req.params.userId;

    User.findOne({ _id: userId }).then(user => {
        if (!user) {
            return next({ status: 404, title: 'User Not Found' });
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

function update (req, res, next) {
    const userId = req.params.userId;

    User.findByIdAndUpdate(userId, req.body, { new: true }).then(user => {
        if (!user) {
            return next({ status: 404, title: 'User Not Found' });
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

function remove (req, res, next) {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId).then(user => {
        if (!user) {
            return next({ status: 404, title: 'User Not Found' });
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

module.exports = { save, getAll, getOne, update, remove };
