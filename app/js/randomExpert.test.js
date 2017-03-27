var assert = require('chai').assert;

if (!CustomEvent) {
  var CustomEvent = function(name, params){ return params;};
}

var randomExpert = require('./randomExpert.js');

describe('randomExpert', function() {

    it('must be defined', function() {
        assert.isDefined(randomExpert);
    });

    describe('webdis.getMapState', function() {

        it('must be defined', function() {
            assert.isDefined(randomExpert.getMapState);
        });
    });

});
