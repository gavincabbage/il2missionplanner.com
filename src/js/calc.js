module.exports = (function() {

    'use strict';

    const
        SECONDS_IN_HOUR = 3600,
        BORDER = 5
    ;

    return {

        distance: function(a, b) {
            var dLng = b.lng - a.lng;
            var dLat = b.lat - a.lat;
            return Math.sqrt(dLng * dLng + dLat * dLat);
        },

        geometricDegreesToGeographic: function(degrees) {
            if (degrees < 0) {
                degrees += 360;
            }
            return (450 - degrees) % 360;
        },

        heading: function(a, b) {
            var radians = Math.atan2(b.lat - a.lat, b.lng - a.lng);
            var degrees = radians * 180 / Math.PI;
            degrees = this.geometricDegreesToGeographic(degrees);
            return degrees;
        },

        midpoint: function(a, b) {
            var lat = (a.lat + b.lat) / 2;
            var lng = (a.lng + b.lng) / 2;
            return L.latLng(lat, lng);
        },

        pad: function(num, size) {
            var s = Math.floor(num).toFixed(0);
            while (s.length < size) {
                s = "0" + s;
            }
            return s;
        },

        time: function(speed, distance) {
            var kmPerSecond = speed / SECONDS_IN_HOUR;
            return distance / kmPerSecond;
        },

        maxBounds: function(mapConfig) {
            return [
                [mapConfig.latMin - BORDER, mapConfig.lngMin - BORDER],
                [mapConfig.latMax + BORDER, mapConfig.lngMax + BORDER]
            ];
        }
    };
})();
