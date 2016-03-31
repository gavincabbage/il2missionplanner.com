(function() {

    const
        SCALE_FACTOR = 1.40056,
        LAT_MIN = 0
        LAT_MAX = 164,
        LNG_MIN = 0,
        LNG_MAX = 252,
        BORDER = 5,
        CENTER = [LAT_MAX / 2, LNG_MAX / 2],
        RED = '#ff0000'
        DEFAULT_SPEED = 300
    ;

    function calculateDistance(a, b) {
		var dx = b.lng - a.lng;
        var dy = b.lat - a.lat;
        var raw = SCALE_FACTOR * Math.sqrt(dx * dx + dy * dy);
        return raw.toFixed(0);
	}

    function mathDegreesToGeographic(degrees) {
        if (degrees < 0) {
            degrees += 360;
        }
        return (450 - degrees) % 360;
    }

    function calculateHeading(start, end) {
        var radians = Math.atan2(end.lat - start.lat, end.lng - start.lng);
        var degrees = radians * 180 / Math.PI;
        degrees = mathDegreesToGeographic(degrees);
        return degrees.toFixed(1);
    }

    function applyFlightPlan(route) {
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        for (var i = 0; i < coords.length-1; i++) {
            var distance = calculateDistance(coords[i], coords[i+1]).toString();
            var heading = calculateHeading(coords[i], coords[i+1]).toString();
            var markerContent = distance + 'km, ' + heading + '&deg;';
            var marker =  L.marker(coords[i], {
                icon: L.divIcon({
                    className: 'flight-vertext',
                    html: markerContent,
                    iconAnchor: coords[i],
                    iconSize: [100, 0]
                })
            });
            marker.parentId = id;
            marker.addTo(map).addTo(drawnItems);
        }
    }

    function deleteAssociatedLayers(parentLayers) {
        var toDelete = []
        parentLayers.eachLayer(function(layer) {
            toDelete.push(layer._leaflet_id);
        });

        drawnItems.eachLayer(function(layer) {
            if (toDelete.indexOf(layer.parentId) != -1) {
                drawnItems.removeLayer(layer);
            }
        });
    }

    var map = L.map('map', {
        crs: L.CRS.Simple,
        attributionControl: false
    }).setView([0, 0], 2);

    L.tileLayer('img/map/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 6,
        noWrap: true,
        tms: true,
        continuousWorld: true
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            polyline: {
                showLength: false,
                shapeOptions: {
                    color: RED,
                    weight: 2
                }
            }
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    var titleControl = new L.Control.TitleControl({});
    map.addControl(titleControl);

    map.on('draw:created', function(e) {
        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
        if (e.layerType === 'polyline') {
            applyFlightPlan(e.layer);
        }
    });

    map.on('draw:deleted', function(e) {
        deleteAssociatedLayers(e.layers);
    });

    map.on('draw:edited', function(e) {
        deleteAssociatedLayers(e.layers);
        e.layers.eachLayer(function(layer) {
            if (layer.getLatLngs) {
                applyFlightPlan(layer);
            }
        });
    });

    map.setMaxBounds(new L.LatLngBounds(
        [LAT_MIN - BORDER, LNG_MIN - BORDER],
        [LAT_MAX + BORDER, LNG_MAX + BORDER]
    ));

    // debug other events
    var otherEvents = ['draw:deletestart', 'draw:deleteend', 'draw:editstop', 'draw:drawvertex',
            'draw:editvertex', 'draw:editstart', 'draw:drawstop', 'draw:drawstart']
    for (var i = 0; i < otherEvents.length; i++) {
        map.on(otherEvents[i], function(e) {
            console.log(e);
        });
    }

})();
