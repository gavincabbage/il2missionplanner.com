module.exports = (function() {

    var calc = require('./calc.js');

    return {

        formatTime: function(timeInSeconds) {
            var minutes = timeInSeconds / 60;
            var seconds = timeInSeconds % 60;
            return Math.floor(minutes).toFixed(0) + ':' + calc.pad(seconds, 2);
        },

        getSelectedMapConfig: function(hash, maps) {
            for (var map in maps) {
                if (maps[map].hash === hash) {
                    return maps[map];
                }
            }
            return maps.stalingrad;
        },

        defaultSpeedArray: function(speed, count) {
            var speedArray = [];
            for (var i = 0; i < count; i++) {
                speedArray.push(speed);
            }
            return speedArray;
        },

        formatFlightLegMarker: function(distance, heading, speed, time) {
            distance = typeof distance === 'number' ? distance.toFixed(1) : distance;
            heading = typeof heading === 'number' ? heading.toFixed(0) : heading;
            return '[' + distance + 'km|' + calc.pad(heading, 3) + '&deg;/' + calc.pad(calc.invertHeading(heading), 3) +'&deg;|' + speed + 'kph|' + time + ']';
        },

        isLine: function(layer) {
            return typeof layer.getLatLngs !== 'undefined';
        },

        isMarker: function(layer) {
            return typeof layer.getLatLng !== 'undefined';
        },

        // Class functions taken from here: http://jaketrent.com/post/addremove-classes-raw-javascript/
        hasClass: function(el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            }
        },

        addClass: function(el, className) {
            if (el.classList) {
                el.classList.add(className);
            } else if (!this.hasClass(el, className)) {
                el.className += " " + className;
            }
        },

        removeClass: function(el, className) {
            if (el.classList) {
                el.classList.remove(className);
            } else if (this.hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className=el.className.replace(reg, ' ');
            }
        }
        // End class functions
    };
})();
