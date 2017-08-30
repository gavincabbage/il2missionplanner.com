var assert = require('chai').assert;

if (!CustomEvent) {
  var CustomEvent = function(name, params){ return params;};
}

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
                    'http://stream.il2missionplanner.com/SUBSCRIBE/test');
        });
    });

    describe('webdis._buildPublishUrl', function() {

        it('must be defined', function() {
            assert.isDefined(webdis._buildPublishUrl);
        });

        it('must build publish url based on channel and message', function() {
            assert.equal(webdis._buildPublishUrl('test', 'value'),
                    'http://stream.il2missionplanner.com/PUBLISH/test/value');
        });
    });

    describe('webdis._buildUnsubscribeUrl', function() {

        it('must be defined', function() {
            assert.isDefined(webdis._buildUnsubscribeUrl);
        });

        it('must build publish url based on channel and message', function() {
            assert.equal(webdis._buildUnsubscribeUrl('test'),
                    'http://stream.il2missionplanner.com/UNSUBSCRIBE/test');
        });
    });

});
