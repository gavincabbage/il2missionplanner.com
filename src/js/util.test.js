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

    describe('util.getSelectedMapIndex', function() {

        it('must be defined', function() {
            assert.isDefined(util.getSelectedMapIndex);
        });

        var mockMaps = {
            test: {
                hash: '#test',
                selectIndex: 0
            },
            other: {
                hash: '#other',
                selectIndex: 1
            }
        };

        var tests = [
            {
                given: '#test',
                expected: 0
            },
            {
                given: '#other',
                expected: 1
            },
            {
                given: '#none',
                expected: 0
            }
        ]

        tests.forEach(function(test) {
            it('must return '+test.expected+' given '+test.given, function() {
                assert.strictEqual(util.getSelectedMapIndex(test.given, mockMaps), test.expected);
            });
        });
    });

    describe('util.defaultSpeedArray', function() {

        it('must be defined', function() {
            assert.isDefined(util.defaultSpeedArray);
        });

        var tests = [
            {
                given: {
                    speed: 300,
                    count: 5
                },
                expectedLength: 5
            },
            {
                given: {
                    speed: 300,
                    count: 0
                },
                expectedLength: 0
            }
        ]

        tests.forEach(function(test) {
            it('must return array of length '+test.expectedLength+' given '+test.given.speed+' and '+test.given.count, function() {
                assert.lengthOf(util.defaultSpeedArray(test.given.speed, test.given.count), test.expectedLength);
            });
        });
    });

    describe('util.formatFlightLegMarker', function() {

        it('must be defined', function() {
            assert.isDefined(util.formatFlightLegMarker);
        });

        var expected = '[300.0km|116&deg;|300kph|60:00]';
        var given = {
            distance: 300,
            heading: 116,
            speed: 300,
            time: '60:00'
        }

        it('must return '+expected+' given '+given.distance+', '+given.heading+', '+given.speed+' and '+given.time, function() {
            assert.strictEqual(util.formatFlightLegMarker(given.distance, given.heading, given.speed, given.time), expected);
        });
    });
});
