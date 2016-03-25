(function() {

    const
        MIN_LAT = 0.0,
        MAX_LAT = 1.964286,
        MIN_LONG = 0.089286,
        MAX_LONG = 3.125,
        GRIDS_WIDE = 33,
        GRIDS_TALL = 22;
        GRID_OFFSET = 37;
        GRID_ROW_DIFF = 3;
        MAP_FILE = 'img/map.png'

    var getGridSideLength = function() {
        var height = MAX_LAT - MIN_LAT;
        var width = MAX_LONG - MIN_LONG;
        return (height/GRIDS_TALL + width/GRIDS_WIDE) / 2;
    };

    var getRowSubtotal = function(lat, gridSideLength) {
        var invertedLat = MAX_LAT - lat;
        var numRows = Math.floor(invertedLat / gridSideLength);
        var gridDiff = numRows * GRID_ROW_DIFF;
        return numRows * GRIDS_WIDE + gridDiff;
    }

    var latLngToGrid = function(latLng) {
        // TODO increase accuracy of this - not good enough to use yet
        var gridSideLength = getGridSideLength();
        var subtotal = getRowSubtotal(latLng.lat, gridSideLength);
        var numCols = Math.floor(latLng.lng / gridSideLength);
        var total = subtotal + numCols + GRID_OFFSET;
        return total;
    };

    var map = L.map('map', {
        crs: L.CRS.Simple,
        maxZoom: 11,
        minZoom: 8,
        attributionControl: false
    });

    var bounds = [[MIN_LAT, MIN_LONG], [MAX_LAT, MAX_LONG]];
    var image = L.imageOverlay(MAP_FILE, bounds).addTo(map);
    map.fitBounds(bounds);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function(e) {

        // TODO DEBUG
        if (e.layerType === 'marker') {
            e.layer.bindLabel(e.layer.getLatLng().toString() + ', grid ' + latLngToGrid(e.layer.getLatLng()).toString());
        }

        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
    });

})();
