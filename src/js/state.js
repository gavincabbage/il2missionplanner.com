var util = require('./util.js');

module.exports = function(leaflet) {

    return {
        export: function(items) {
            var saveData = {routes:[],points:[]};
            items.eachLayer(function(layer) {
                var saveLayer = {};
                if (util.isLine(layer)) {
                    saveLayer.latLngs = layer.getLatLngs();
                    saveLayer.name = layer.name;
                    saveLayer.speed = layer.speed;
                    saveLayer.speeds = layer.speeds;
                    saveData.routes.push(saveLayer);
                } else if (util.isMarker(layer)) {
                    saveLayer.latLng = layer.getLatLng();
                    saveLayer.name = layer.name;
                    saveLayer.notes = layer.notes;
                    saveData.points.push(saveLayer);
                }
            });
            return saveData;
        },
        import: function() {
            // TODO: need to pull import logic out of map, but cant until
            // applyFlightPlanCallback etc are in another importable module
        }
    };

};
