module.exports = (function() {

    var calc = require('./calc.js');

    return {

        formatTime: function(timeInSeconds) {
            var minutes = timeInSeconds / 60;
            var seconds = timeInSeconds % 60;
            return Math.floor(minutes).toFixed(0) + ':' + calc.pad(seconds, 2);
        },

        getSelectedMapIndex: function(hash, maps) {
            for (var map in maps) {
                if (maps[map].hash === hash) {
                    return maps[map].selectIndex;
                }
            }
            return 0;
        },

        defaultSpeedArray: function(speed, count) {
            var speedArray = [];
            for (var i = 0; i < count; i++) {
                speedArray.push(speed);
            }
            return speedArray;
        }
    };
})();
