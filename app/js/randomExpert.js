module.exports = (function() {

    var util = require('./util.js');

    const
        RANDOM_EXPERT_HOST = 'http://tiles.il2missionplanner.com.s3-website-us-east-1.amazonaws.com/img/map-state.json'
    ;

    return {

        HASH: '#randomexpert',

        getMapState: function() {
            var response = util.buildSyncGetXhr(RANDOM_EXPERT_HOST);
            return JSON.parse(response.responseText);
        }

    };
})();
