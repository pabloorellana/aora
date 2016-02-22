'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

var token = 'jfggg897908dfkaei8634',

    res = { },

    jwtMock = {
        sign: function () { return true; },
        verify: function () { return true; }
    },

    JWT_SECRET_MOCK = {
        secret: 'MYSECRETKEY'
    },

    jwtUtils,

    sandbox,

    nextSpy;

describe('jwtUtils', function () {

    beforeEach(function () {

        jwtUtils = proxyquire('../../utils/jwt.js', {
            'jsonwebtoken': jwtMock,
            '../config/jwt-secret.json': JWT_SECRET_MOCK
        });

        sandbox = sinon.sandbox.create();

        nextSpy = sandbox.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('verifyToken()', function () {

        it('should return 401 if "authorization" header is not present', function () {
            var req = {
                headers: {
                    contentType: 'application/json'
                }
            };

            jwtUtils.verifyToken(req, res, nextSpy);
            
            assert(nextSpy.calledOnce);
            assert(nextSpy.calledWith({ status: 401 }));
        });

        it('should return 401 if the token is invalid', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb('tokenValidationException', null);
                }),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                };

            sandbox.stub(jwtMock, 'verify', verifyCallbackSpy);

            jwtUtils.verifyToken(req, res, nextSpy);

            assert(verifyCallbackSpy.calledOnce);
            assert(verifyCallbackSpy.calledWith(
                    token,
                    JWT_SECRET_MOCK.secret,
                    { ignoreExpiration: false }
                )
            );
            assert(nextSpy.calledOnce);
            assert(nextSpy.calledWith({
                status: 401,
                title:  'Access Token Expired'
            }));
        });

        it('should set the "token" attribute to the "response" object and execute the "next" callback', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb(null, token);
                }),

                nextSpy = sandbox.spy(),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                };

            sandbox.stub(jwtMock, 'verify', verifyCallbackSpy);

            jwtUtils.verifyToken(req, { }, nextSpy);

            assert(verifyCallbackSpy.calledOnce);
            assert(verifyCallbackSpy.calledWith(
                    token,
                    JWT_SECRET_MOCK.secret,
                    { ignoreExpiration: false }
                )
            );
            assert.equal(req.token, token);
            assert(nextSpy.calledOnce);
        });
    });
});

