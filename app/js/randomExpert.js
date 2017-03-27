module.exports = (function() {

    var util = require('./util.js');

    const
        RANDOM_EXPERT_HOST = 'http://72ag-ded.ru/static/il2missionplanner.json'
    ;

    return {

        HASH: '#randomexpert',

        getMapState: function() {
            var response = util.buildSyncGetXhr(RANDOM_EXPERT_HOST);
            return JSON.parse(response.responseText);
        }

    };
})();
