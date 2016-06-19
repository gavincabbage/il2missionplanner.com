module.exports = function(leaflet) {

    return {
        factory: function(type) {
            var iconOpts = {
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            };
            switch(type) {
                case 'target':
                    iconOpts.iconUrl = 'img/bullseye.png';
                    break;
                case 'combat':
                    iconOpts.iconUrl = 'img/explosion.png';
                    break;
                case 'bomb-target':
                    iconOpts.iconUrl = 'img/bomb.png';
                    break;
                case 'ground-combat':
                    iconOpts.iconUrl = 'img/ground-explosion.png';
                    break;
                case 'takeoff':
                    iconOpts.iconUrl = 'img/takeoff.png';
                    break;
                case 'landing':
                    iconOpts.iconUrl = 'img/landing.png';
                    break;
                case 'friendly-base':
                    iconOpts.iconUrl = 'img/house.png';
                    break;
                case 'enemy-base':
                    iconOpts.iconUrl = 'img/enemy-house.png';
                    break;
                case 'friendly-flight':
                    iconOpts.iconUrl = 'img/plane.png';
                    break;
                case 'enemy-flight':
                    iconOpts.iconUrl = 'img/enemy-plane.png';
                    break;
                default:
                    iconOpts.iconUrl = 'img/marker.png';
                    break;
            }
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
