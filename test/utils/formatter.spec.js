'use strict';

const assert = require('chai').assert,
    formatter = require('../../utils/formatter.js');

const userMock = {
    username: 'USER1',
    email: 'user@user.com',
    password: 'myPassword',
    secret: 'mySecret'
};

describe('formatter', function () {

    describe('excludeProperties()', function() {

        it('should exclude the properties configured as 0 from an object', function () {

            const excludedProperties = {
                'password': 0,
                'secret': 0
            };

            let result = formatter.excludeProperties(userMock, excludedProperties);
            assert.notProperty(result, 'password');
            assert.notProperty(result, 'secret');
        });

        it('should not exclude any properties from an object', function () {

            const excludedProperties = {
                'password': 1,
                'secret': 1
            };

            let result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.property(result, 'secret');
        });

        it('should exclude only the properties configured as 0', function () {

            const excludedProperties = {
                'password': 1,
                'secret': 0
            };

            let result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.notProperty(result, 'secret');
        });

        it('should exclude the properties only if the are configured as 0', function () {

            const excludedProperties = {
                'password': 9,
                'secret': '0'
            };

            let result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.property(result, 'secret');
        });

    });
});