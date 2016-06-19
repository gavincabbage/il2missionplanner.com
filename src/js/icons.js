module.exports = function(leaflet) {

    return {
        factory: function(type) {
            var imgUrl = 'img/' + type + '.png';
            return leaflet.icon({
                iconUrl: imgUrl,
                iconSize: [30, 30]
            });
        },
        textIconFactory: function(text, classes) {
            return leaflet.divIcon({
                className: classes,
                html: text,
                iconSize: [200, 0]
            });
        }
    };
};
