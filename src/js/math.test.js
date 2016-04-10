var chai = require('chai');
var assert = chai.assert;

var math = require('./math.js');

describe('math module', function() {

    it('must be defined', function() {
        assert.isDefined(math);
    });

    it('must support a distance method', function() {
        assert.isDefined(math.distance);
    });
})
