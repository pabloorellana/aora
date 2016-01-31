'use strict';

const assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    q = require('q'),
    mockedMongoose = require('../../utils/mocked-mongoose');

var ProjectModel;

const project = {
    name: 'Project One',
    startDate: '2016-01-31T22:47:25.481Z',
    pointScale: 'fibonacci',
    iterationLength: 1,
    doneIterationsToShow: 1
};

describe('project model', () => {

    beforeEach(() => {
        ProjectModel = proxyquire('../../models/project.js', {
            'mongoose': mockedMongoose
        });
    });

    describe('createUnique()', () => {

    	it('shoud throw an exception if a project with the same name already exists', (done) => {

			const errorSpy = sinon.spy();

			sinon.stub(ProjectModel, 'findOne', () => {
				return q.resolve({ name: 'Project One'});
			});

    		ProjectModel.createUnique(project).catch(errorSpy);

    		process.nextTick(() => {
    			assert(errorSpy.calledOnce);
    			assert(errorSpy.calledWith({
	                type: 'conflict',
	                message: 'Project with the same name already exists.'
	            }));
    			done();
    		});
    	});

    	it('should create a new project', (done) => {
    		const successSpy = sinon.spy();

    		sinon.stub(ProjectModel, 'findOne', () => {
				return q.resolve();
			});

			sinon.stub(ProjectModel, 'create', (params) => {
				return q.resolve(params);
			});

			ProjectModel.createUnique(project).then(successSpy);

			process.nextTick(() => {
				assert(successSpy.calledOnce);
				assert(successSpy.calledWith(project));
				done();
			});
    	});
    });
});