'use strict';

const assert = require('chai').assert,
    sinon = require('sinon'),
    errorHandler = require('../../middlewares/error-handler.js');

let res = {
        status: function () { return this; },
        send: function () {}
    },

    statusSpy,

    sendSpy,

    sandbox;

describe('error-handler', function () {

    describe('sendErrorResponse()', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            statusSpy = sandbox.spy(res, 'status');

            sendSpy = sandbox.spy(res, 'send');
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should create an 404 "Not Found" error message', function () {
            const err = {
                status: 404
            };

            errorHandler.sendErrorResponse(err, { }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(404));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': err.status.toString(),
                        'title':  'Not Found',
                        'detail': ''
                    }
                ]
            }));
        });

        it('should create an 409 "Custom Conflic" error message', function () {
            const err = {
                status: 409,
                title: 'Custom Conflic',
                detail: 'This a custom detail message'
            };

            errorHandler.sendErrorResponse(err, { }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(409));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': err.status.toString(),
                        'title': err.title,
                        'detail': err.detail
                    }
                ]
            }));
        });

        it('should return standard 500 error when there is no handler for the specified status', function () {
            const err = {
                status: 600
            };

            errorHandler.sendErrorResponse(err, { }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(500));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': '500',
                        'title' : 'Internal Server Error',
                        'detail': ''
                    }
                ]
            }));
        });
    });

});