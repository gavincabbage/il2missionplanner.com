var chai = require('chai');
var assert = chai.assert;

var m = require('./math.js');

function strLatLng(latLng) {
    return '('+latLng.lat+','+latLng.lng+')';
}

describe('math', function() {

    it('must be defined', function() {
        assert.isDefined(m);
    });
});

describe('math.distance', function() {

    it('must be defined', function() {
        assert.isDefined(m.distance);
    });

    var tests = [
        {
            a: {lat: 0, lng: 1},
            b: {lat: 1, lng: 1},
            expectedDistance: 1
        },
        {
            a: {lat: 0, lng: 0},
            b: {lat: 0, lng:-1},
            expectedDistance: 1
        },
        {
            a: {lat: 0, lng: 0},
            b: {lat: 1, lng: 1},
            expectedDistance: Math.sqrt(2)
        }
    ];

    tests.forEach(function(test) {
        it('must return '+test.expectedDistance+' given '+strLatLng(test.a)+' and '+strLatLng(test.b), function() {
            assert.strictEqual(m.distance(test.a, test.b), test.expectedDistance);
        });
    });
});

describe('math.geometricDegreesToGeographic', function() {

    it('must be defined', function() {
        assert.isDefined(m.geometricDegreesToGeographic);
    });

    var tests = [
        {expected: 90, given: 0},
        {expected: 0, given: 90},
        {expected: 270, given: 180},
        {expected: 180, given: 270},
        {expected: 90, given: 360},
    ];

    tests.forEach(function(test) {
        it('must return '+test.expected+' given '+test.given, function() {
            assert.strictEqual(m.geometricDegreesToGeographic(test.given), test.expected);
        });
    });
});

describe('math.heading', function() {

    it('must be defined', function() {
        assert.isDefined(m.heading);
    });

    tests = [
        {
            a: {lat: 1, lng: 1},
            b: {lat: 0, lng: 1},
            expectedHeading: 180
        },
        {
            a: {lat: 0, lng: 1},
            b: {lat: 1, lng: 1},
            expectedHeading: 0
        },
        {
            a: {lat: 1, lng: 2},
            b: {lat: 1, lng: 0},
            expectedHeading: 270
        }
    ]

    tests.forEach(function(test) {
        it('must return '+test.expectedHeading+' given '+strLatLng(test.a)+' and '+strLatLng(test.b), function() {
            assert.strictEqual(m.heading(test.a, test.b), test.expectedHeading);
        });
    });
});

describe('math.pad', function() {

    it('must be defined', function() {
        assert.isDefined(m.pad);
    });

    var tests = [
        {num: 90, digits: 3, expected: '090'},
        {num: 270, digits: 3, expected: '270'},
        {num: 1, digits: 3, expected: '001'}
    ];

    tests.forEach(function(test) {
        it('must return '+test.expected+' given '+test.num+' and '+test.digits, function() {
            assert.strictEqual(m.pad(test.num, test.digits), test.expected);
        });
    });
});
