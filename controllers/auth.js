'use strict';

const User = require('../models/user'),
    formatter = require('../utils/formatter.js');

function authenticate (req, res, next) {

    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return next({ status: 404, title: 'User Not Found' });
        }

        if (user.validPassword(req.body.password)) {
            return res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: user.token
            });
        }
        
        next({ status: 401, title: 'Invalid Credentials' });
        
    }).catch(err => {
        next({ status: 500 });        
    });
};

function signin (req, res, next) {

    User.findOne({ email: req.body.email }).then(result => {
        if (result) {
            next({ status: 409, title:  'User Already Exists' });
            return true;
        }

    }).then(userExists => {
        if (userExists) { return; }

        var params = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        return User.create(params).then(user => {
            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: user.token
            });
        });
    }).catch(err => {
        next({ status: 500 });
    });
};

module.exports = { authenticate, signin };
