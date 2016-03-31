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

    function newFlightDecorator(route) {
        return L.polylineDecorator(route, {
            patterns: [
                {
                    offset: 100,
                    repeat: 300,
                    symbol: L.Symbol.arrowHead({
                        pathOptions: {
                            opacity: 0,
                            fillOpacity: 1,
                            color: RED
                        }
                    })
                }
            ]
        });
    }

    function applyFlightPlan(route) {
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        var decorator = newFlightDecorator(route);
        decorator.parentId = id;
        decorator.addTo(map);
        for (var i = 0; i < coords.length-1; i++) {
            var distance = calculateDistance(coords[i], coords[i+1]).toString();
            var heading = calculateHeading(coords[i], coords[i+1]).toString();
            var markerContent = distance + 'km | ' + heading + '&deg;';
            var marker =  L.marker(coords[i], {
                clickable: false,
                icon: L.divIcon({
                    className: 'flight-vertext',
                    html: markerContent,
                    iconAnchor: coords[i],
                    iconSize: [250, 0]
                })
            });
            marker.parentId = id;
            marker.addTo(map);
        }
    }

    function deleteAssociatedLayers(parentLayers) {
        var toDelete = []
        parentLayers.eachLayer(function(layer) {
            toDelete.push(layer._leaflet_id);
        });

        map.eachLayer(function(layer) {
            if (toDelete.indexOf(layer.parentId) != -1) {
                drawnItems.removeLayer(layer);
                map.removeLayer(layer);
            }
        });
    }

    var map = L.map('map', {
        crs: L.CRS.Simple,
        attributionControl: false
    }).setView(CENTER, 3);

    L.tileLayer('img/map/{z}/{x}/{y}.png', {
        minZoom: 2,
        maxZoom: 6,
        noWrap: true,
        tms: true,
        continuousWorld: true
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var hiddenLayers = new L.FeatureGroup();

    var editOptions = {
        selectedPathOptions: {
            maintainColor: true,
            opacity: 0.4
        }
    }
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            polyline: {
                showLength: false,
                shapeOptions: {
                    color: RED,
                    weight: 3,
                    opacity: 0.8
                }
            }
        },
        edit: {
            featureGroup: drawnItems,
            edit: L.Browser.touch ? false : editOptions
        }
    });
    map.addControl(drawControl);

    var titleControl = new L.Control.TitleControl({});
    map.addControl(titleControl);

    map.on('draw:created', function(e) {
        console.log(e);
        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
        if (e.layerType === 'polyline') {
            applyFlightPlan(e.layer);
        }
    });

    map.on('draw:deleted', function(e) {
        console.log(e);
        deleteAssociatedLayers(e.layers);
    });

    map.on('draw:edited', function(e) {
        console.log(e);
        deleteAssociatedLayers(e.layers);
        e.layers.eachLayer(function(layer) {
            if (layer.getLatLngs) {
                applyFlightPlan(layer);
            }
        });
    });

    map.on('draw:editstart', function(e) {
        map.eachLayer(function(layer) {
            if (typeof layer.parentId !== 'undefined') {
                map.removeLayer(layer);
                hiddenLayers.addLayer(layer);
            }
        })
    });

    map.on('draw:editstop', function(e) {
        map.eachLayer(function(layer) {
            if (typeof layer.parentId !== 'undefined') {
                hiddenLayers.removeLayer(layer);
                map.addLayer(layer);
            }
        })
    })

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
