module.exports = (function() {

    return {

        distance: function(a, b) {
            var dLng = b.lng - a.lng;
            var dLat = b.lat - a.lat;
            return Math.sqrt(dLng * dLng + dLat * dLat);
        }

    };

})();
