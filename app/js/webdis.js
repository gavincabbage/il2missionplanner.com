module.exports = (function() {

    const
        WEBDIS_HOST = 'http://stream.il2missionplanner.com:7379',
        WEBDIS_SUBSCRIBE_SUFFIX = '/SUBSCRIBE/',
        WEBDIS_PUBLISH_SUFFIX = '/PUBLISH/'
    ;

    return {

        publish: function(channel, value) {
            var url = this._buildPublishUrl(channel, value);
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

        _buildSubscribeUrl: function(channel) {
            return WEBDIS_HOST + WEBDIS_SUBSCRIBE_SUFFIX + channel;
        },

        _buildPublishUrl: function(channel, value) {
            return WEBDIS_HOST + WEBDIS_PUBLISH_SUFFIX + channel + '/' + value;
        },

        _buildWebdisXhr: function(url, updateFn) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = updateFn;
            xhr.send(null);
            return xhr;
        }
    };
})();
