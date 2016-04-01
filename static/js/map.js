(function(content) {

    const
        SCALE_FACTOR = 1.40056,
        LAT_MIN = 0,
        LAT_MAX = 164,
        LNG_MIN = 0,
        LNG_MAX = 252,
        BORDER = 5,
        CENTER = [LAT_MAX / 2, LNG_MAX / 2],
        RED = '#ff0000',
        DEFAULT_SPEED = 300,
        DEFAULT_ALTITUDE = 1000
    ;

    var map, drawnItems, hiddenLayers;

    // patch a leaflet bug, see https://github.com/bbecquet/Leaflet.PolylineDecorator/issues/17
    L.PolylineDecorator.include(L.Mixin.Events);

    function calculateDistance(a, b) {
		var dx = b.lng - a.lng;
        var dy = b.lat - a.lat;
        var raw = SCALE_FACTOR * Math.sqrt(dx * dx + dy * dy);
        return raw.toFixed(1);
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
        return degrees.toFixed(0);
    }

    function newFlightDecorator(route) {
        return L.polylineDecorator(route, {
            patterns: [
                {
                    offset: 6,
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

    function calculateMidpoint(a, b) {
        var lat = (a.lat + b.lat) / 2;
        var lng = (a.lng + b.lng) / 2;
        return L.latLng(lat, lng);
    }

    function applyFlightPlanCallback(modal) {
        var route = modal.route;
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        console.log('in callback');
        console.log(modal);
        var decorator = newFlightDecorator(route);
        decorator.parentId = id;
        decorator.addTo(map);
        for (var i = 0; i < coords.length-1; i++) {
            var distance = calculateDistance(coords[i], coords[i+1]).toString();
            var heading = calculateHeading(coords[i], coords[i+1]).toString();
            var midpoint = calculateMidpoint(coords[i], coords[i+1]);
            var markerContent = distance + 'km|' + heading + '&deg;';
            var marker =  L.marker(midpoint, {
                clickable: false,
                icon: L.divIcon({
                    className: 'flight-vertext',
                    html: markerContent,
                    iconSize: [250, 0]
                })
            });
            marker.parentId = id;
            marker.addTo(map);
        }
        var endMarker = L.circleMarker(coords[coords.length-1], {
            clickable: false,
            radius: 3,
            color: RED,
            fillColor: RED,
            opacity: 1,
            fillOpacity: 1
        });
        endMarker.parentId = id;
        endMarker.addTo(map);
    }

    function applyFlightPlan(route) {
        // fire modal to get speed for the newly created flight
        // we'll try to set the things on the route layer itself for persistence on edit, who knows
        map.fire('modal', {
            content: '<form><input id="testInput" value=""></input></form>',
            zIndex: 10000,
            onShow: function(e) {
                e.modal.route = route;
            },
            onHide: function(e) {
                var modal = e.modal;
                console.log(e);
                modal.testValue = document.getElementById('testInput').value;
                console.log('modalAfterTest');
                console.log(modal);
                applyFlightPlanCallback(modal);
            }
        });
    }

    function deleteAssociatedLayers(parentLayers) {
        var toDelete = [];
        parentLayers.eachLayer(function(layer) {
            toDelete.push(layer._leaflet_id);
        });

        map.eachLayer(function(layer) {
            if (toDelete.indexOf(layer.parentId) !== -1) {
                map.removeLayer(layer);
            }
        });
        hiddenLayers.eachLayer(function(layer) {
            if (toDelete.indexOf(layer.parentId) !== -1) {
                hiddenLayers.removeLayer(layer);
            }
        });
    }

    function transferChildLayer(from, to) {
        from.eachLayer(function(layer) {
            if (typeof layer.parentId !== 'undefined') {
                from.removeLayer(layer);
                to.addLayer(layer);
            }
        });
    }

    function showChildLayers() {
        transferChildLayer(hiddenLayers, map);
    }

    function hideChildLayers() {
        transferChildLayer(map, hiddenLayers);
    }

    map = L.map('map', {
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

    map.setMaxBounds(new L.LatLngBounds(
        [LAT_MIN - BORDER, LNG_MIN - BORDER],
        [LAT_MAX + BORDER, LNG_MAX + BORDER]
    ));

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    hiddenLayers = new L.FeatureGroup();

    var editOptions = {
        selectedPathOptions: {
            maintainColor: true,
            opacity: 0.5
        }
    };
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            polyline: {
                showLength: false,
                shapeOptions: {
                    color: RED,
                    weight: 2,
                    opacity: 1
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

    var clearControl = new L.Control.ClearButton({}, function() {
        drawnItems.clearLayers();
        hideChildLayers();
        hiddenLayers.clearLayers();
    });
    map.addControl(clearControl);

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

    map.on('draw:editstart', function() {
        hideChildLayers();
    });

    map.on('draw:editstop', function() {
        showChildLayers();
    });

    map.on('draw:deletestart', function() {
        hideChildLayers();
    });

    map.on('draw:deletestop', function() {
        showChildLayers();
    });

    map.fire('modal', {
        template: content.html.flightModalTemplate,
        defaultSpeed: DEFAULT_SPEED,
        defaultAltitude: DEFAULT_ALTITUDE,
        formId: "flight-modal-form",
        zIndex: 10000,
        onHide: function(e) {
            console.log('close modal');
            console.log(e);
        }
    });

})(content);
