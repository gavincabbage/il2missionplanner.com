module.exports = (function() {

    const
        WEBDIS_HOST = 'http://stream.il2missionplanner.com:7379',
        WEBDIS_SUBSCRIBE = '/SUBSCRIBE/',
        WEBDIS_PUBLISH = '/PUBLISH/',
        WEBDIS_KEYS = '/KEYS/',
        SCRIPTS = {
            GET_CHANNEL: 'dffd64d2bb526b22768b38b8f7dabebeda82c0fb'
        }
    ;

    return {

        publish: function(channel, value) {
            var url = this._buildPublishUrl(channel, value);
            // TODO this async wont work and this will be redone to call a lua script anyway
            var xhr = this._buildWebdisXhr(url, function() {
                if (xhr.readyState === 4) {
                    var response = xhr.responseText;
                    console.log(response);
                }
            });
        },

        subscribe: function(channel) {
            var prev_length = 0;
            var url = this._buildSubscribeUrl(channel);
            var xhr = this._buildWebdisXhr(url, function() {
                if (xhr.readyState === 3) {
                    var response = xhr.responseText;
                    var chunk = JSON.parse(response.slice(prev_length));
                    var newState = chunk.SUBSCRIBE[2];
                    prev_length = response.length;
                    // TODO parse newState into a proper object
                    var evt = new CustomEvent('il2:streamupdate', {detail: newState});
                    window.dispatchEvent(evt);
                } else if (xhr.readyState === 4) {
                    // TODO stream ended
                }
            });
        },

        getStreamList: function() {
            var url = this._buildKeysUrl('stream:*');
            var response = this._buildSyncWebdisXhr(url);
            return JSON.parse(response).KEYS;
        },

        getStreamChannel: function(stream, password) {
            var url = this._buildEvalshaUrl(SCRIPTS.GET_CHANNEL, [stream, password]);
            var response = this._buildSyncWebdisXhr(url);
            return response;
        },

        _buildEvalshaUrl: function(hash, args) {
            var url = WEBDIS_HOST + '/EVALSHA/' + hash + '/0';
            for (var i = 0; i < args.length; i++) {
                url += ('/' + args[i]);
            }
            return url;
        },

        _buildKeysUrl: function(pattern) {
            return WEBDIS_HOST + WEBDIS_KEYS + pattern;
        },

        _buildSubscribeUrl: function(channel) {
            return WEBDIS_HOST + WEBDIS_SUBSCRIBE + channel;
        },

        _buildPublishUrl: function(channel, value) {
            return WEBDIS_HOST + WEBDIS_PUBLISH + channel + '/' + value;
        },

        _buildWebdisXhr: function(url, updateFn) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = updateFn;
            xhr.send(null);
            return xhr;
        },

        _buildSyncWebdisXhr: function(url) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.responseText;
        }
    };
})();
