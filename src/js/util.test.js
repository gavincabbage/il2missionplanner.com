var assert = require('chai').assert;

var util = require('./util.js');

describe('util', function() {

    it('must be defined', function() {
        assert.isDefined(util);
    });

    describe('util.formatTime', function() {

        it('must be defined', function() {
            assert.isDefined(util.formatTime);
        });

        var tests = [
            {
                given: 120,
                expected: '2:00'
            },
            {
                given: 119,
                expected: '1:59'
            },
            {
                given: 121,
                expected: '2:01'
            },
            {
                given: 0,
                expected: '0:00'
            }
        ];

        tests.forEach(function(test) {
            it('must return '+test.expected+' given '+test.given, function() {
                assert.strictEqual(util.formatTime(test.given), test.expected);
            });
        });
    });
});
