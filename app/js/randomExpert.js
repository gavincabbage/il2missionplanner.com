module.exports = (function() {

    var util = require('./util.js');

    const
        RANDOM_EXPERT_HOST = 'https://14rcbpnu4f.execute-api.us-east-1.amazonaws.com/prod/get_randex_json'
    ;

    return {

        HASH: '#randomexpert',

        getMapState: function() {
            var response = util.buildSyncGetXhr(RANDOM_EXPERT_HOST);
            return JSON.parse(response.responseText);
        }

    };
})();
