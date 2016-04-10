module.exports = (function() {

    const
        SCALE_FACTOR = 1.40056
    ;

    return {

        distance: function(a, b) {
            var dLng = b.lng - a.lng;
            var dLat = b.lat - a.lat;
            return SCALE_FACTOR * Math.sqrt(dLng * dLng + dLat * dLat);
        }

    };

})();
