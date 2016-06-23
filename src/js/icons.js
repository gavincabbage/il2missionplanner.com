module.exports = function(leaflet) {

    const
        URL_PREFIX = 'img/',
        URL_SUFFIX = '.png',
        URL_DELIM = '-'
    ;

    function buildIconUrl(type, color) {
        return URL_PREFIX + color + URL_DELIM + type + URL_SUFFIX;
    }

    return {
        factory: function(type, color) {
            var iconOpts = {
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                iconUrl: buildIconUrl(type, color),
            };
            return leaflet.icon(iconOpts);
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
