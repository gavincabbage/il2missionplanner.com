var assert = require('chai').assert;

var mockLeaflet = {
    icon: function(options) {
        return {options: options};
    },
    divIcon: function(options) {
        return {options: options};
    }
}
var icons = require('./icons.js')(mockLeaflet);

describe('icons', function() {

    it('must be defined', function() {
        assert.isDefined(icons);
    });

    describe('icons.factory', function() {

        it('must be defined', function() {
            assert.isDefined(icons.factory);
        });

        it('must return a leaflet icon', function() {
            assert.isDefined(icons.factory());
            assert.isDefined(icons.factory().options);
        })

    });

    describe('icons.textIconFactory', function() {

        it('must be defined', function() {
            assert.isDefined(icons.textIconFactory);
        });

        it('must return a leaflet icon', function() {
            assert.isDefined(icons.textIconFactory());
            assert.isDefined(icons.textIconFactory().options);
        })

    });
});
