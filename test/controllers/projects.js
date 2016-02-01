'use strict';

const assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    q = require('q'),
    mockedMongoose = require('../../utils/mocked-mongoose');

var projectsController,

    sandbox,

    nextSpy;

const res = {
        json: function () { return; }
    },

    project = {
        name: 'Project One',
        startDate: '2016-01-31T22:47:25.481Z',
        pointScale: 'fibonacci',
        iterationLength: 1,
        doneIterationsToShow: 1
    };

const projectModelMock = new mockedMongoose.Schema;

projectModelMock.createUnique = function () {};

describe('projects controller', () => {

    beforeEach(() => {
        projectsController = proxyquire('../../controllers/projects.js', {
            '../models/project.js': projectModelMock
        });

        sandbox = sinon.sandbox.create();

        nextSpy = sandbox.spy();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('save()', () => {

        it('should the res.errorInfo.status as 409 if the project already exists and call the "next" middleware', (done) => {
            const req = { body: project },
                errorObj = {
                    type: 'conflict',
                    message: 'Project with the same name already exists.'
                };

            sandbox.stub(projectModelMock, 'createUnique', () => {
                return q.reject(errorObj);
            });

            projectsController.save(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 409);
                assert.equal(res.errorInfo.detail, errorObj.message);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should the res.errorInfo.status as 500 if an unknown error happens and call the "next" middleware', (done) => {
            const req = { body: project };

            sandbox.stub(projectModelMock, 'createUnique', () => {
                return q.reject({ error: 'unknown' });
            });

            projectsController.save(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 500);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should create a new project', (done) => {
            const req = {
                    body: project
                },

                jsonSpy = sandbox.spy(res, 'json');

            sandbox.stub(projectModelMock, 'createUnique', (params) => {
                return q.resolve(params);
            });

            projectsController.save(req, res);

            process.nextTick(() => {
                assert(jsonSpy.calledOnce);
                assert(jsonSpy.calledWith({ data: project }));
                done();
            });
        });

    });

    describe('getAll()', () => {

        it('should set the res.errorInfo.status as 404 if no projects are found', (done) => {

            const req = {
                params: {
                    projectId: 'projectOne'
                }
            };

            sandbox.stub(projectModelMock, 'find', () => {
                return q.resolve([]);
            });

            projectsController.getAll(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should return all the projects', (done) => {

            const jsonSpy = sandbox.spy(res, 'json'),
                fakeProjects = [
                    { name: 'fakeproject1', iterationLength: 1, pointScale: 'fibonacci' },
                    { name: 'fakeproject2', iterationLength: 1, pointScale: 'fibonacci' },
                    { name: 'fakeproject3', iterationLength: 1, pointScale: 'fibonacci' }
                ];

            sandbox.stub(projectModelMock, 'find', () => {
                return q.resolve(fakeProjects);
            });

            projectsController.getAll({}, res);

            process.nextTick(() => {
                assert(jsonSpy.calledOnce);
                assert(jsonSpy.calledWith({ data: fakeProjects }));
                done();
            });
        });

    });

    describe('getOne()', () => {

        it('should set the res.errorInfo.status as 404 if the specified project is not found', (done) => {

            const req = {
                params: {
                    projectId: 'projectOne'
                }
            };

            sandbox.stub(projectModelMock, 'findOne', () => {
                return q.resolve(null);
            });

            projectsController.getOne(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should return an specific project', (done) => {

            const jsonSpy = sandbox.spy(res, 'json'),
                req = {
                    params: {
                        projectId: 'projectOne'
                    }
                },
                fakeProject = { name: 'fakeproject1', iterationLength: 1, pointScale: 'fibonacci' };

            sandbox.stub(projectModelMock, 'findOne', () => {
                return q.resolve(fakeProject);
            });

            projectsController.getOne(req, res);

            process.nextTick(() => {
                assert(jsonSpy.calledOnce);
                assert(jsonSpy.calledWith({ data: fakeProject }));
                done();
            });
        });

    });

    describe('update()', () => {

        it('should set the res.errorInfo.status as 404 if the specified project is not found', (done) => {

            const req = {
                params: {
                    projectId: 'projectOne'
                },
                body: { }
            };

            sandbox.stub(projectModelMock, 'findByIdAndUpdate', () => {
                return q.resolve(null);
            });

            projectsController.update(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should update and return an specific project', (done) => {

            const jsonSpy = sandbox.spy(res, 'json'),
                fakeProject = { name: 'fakeproject1', iterationLength: 1, pointScale: 'fibonacci' },
                req = {
                    params: {
                        projectId: 'projectOne'
                    },
                    body: fakeProject
                };

            sandbox.stub(projectModelMock, 'findByIdAndUpdate', (projectId, params, options) => {
                return q.resolve(params);
            });

            projectsController.update(req, res);

            process.nextTick(() => {
                assert(jsonSpy.calledOnce);
                assert(jsonSpy.calledWith({ data : fakeProject }));
                done();
            });
        });

    });

    describe('remove()', () => {

        it('should set the res.errorInfo.status as 404 if the specified project is not found', (done) => {

            const req = {
                params: {
                    projectId: 'projectOne'
                }
            };

            sandbox.stub(projectModelMock, 'findByIdAndRemove', () => {
                return q.resolve(null);
            });

            projectsController.remove(req, res, nextSpy);

            process.nextTick(() => {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should remove and return an specific project', (done) => {

            const jsonSpy = sandbox.spy(res, 'json'),
                fakeProject = { name: 'fakeproject1', iterationLength: 1, pointScale: 'fibonacci' },
                req = {
                    params: {
                        projectId: 'projectOne'
                    }
                };

            sandbox.stub(projectModelMock, 'findByIdAndRemove', () => {
                return q.resolve(fakeProject);
            });

            projectsController.remove(req, res);

            process.nextTick(() => {
                assert(jsonSpy.calledOnce);
                assert(jsonSpy.calledWith({ data: fakeProject }));
                done();
            });
        });

    });
});