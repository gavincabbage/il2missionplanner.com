var assert = require('chai').assert;

var xhrMock = require('xhr-mock');
xhrMock.setup();

if (!CustomEvent) {
  var CustomEvent = function(name, params){ return params;};
}
//window.dispatchEvent = function(){};

var webdis = require('./webdis.js');

describe('webdis', function() {

    it('must be defined', function() {
        assert.isDefined(webdis);
    });

    describe('webdis.subscribe', function() {

        it('must be defined', function() {
            assert.isDefined(webdis.subscribe);
        });
    });

    describe('webdis.publish', function() {

        it('must be defined', function() {
            assert.isDefined(webdis.publish);
        });
    });

    describe('webdis._buildSubscribeUrl', function() {

        it('must be defined', function() {
            assert.isDefined(webdis._buildSubscribeUrl);
        });

        it('must build subscribe url based on channel', function() {
            assert.equal(webdis._buildSubscribeUrl('test'),
                    'http://stream.il2missionplanner.com:7379/SUBSCRIBE/test');
        });
    });

    describe('webdis._buildPublishUrl', function() {

        it('must be defined', function() {
            assert.isDefined(webdis._buildPublishUrl);
        });

        it('must build publish url based on channel and message', function() {
            assert.equal(webdis._buildPublishUrl('test', 'value'),
                    'http://stream.il2missionplanner.com:7379/PUBLISH/test/value');
        });
    });

    xhrMock.teardown();

});
