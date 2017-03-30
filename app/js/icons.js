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
            if (color === 'black' && this._isRandomExpertIcon(type)) {
                color = 'blue';
            }
            var iconOpts = {
                iconSize: type === 're-point-active' ? [40, 60] : [32, 32],
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
        },
        _isRandomExpertIcon: function(type) {
            return type.substring(0, 2) === 're';
        }
    };
};
