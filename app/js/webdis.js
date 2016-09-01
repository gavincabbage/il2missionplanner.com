module.exports = (function() {

    const
        WEBDIS_HOST = 'http://stream.il2missionplanner.com:7379'
    ;

    return {

        scripts: {
            getChannel: '',
            publishState: '',
            newStream: ''
        },

        init: function() {
            var requiredKeys = Object.keys(this.scripts);
            var response = this.hmget('scripts', requiredKeys);
            if (response.length !== requiredKeys.length) {
                return false;
            }
            for (var i = 0; i < response.length; i++) {
                this.scripts[requiredKeys[i]] = response[i];
            }
            return true;
        },

        publish: function(stream, password, code, state) {
            var url = this._buildEvalshaUrl(this.scripts.publishState, [stream, password, code, state]);
            this._buildWebdisXhr(url, function(){});
        },

        hmget: function(key, fields) {
            var url = this._buildHmgetUrl(key, fields);
            var response = this._buildSyncWebdisXhr(url);
            return JSON.parse(response.responseText).HMGET;
        },

        subscribe: function(channel) {
            console.log('subscribing to channel: '+channel);
            var prev_length = 0;
            var url = this._buildSubscribeUrl(channel);
            var xhr = this._buildWebdisXhr(url, function() {
                if (xhr.readyState === 3) {
                    var response = xhr.responseText;
                    var chunk = JSON.parse(response.slice(prev_length));
                    console.log(chunk);
                    var newState = chunk.SUBSCRIBE[2];
                    prev_length = response.length;
                    // TODO parse newState into a proper object
                    var evt = new CustomEvent('il2:streamupdate', {detail: newState});
                    window.dispatchEvent(evt);
                } else if (xhr.readyState === 4) {
                    console.log('subscribe ready state 4');
                    // TODO stream ended
                }
            });
        },

        unsubscribe: function(channel) {
            var url = this._buildUnsubscribeUrl(channel);
            this._buildWebdisXhr(url, function(){});
        },

        getStreamList: function() {
            var url = this._buildKeysUrl('stream:*');
            var response = this._buildSyncWebdisXhr(url);
            return JSON.parse(response.responseText).KEYS;
        },

        getStreamChannel: function(stream, password) {
            var url = this._buildEvalshaUrl(this.scripts.getChannel, [stream, password]);
            var response = this._buildSyncWebdisXhr(url);
            return JSON.parse(response.responseText).EVALSHA;
        },

        startStream: function(name, password, code) {
            var url = this._buildEvalshaUrl(this.scripts.newStream, [name, password, code]);
            var response = this._buildSyncWebdisXhr(url);
            return true;
        },

        _buildEvalshaUrl: function(hash, args) {
            var url = WEBDIS_HOST + '/EVALSHA/' + hash + '/0';
            for (var i = 0; i < args.length; i++) {
                url += ('/' + args[i]);
            }
            return url;
        },

        _buildHmgetUrl: function(key, fields) {
            var url = WEBDIS_HOST + '/HMGET/' + key;
            for (var i = 0; i < fields.length; i++) {
                url += ('/' + fields[i]);
            }
            return url;
        },

        _buildKeysUrl: function(pattern) {
            return WEBDIS_HOST + '/KEYS/' + pattern;
        },

        _buildSubscribeUrl: function(channel) {
            return WEBDIS_HOST + '/SUBSCRIBE/' + channel;
        },

        _buildPublishUrl: function(channel, value) {
            return WEBDIS_HOST + '/PUBLISH/' + channel + '/' + value;
        },

        _buildUnsubscribeUrl: function(channel, value) {
            return WEBDIS_HOST + '/UNSUBSCRIBE/' + channel;
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
            return xhr;
        }
    };
})();
