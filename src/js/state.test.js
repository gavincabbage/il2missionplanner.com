var assert = require('chai').assert;

var mockLeaflet = {
}
var state = require('./state.js')(mockLeaflet);

describe('state', function() {

    it('must be defined', function() {
        assert.isDefined(state);
    });

    describe('state.export', function() {

        it('must be defined', function() {
            assert.isDefined(state.export);
        });

        function mockItemsFactory(items) {
            return {
                items: items,
                eachLayer: function(f) {
                    for (var i = 0; i < this.items.length; i++) {
                        f(this.items[i]);
                    }
                }
            }
        }


        var tests = [
            {
                expected: {routes:[],points:[]},
                given: mockItemsFactory([]),
            }
        ];

        tests.forEach(function(test) {
            it('must generate state object '+test.expected+' given map items '+test.given, function() {
                assert.deepEqual(state.export(test.given), test.expected);
            });
        });

    });

    describe('state.import', function() {

        it('must be defined', function() {
            assert.isDefined(state.import);
        });

        var tests = [
            {
                expected: 2,
                given: 1,
            }
        ];

        tests.forEach(function(test) {

        });

    });
});
