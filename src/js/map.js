(function() {

    var content = require('./content.js');
    var m = require('./math.js');
    require('./controls.js');

    const
        BORDER = 5,
        RED = '#ff0000',
        DEFAULT_SPEED = 300,
        DEFAULT_ALTITUDE = 1000,
        FLIGHT_OPACITY = 0.8
    ;

    var map, mapTiles, mapConfig, drawnItems, hiddenLayers, applyFlightPlan, applyTargetInfo, deleteAssociatedLayers;
    var selectedMapIndex = 0;

    // patch a leaflet bug, see https://github.com/bbecquet/Leaflet.PolylineDecorator/issues/17
    L.PolylineDecorator.include(L.Mixin.Events);

    var newFlightDecorator = function(route) {
        return L.polylineDecorator(route, {
            patterns: [
                {
                    offset: 6,
                    repeat: 300,
                    symbol: L.Symbol.arrowHead({
                        pathOptions: {
                            opacity: 0,
                            fillOpacity: FLIGHT_OPACITY,
                            color: RED
                        }
                    })
                }
            ]
        });
    };

    var calculateTime = function(speed, distance) {
        var kmPerSecond = speed / 3600;
        return distance / kmPerSecond;
    };

    var formatTime = function(totalSeconds) {
        var minutes = totalSeconds / 60;
        var seconds = totalSeconds % 60;
        return Math.floor(minutes).toFixed(0) + ':' + m.pad(seconds, 2);
    };

    var applyFlightPlanCallback = function(route) {
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        var decorator = newFlightDecorator(route);
        decorator.parentId = id;
        decorator.addTo(map);
        for (var i = 0; i < coords.length-1; i++) {
            var distance = mapConfig.scale * m.distance(coords[i], coords[i+1]);
            var heading = m.heading(coords[i], coords[i+1]);
            var midpoint = m.midpoint(coords[i], coords[i+1]);
            var time = formatTime(calculateTime(route.speed, distance));
            var markerContent = '[' + distance.toFixed(1) + 'km|' + heading.toFixed(0) + '&deg;|' + time + ']';
            var marker =  L.marker(midpoint, {
                clickable: false,
                icon: L.divIcon({
                    className: 'flight-leg',
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
            opacity: FLIGHT_OPACITY,
            fillOpacity: FLIGHT_OPACITY
        });
        endMarker.parentId = id;
        endMarker.addTo(map);
        var nameCoords = L.latLng(coords[0].lat, coords[0].lng);
        var nameMarker = L.marker(nameCoords, {
            draggable: false,
            icon: L.divIcon({
                className: 'map-title flight-title',
                html: route.name,
                iconSize: [250,0]
            })
        });
        nameMarker.parentId = id;
        nameMarker.on('click', function() {
            deleteAssociatedLayers(L.layerGroup([route]));
            applyFlightPlan(route);
        });
        nameMarker.addTo(map);
    };

    applyFlightPlan = function(route) {
        if (typeof route.speed === 'undefined') {
            route.speed = DEFAULT_SPEED;
        }
        if (typeof route.name === 'undefined') {
            route.name = '';
        }
        map.openModal({
            okCls: 'modal-ok',
            okText: 'Done',
            speed: route.speed,
            name: route.name,
            template: content.flightModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                e.modal.route = route;
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                e.modal.route.name = document.getElementById('flight-name').value;
                e.modal.route.speed = document.getElementById('flight-speed').value;
                applyFlightPlanCallback(e.modal.route);
            }
        });
    };

    var applyTargetInfoCallback = function(target) {
        var id = target._leaflet_id;
        var coords = target.getLatLng();
        var nameCoords = L.latLng(coords.lat, coords.lng);
        var nameMarker = L.marker(nameCoords, {
            draggable: false,
            icon: L.divIcon({
                className: 'map-title target-title',
                html: target.name,
                iconSize: [250,0]
            })
        });
        nameMarker.parentId = id;
        nameMarker.on('click', function() {
            deleteAssociatedLayers(L.layerGroup([target]));
            applyTargetInfo(target);
        });
        nameMarker.addTo(map);
        if (target.notes !== '') {
            target.bindLabel(target.notes).addTo(map);
        }
    };

    applyTargetInfo = function(target) {
        if (typeof target.name === 'undefined') {
            target.name = '';
        }
        if (typeof target.notes === 'undefined') {
            target.notes = '';
        }
        map.openModal({
            okCls: 'modal-ok',
            okText: 'Done',
            name: target.name,
            notes: target.notes,
            template: content.targetModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                e.modal.target = target;
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                e.modal.target.name = document.getElementById('target-name').value;
                e.modal.target.notes = document.getElementById('target-notes').value;
                applyTargetInfoCallback(e.modal.target);
            }
        });
    };

    deleteAssociatedLayers = function(parentLayers) {
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
    };

    var transferChildLayer = function(from, to) {
        from.eachLayer(function(layer) {
            if (typeof layer.parentId !== 'undefined') {
                from.removeLayer(layer);
                to.addLayer(layer);
            }
        });
    };

    var showChildLayers = function() {
        transferChildLayer(hiddenLayers, map);
    };

    var hideChildLayers = function() {
        transferChildLayer(map, hiddenLayers);
    };

    var checkClearButtonDisabled = function() {
        var element = document.getElementById('clear-button');
        if (drawnItems.getLayers().length === 0) {
            element.classList.add('leaflet-disabled');
        } else {
            element.classList.remove('leaflet-disabled');
        }
    };

    if (window.location.hash === '#moscow') {
        console.log('map: moscow');
        mapConfig = content.maps.moscow;
    } else {
        console.log('map: stalingrad');
        mapConfig = content.maps.stalingrad;
        window.location.hash = '#stalingrad';
    }

    console.log(mapConfig);

    var center = [mapConfig.latMax / 2, mapConfig.lngMax / 2],
    map = L.map('map', {
        crs: L.CRS.Simple,
        attributionControl: false
    }).setView(center, 3);

    mapTiles = L.tileLayer(mapConfig.tileUrl, {
        minZoom: 2,
        maxZoom: 6,
        noWrap: true,
        tms: true,
        continuousWorld: true
    });
    mapTiles.addTo(map);

    map.setMaxBounds(new L.LatLngBounds(
        [mapConfig.latMin - BORDER, mapConfig.lngMin - BORDER],
        [mapConfig.latMax + BORDER, mapConfig.lngMax + BORDER]
    ));

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    hiddenLayers = new L.FeatureGroup();

    var mapSelectButton = new L.Control.CustomButton({
        position: 'topleft',
        id: 'map-select-button',
        icon: 'fa-map',
        tooltip: content.mapSelectTooltip,
        clickFn: function() {
            map.openModal({
                template: content.mapSelectTemplate,
                okCls: 'modal-ok',
                okText: 'Okay',
                onShow: function(e) {
                    var selectElement = document.getElementById('map-select');
                    selectElement.selectedIndex = selectedMapIndex;
                    L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                        selectedMapIndex = selectElement.selectedIndex;
                        var selectedMap = selectElement.options[selectedMapIndex].value;
                        window.location.hash = '#' + selectedMap;
                        window.location.reload();
                        // TODO fix tile purging issue with code below
                        // deleteAssociatedLayers(drawnItems);
                        // drawnItems.clearLayers();
                        // hiddenLayers.clearLayers();
                        // selectedMapIndex = selectElement.selectedIndex;
                        // var selectedMap = selectElement.options[selectedMapIndex].value;
                        // window.location.hash = '#' + selectedMap;
                        // mapConfig = content.maps[selectedMap];
                        // mapTiles = L.tileLayer(mapConfig.tileUrl, {
                        //     minZoom: 2,
                        //     maxZoom: 6,
                        //     noWrap: true,
                        //     tms: true,
                        //     continuousWorld: true
                        // });
                        // mapTiles.redraw();
                        // mapTiles.addTo(map);
                        // e.modal.hide();
                    });
                }
            });
        }
    });
    map.addControl(mapSelectButton);

    var editOptions = {
        selectedPathOptions: {
            maintainColor: true,
            opacity: 0.4
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
                    opacity: FLIGHT_OPACITY
                }
            },
            marker: {
                icon: L.icon({
                    iconUrl: 'img/explosion.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 25]
                })
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

    var clearButton = new L.Control.CustomButton({
        id: 'clear-button',
        icon: 'fa-trash',
        tooltip: content.clearTooltip,
        clickFn: function() {
            if (drawnItems.getLayers().length !== 0) {
                map.openModal({
                    template: content.confirmClearTemplate,
                    okCls: 'modal-ok',
                    okText: 'Yes',
                    cancelCls: 'modal-cancel',
                    cancelText: 'No',
                    onShow: function(e) {
                        L.DomEvent
                            .on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                drawnItems.clearLayers();
                                hideChildLayers();
                                hiddenLayers.clearLayers();
                                e.modal.hide();
                                checkClearButtonDisabled();
                            })
                            .on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                                e.modal.hide();
                            });
                    }
                });
            }
        }
    });
    map.addControl(clearButton);

    var helpButton = new L.Control.CustomButton({
        position: 'bottomright',
        id: 'help-button',
        icon: 'fa-question',
        tooltip: content.helpTooltip,
        clickFn: function() {
            map.openModal({
                template: content.helpTemplate,
                cancelCls: 'modal-cancel',
                cancelText: 'Close',
                onShow: function(e) {
                    L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                        e.modal.hide();
                    });
                }
            });
        }
    });
    map.addControl(helpButton);

    map.on('draw:created', function(e) {
        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
        if (e.layerType === 'polyline') {
            applyFlightPlan(e.layer);
        } else if (e.layerType === 'marker') {
            applyTargetInfo(e.layer);
        }
        checkClearButtonDisabled();
    });

    map.on('draw:deleted', function(e) {
        deleteAssociatedLayers(e.layers);
        checkClearButtonDisabled();
    });

    map.on('draw:edited', function(e) {
        deleteAssociatedLayers(e.layers);
        e.layers.eachLayer(function(layer) {
            if (typeof layer.getLatLngs !== 'undefined') {
                applyFlightPlanCallback(layer);
            } else if (typeof layer.getLatLng !== 'undefined') {
                applyTargetInfoCallback(layer);
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

    checkClearButtonDisabled();

})();
