'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    q = require('q');

var userModelMock = {
        findOne: function () {},
        create: function () {}
    },

    res = {
        json: function () { return; }
    },

    formatterMock = {
        excludeProperties: function () {}
    },

    authController,

    sandbox,

    nextSpy;

describe('auth controller', function () {

    beforeEach(function () {
        authController = proxyquire('../../controllers/auth.js', {
            '../models/user': userModelMock,
            '../utils/formatter.js': formatterMock
        });

        sandbox = sinon.sandbox.create();

        nextSpy = sandbox.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('authenticate()', function () {

        it('should return 404 if the user is not found', function (done) {
            var req = {
                    body: {
                        email: 'unexistinguser@user.com'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    return q.resolve(null);
                });

                authController.authenticate(req, res, nextSpy);

            process.nextTick(function () {
                assert(nextSpy.calledOnce);
                assert(nextSpy.calledWith({ 
                    status: 404,
                    title: 'User Not Found'
                }));
                done();
            });
        });

        it('should return a response if user\'s credentials are valid', function (done) {

            var req = {
                    body: {
                        email: 'existinguser@user.com',
                        password: 'avalidpassword'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    var userFound = {
                        validPassword: function () {
                            return true;
                        }
                    };
                    return q.resolve(userFound);
                }),

                jsonSpy = sandbox.spy(res, 'json');

            authController.authenticate(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

        it('should return 401 if user\'s credentials are invalid', function (done) {

            var req = {
                    body: {
                        email: 'existinguser@user.com',
                        password: 'wrongpassword'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    var userFound = {
                        validPassword: function () {
                            return false;
                        }
                    };
                    return q.resolve(userFound);
                });

            authController.authenticate(req, res, nextSpy);

            process.nextTick(function () {
                assert(nextSpy.calledOnce);
                assert(nextSpy.calledWith({ 
                    status: 401,
                    title: 'Invalid Credentials'
                }));
                done();
            });
        });
    });

    describe('signin()', function () {

        it('should return 409 if the user already exists', function (done) {
            var req = {
                    body: {
                        email: 'existinguser@user.com'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    return q.resolve({ username: 'someexistinguser' });
                });

            authController.signin(req, res, nextSpy);

            process.nextTick(function () {
                assert(nextSpy.calledOnce);
                assert(nextSpy.calledWith({ 
                    status: 409,
                    title: 'User Already Exists'
                }));
                done();
            });
        });

        it('should create a new user', function (done) {
            var req = {
                    body: {
                        username: 'newusername',
                        email: 'newuser@user.com',
                        password: 'newuserpassword'
                    }
                },


                jsonSpy = sandbox.spy(res, 'json');

            sandbox.stub(userModelMock, 'findOne', function () {
                return q.resolve(null);
            });

            sandbox.stub(userModelMock, 'create', function (params) {
                return q.resolve(params);
            });

            authController.signin(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });
    });
});