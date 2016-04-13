var assert = require('chai').assert;

var mockLeaflet = {}
var content = require('./content.js');

describe('content', function() {

    it('must be defined', function() {
        assert.isDefined(content);
    });

    var tests = [
        {
            property: 'maps'
        },
        {
            property: 'augmentedLeafletDrawLocal'
        }
    ];

    tests.forEach(function(test) {
        it('must have property \''+test.property+'\'', function() {
            assert.property(content, test.property);
        });
    });
});
