module.exports = (function() {

    var util = require('./util.js');

    const
        RANDOM_EXPERT_HOST = 'http://tiles.il2missionplanner.com/img/map-state.json'
    ;

    return {

        HASH: '#randomexpert',

        getMapConfig: function() {
            var response = util.buildSyncGetXhr(RANDOM_EXPERT_HOST);
            return response.responseText;
        }

    };
})();
