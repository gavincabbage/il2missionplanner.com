module.exports = function(leaflet) {

    return {
        factory: function() {
            return leaflet.icon({
                iconUrl: 'img/explosion.png',
                iconSize: [30, 30],
                iconAnchor: [15, 25]
            });
        },
        textIconFactory(text, classes) {
            return leaflet.divIcon({
                className: classes,
                html: text,
                iconSize: [200, 0]
            });
        }
    };

};
