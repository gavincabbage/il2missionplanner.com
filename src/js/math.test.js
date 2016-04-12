var chai = require('chai');
var assert = chai.assert;

var m = require('./math.js');

describe('math', function() {

    it('must be defined', function() {
        assert.isDefined(m);
    });
});

describe('math.distance', function() {

    it('must be defined', function() {
        assert.isDefined(m.distance);
    });

    // it('must return 1.40056 given 1', function() {
    //     var mockA = {lat: 0, lng: 1};
    //     var mockB = {lat: 1, lng: 1};
    //     assert.strictEqual(m.distance(mockA, mockB), 1.40056);
    // });
});

describe('math.geometricDegreesToGeographic', function() {

    it('must be defined', function() {
        assert.isDefined(m.geometricDegreesToGeographic);
    });

    it('must return 90 given 0', function() {
        assert.strictEqual(m.geometricDegreesToGeographic(0), 90);
    });

    it('must return 0 given 90', function() {
        assert.strictEqual(m.geometricDegreesToGeographic(90), 0);
    });

    it('must return 270 given 180', function() {
        assert.strictEqual(m.geometricDegreesToGeographic(180), 270);
    });

    it('must return 180 given 270', function() {
        assert.strictEqual(m.geometricDegreesToGeographic(270), 180);
    });

    it('must return 90 given 360', function() {
        assert.strictEqual(m.geometricDegreesToGeographic(360), 90);
    });
});

describe('math.heading', function() {

    it('must be defined', function() {
        assert.isDefined(m.heading);
    });

    it('must return 180 given (1,1) and (0,1)', function() {
        var mockA = {lat: 1, lng: 1};
        var mockB = {lat: 0, lng: 1};
        assert.strictEqual(m.heading(mockA, mockB), 180);
    });

    it('must return 0 given (0,1) and (1,1)', function() {
        var mockA = {lat: 0, lng: 1};
        var mockB = {lat: 1, lng: 1};
        assert.strictEqual(m.heading(mockA, mockB), 0);
    });

    it('must return 270 given (1,1) and (1,0)', function() {
        var mockA = {lat: 1, lng: 1};
        var mockB = {lat: 1, lng: 0};
        assert.strictEqual(m.heading(mockA, mockB), 270);
    });
});

describe('math.pad', function() {

    it('must be defined', function() {
        assert.isDefined(m.pad);
    });

    it('must return \'090\' given 90 and 3', function() {
        assert.strictEqual(m.pad(90, 3), '090');
    });

    it('must return \'270\' given 270 and 3', function() {
        assert.strictEqual(m.pad(270, 3), '270');
    });

    it('must return \'001\' given 1 and 3', function() {
        assert.strictEqual(m.pad(1, 3), '001');
    });
});
