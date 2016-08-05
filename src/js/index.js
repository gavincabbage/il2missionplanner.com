(function() {

    // IMPORTS

    var content = require('./content.js');
    var calc = require('./calc.js');
    var util = require('./util.js');
    var icons = require('./icons.js')(L);
    require('./controls.js');

    // VARS

    const
        SAVE_HEADER = 'data:text/json;charset=utf-8,',
        RED = '#9A070B',
        DEFAULT_SPEED = 300,
        FLIGHT_OPACITY = 0.8,
        LINE_OPTIONS = {
            color: RED,
            weight: 2,
            opacity: FLIGHT_OPACITY
        },
        DEFAULT_POINT_TYPE = 'marker',
        DEFAULT_POINT_COLOR = 'black'
    ;

    var map, mapTiles, mapConfig, drawnItems, hiddenLayers;
    var mapConfig = util.getSelectedMapConfig(window.location.hash, content.maps);
    var selectedMapIndex = mapConfig.selectIndex;
    var isEmpty = true;

    var state = {
        colorsInverted: false,
        showBackground: true
    };

    // PATCHING

    // Patch a leaflet bug, see https://github.com/bbecquet/Leaflet.PolylineDecorator/issues/17
    L.PolylineDecorator.include(L.Mixin.Events);

    // Patch leaflet content with custom language
    L.drawLocal = content.augmentedLeafletDrawLocal;

    // FUNCTIONS

    function newFlightDecorator(route) {
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
    }

    function applyCustomFlightLeg(marker) {
        var parentRoute = drawnItems.getLayer(marker.parentId);
        map.openModal({
            speed: parentRoute.speeds[marker.index],
            template: content.flightLegModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                var element = document.getElementById('flight-leg-speed');
                element.focus();
                element.select();
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    var newSpeed = parseInt(element.value);
                    parentRoute.speeds[marker.index] = newSpeed;
                    marker.options.speed = newSpeed;
                    applyCustomFlightLegCallback(marker);
                    e.modal.hide();
                });
                L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                    e.modal.hide();
                });
            }
        });
    }

    function applyCustomFlightLegCallback(marker) {
        marker.options.time = util.formatTime(calc.time(marker.options.speed, marker.options.distance));
        var newContent = util.formatFlightLegMarker(
                marker.options.distance, marker.options.heading, marker.options.speed, marker.options.time);
        marker.setIcon(icons.textIconFactory(newContent, 'flight-leg ' + getMapTextClasses(state)));
    }

    function applyFlightPlanCallback(route, newFlight) {
        function routeClickHandlerFactory(clickedRoute) {
            return function() {
                deleteAssociatedLayers(L.layerGroup([clickedRoute]));
                applyFlightPlan(clickedRoute);
            };
        }
        function markerClickHandlerFactory(clickedMarker) {
            return function() {
                applyCustomFlightLeg(clickedMarker);
            };
        }
        if (newFlight) {
            route.on('click', routeClickHandlerFactory(route));
        }
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        var decorator = newFlightDecorator(route);
        decorator.parentId = id;
        decorator.addTo(map);
        if (typeof route.speeds === 'undefined' || route.speedDirty || route.wasEdited) {
            route.speeds = util.defaultSpeedArray(route.speed, coords.length-1);
        }
        for (var i = 0; i < coords.length-1; i++) {
            var distance = mapConfig.scale * calc.distance(coords[i], coords[i+1]);
            var heading = calc.heading(coords[i], coords[i+1]);
            var midpoint = calc.midpoint(coords[i], coords[i+1]);
            var time = util.formatTime(calc.time(route.speeds[i], distance));
            var markerContent = util.formatFlightLegMarker(distance, heading, route.speeds[i], time);
            var marker =  L.marker(midpoint, {
                distance: distance,
                heading: heading,
                time: time,
                speed: route.speeds[i],
                icon: icons.textIconFactory(markerContent, 'flight-leg ' + getMapTextClasses(state))
            });
            marker.parentId = id;
            marker.index = i;
            marker.on('click', markerClickHandlerFactory(marker));
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
            icon: icons.textIconFactory(route.name, 'map-title flight-titles ' + getMapTextClasses(state))
        });
        nameMarker.parentId = id;
        nameMarker.on('click', routeClickHandlerFactory(route));
        nameMarker.addTo(map);
    }

    function applyFlightPlan(route) {
        var newFlight = false;
        if (typeof route.speed === 'undefined') {
            route.speed = DEFAULT_SPEED;
            newFlight = true;
        }
        if (typeof route.name === 'undefined') {
            route.name = 'New Flight';
        }
        var initialSpeed = route.speed;
        var clickedOk = false;
        map.openModal({
            speed: route.speed,
            name: route.name,
            template: content.flightModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                var element = document.getElementById('flight-name');
                element.focus();
                element.select();
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    clickedOk = true;
                    e.modal.hide();
                });
                L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                if (clickedOk) {
                    route.name = document.getElementById('flight-name').value;
                    route.speed = parseInt(document.getElementById('flight-speed').value);
                    route.speedDirty = (route.speed !== initialSpeed);
                    applyFlightPlanCallback(route, newFlight);
                } else if (newFlight) {
                    drawnItems.removeLayer(route);
                } else {
                    applyFlightPlanCallback(route, newFlight);
                }
                checkButtonsDisabled();
            }
        });
    }

    function applyTargetInfoCallback(target, newTarget) {
        function targetClickHandlerFactory(clickedTarget) {
            return function() {
                deleteAssociatedLayers(L.layerGroup([clickedTarget]));
                applyTargetInfo(clickedTarget);
            };
        }
        var id = target._leaflet_id;
        var coords = target.getLatLng();
        target.setIcon(icons.factory(target.type, target.color));
        if (newTarget) {
            target.on('click', targetClickHandlerFactory(target));
        }
        var nameCoords = L.latLng(coords.lat, coords.lng);
        var nameMarker = L.marker(nameCoords, {
            draggable: false,
            icon: icons.textIconFactory(target.name, 'map-title target-title ' + getMapTextClasses(state))
        });
        nameMarker.parentId = id;
        nameMarker.on('click', targetClickHandlerFactory(target));
        nameMarker.addTo(map);
        if (target.notes !== '') {
            target.bindLabel(target.notes, {
                direction: 'left'
            }).addTo(map);
        }
    }

    function applyTargetInfo(target) {
        var newTarget = false;
        if (typeof target.name === 'undefined') {
            target.name = 'New Marker';
            var newTarget = true;
        }
        if (typeof target.notes === 'undefined') {
            target.notes = '';
        }
        if (typeof target.type === 'undefined') {
            target.type = DEFAULT_POINT_TYPE;
        }
        if (typeof target.color === 'undefined') {
            target.color = DEFAULT_POINT_COLOR;
        }
        var clickedOk = false;
        map.openModal({
            name: target.name,
            notes: target.notes,
            template: content.pointModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                var element = document.getElementById('target-name');
                element.focus();
                element.select();
                var typeSelect = document.getElementById('point-type-select');
                typeSelect.value = target.type;
                var colorSelect = document.getElementById('point-color-select');
                colorSelect.value = target.color;
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    clickedOk = true;
                    e.modal.hide();
                });
                L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                if (clickedOk) {
                    target.name = document.getElementById('target-name').value;
                    target.notes = document.getElementById('target-notes').value;
                    target.type = document.getElementById('point-type-select').value;
                    target.color = document.getElementById('point-color-select').value;
                    applyTargetInfoCallback(target, newTarget);
                } else if (newTarget) {
                    drawnItems.removeLayer(target);
                } else {
                    applyTargetInfoCallback(target, newTarget);
                }
                checkButtonsDisabled();
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

    function transferChildLayers(from, to) {
        from.eachLayer(function(layer) {
            if (typeof layer.parentId !== 'undefined') {
                from.removeLayer(layer);
                to.addLayer(layer);
            }
        });
    }

    function showChildLayers() {
        transferChildLayers(hiddenLayers, map);
    }

    function hideChildLayers() {
        transferChildLayers(map, hiddenLayers);
    }

    function checkButtonsDisabled() {
        var elements = [
            document.getElementById('clear-button'),
            document.getElementById('export-button'),
            document.getElementById('missionhop-button')
        ];
        if (drawnItems.getLayers().length === 0) {
            isEmpty = true;
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add('leaflet-disabled');
            }
        } else {
            isEmpty = false;
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('leaflet-disabled');
            }
        }
    }

    function clearMap() {
        drawnItems.clearLayers();
        hideChildLayers();
        hiddenLayers.clearLayers();
    }

    function exportMapState() {
        var saveData = {
            mapHash: window.location.hash,
            routes: [],
            points: []
        };
        drawnItems.eachLayer(function(layer) {
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
                saveLayer.type = layer.type;
                saveLayer.color = layer.color;
                saveLayer.notes = layer.notes;
                saveData.points.push(saveLayer);
            }
        });
        return saveData;
    }

    function selectMap(mapConfig) {
        selectedMapIndex = mapConfig.selectIndex;
        window.location.hash = mapConfig.hash;
        deleteAssociatedLayers(drawnItems);
        drawnItems.clearLayers();
        hiddenLayers.clearLayers();
        mapTiles.setUrl(mapConfig.tileUrl);
        map.setMaxBounds(calc.maxBounds(mapConfig));
        map.setView(calc.center(mapConfig), 3);
        mapTiles.redraw();
        mapTiles.addTo(map);
    }

    function fitViewToMission() {
        map.fitBounds(drawnItems.getBounds());
    }

    function getMapTextClasses(state) {
        var classes = 'map-text';
        if (state.colorsInverted) {
            classes += ' inverted';
        }
        if (!state.showBackground) {
            classes += ' nobg';
        }
        return classes;
    }

    // MAP SETUP

    map = L.map('map', {
        crs: L.CRS.Simple,
        attributionControl: false
    });

    mapTiles = L.tileLayer(mapConfig.tileUrl, {
        minZoom: 2,
        maxZoom: 6,
        noWrap: true,
        tms: true,
        continuousWorld: true
    }).addTo(map);

    map.setView(calc.center(mapConfig), 3);
    map.setMaxBounds(calc.maxBounds(mapConfig));

    drawnItems = L.featureGroup();
    map.addLayer(drawnItems);
    hiddenLayers = L.featureGroup();

    // BUTTONS

    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            polyline: {
                showLength: false,
                shapeOptions: LINE_OPTIONS
            },
            marker: {
                icon: icons.factory(DEFAULT_POINT_TYPE, DEFAULT_POINT_COLOR)
            }
        },
        edit: {
            featureGroup: drawnItems,
            edit: L.Browser.touch ? false : {
                selectedPathOptions: {
                    maintainColor: true,
                    opacity: 0.4
                }
            }
        }
    });
    map.addControl(drawControl);

    var titleControl = new L.Control.TitleControl({});
    map.addControl(titleControl);

    var clearButton = new L.Control.CustomToolbar({
        position: 'bottomleft',
        buttons: [
            {
                id: 'clear-button',
                icon: 'fa-trash',
                tooltip: content.clearTooltip,
                clickFn: function() {
                    if (!isEmpty) {
                        map.openModal({
                            template: content.confirmClearModalTemplate,
                            onShow: function(e) {
                                var element = document.getElementById('confirm-cancel-button');
                                element.focus();
                                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                    clearMap();
                                    e.modal.hide();
                                });
                                L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                                    e.modal.hide();
                                });
                            },
                            onHide: function() {
                                checkButtonsDisabled();
                            }
                        });
                    }
                }
            }
        ]
    });
    map.addControl(clearButton);

    var helpSettingsToolbar = new L.Control.CustomToolbar({
        position: 'bottomright',
        buttons: [
            {
                id: 'settings-button',
                icon: 'fa-gear',
                tooltip: content.settingsTooltip,
                clickFn: function() {
                    map.openModal({
                        template: content.settingsModalTemplate,
                        onShow: function(e) {
                            var mapSelect = document.getElementById('map-select');
                            mapSelect.selectedIndex = selectedMapIndex;
                            var originalIndex = selectedMapIndex;
                            var invertCheckbox = document.getElementById('invert-text-checkbox');
                            invertCheckbox.checked = state.colorsInverted;
                            var backgroundCheckbox = document.getElementById('text-background-checkbox');
                            backgroundCheckbox.checked = state.showBackground;
                            mapSelect.focus();
                            L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                if (mapSelect.selectedIndex !== originalIndex) {
                                    selectedMapIndex = mapSelect.selectedIndex;
                                    var selectedMap = mapSelect.options[selectedMapIndex].value;
                                    mapConfig = content.maps[selectedMap];
                                    selectMap(mapConfig);
                                }
                                if (invertCheckbox.checked !== state.colorsInverted) {
                                    state.colorsInverted = invertCheckbox.checked;
                                    var textElements = document.getElementsByClassName('map-text');
                                    for (var i = 0; i < textElements.length; i++) {
                                        if (state.colorsInverted) {
                                            textElements[i].classList.add('inverted');
                                        } else {
                                            textElements[i].classList.remove('inverted');
                                        }
                                    }
                                }
                                if (backgroundCheckbox.checked !== state.showBackground) {
                                    state.showBackground = backgroundCheckbox.checked;
                                    var textElements = document.getElementsByClassName('map-text');
                                    for (var i = 0; i < textElements.length; i++) {
                                        if (state.showBackground) {
                                            textElements[i].classList.remove('nobg');
                                        } else {
                                            textElements[i].classList.add('nobg');
                                        }
                                    }
                                }
                                e.modal.hide();
                            });
                            L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                                e.modal.hide();
                            });
                        }
                    });
                }
            },
            {
                id: 'help-button',
                icon: 'fa-question',
                tooltip: content.helpTooltip,
                clickFn: function() {
                    map.openModal({
                        template: content.helpModalTemplate,
                        onShow: function(e) {
                            L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                e.modal.hide();
                            });
                        }
                    });
                }
            }
        ]
    });
    map.addControl(helpSettingsToolbar);

    var importExportToolbar = new L.Control.CustomToolbar({
        position: 'bottomleft',
        buttons: [
            {
                id: 'import-button',
                icon: 'fa-upload',
                tooltip: content.importTooltip,
                clickFn: function() {
                    map.openModal({
                        template: content.importModalTemplate,
                        onShow: function(e) {
                            var importInput = document.getElementById('import-file');
                            importInput.focus();
                            var fileContent;
                            L.DomEvent.on(importInput, 'change', function(evt) {
                                var reader = new window.FileReader();
                                reader.onload = function(evt) {
                                    if(evt.target.readyState !== 2) {
                                        return;
                                    }
                                    if(evt.target.error) {
                                        window.alert('Error while reading file');
                                        return;
                                    }
                                    fileContent = evt.target.result;
                                };
                                reader.readAsText(evt.target.files[0]);
                            });
                            L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                var saveData = JSON.parse(fileContent);
                                var importedMapConfig = util.getSelectedMapConfig(saveData.mapHash, content.maps);
                                window.location.hash = importedMapConfig.hash;
                                selectMap(importedMapConfig);
                                for (var i = 0; i < saveData.routes.length; i++) {
                                    var route = saveData.routes[i];
                                    var newRoute = L.polyline(route.latLngs, LINE_OPTIONS);
                                    newRoute.name = route.name;
                                    newRoute.speed = route.speed;
                                    newRoute.speeds = route.speeds;
                                    drawnItems.addLayer(newRoute);
                                    applyFlightPlanCallback(newRoute);
                                }
                                for (var i = 0; i < saveData.points.length; i++) {
                                    var point = saveData.points[i];
                                    var newPoint = L.marker(point.latLng, {
                                        icon: icons.factory(point.type, point.color)
                                    });
                                    newPoint.name = point.name;
                                    newPoint.type = point.type;
                                    newPoint.color = point.color;
                                    newPoint.notes = point.notes;
                                    drawnItems.addLayer(newPoint);
                                    applyTargetInfoCallback(newPoint);
                                }
                                e.modal.hide();
                                fitViewToMission();
                            });
                            L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                                e.modal.hide();
                            });
                        },
                        onHide: function() {
                            checkButtonsDisabled();
                        }
                    });
                }
            },
            {
                id: 'export-button',
                icon: 'fa-download',
                tooltip: content.exportTooltip,
                clickFn: function() {
                    if (!isEmpty) {
                        var saveData = exportMapState();
                        var escapedData = window.escape(JSON.stringify(saveData));
                        var formattedData = SAVE_HEADER + escapedData;
                        window.open(formattedData);
                    }
                }
            },
        ]
    });
    map.addControl(importExportToolbar);

    var gridToolbar = new L.Control.CustomToolbar({
        position: 'topleft',
        buttons: [
            {
                id: 'gridhop-button',
                icon: 'fa-th-large',
                tooltip: content.gridHopTooltip,
                clickFn: function() {
                    map.openModal({
                        template: content.gridJumpModalTemplate,
                        onShow: function(e) {
                            var gridElement = document.getElementById('grid-input');
                            gridElement.focus();
                            L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                                var grid = gridElement.value;
                                var viewLatLng = calc.gridLatLng(grid, mapConfig);
                                map.setView(viewLatLng, mapConfig.gridHopZoom);
                                e.modal.hide();
                            });
                            L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                                e.modal.hide();
                            });
                        }
                    });
                }
            },
            {
                id: 'missionhop-button',
                icon: 'fa-crop',
                tooltip: content.missionHopTooltip,
                clickFn: function() {
                    if (!isEmpty) {
                        fitViewToMission();
                    }
                }
            }
        ]
    });
    map.addControl(gridToolbar);

    // MAP.ON EVENTS

    map.on('draw:created', function(e) {
        drawnItems.addLayer(e.layer);
        if (e.layerType === 'polyline') {
            applyFlightPlan(e.layer);
        } else if (e.layerType === 'marker') {
            applyTargetInfo(e.layer);
        }
        checkButtonsDisabled();
    });

    map.on('draw:deleted', function(e) {
        deleteAssociatedLayers(e.layers);
        checkButtonsDisabled();
    });

    map.on('draw:edited', function(e) {
        deleteAssociatedLayers(e.layers);
        e.layers.eachLayer(function(layer) {
            if (util.isLine(layer)) {
                layer.wasEdited = (layer.getLatLngs().length-1 !== layer.speeds.length);
                applyFlightPlanCallback(layer);
            } else if (util.isMarker(layer)) {
                applyTargetInfoCallback(layer);
            }
        });
    });

    map.on('draw:editstart', function() {
        hideChildLayers();
    });

    map.on('draw:editstop', function() {
        showChildLayers();
        checkButtonsDisabled();
    });

    map.on('draw:deletestart', function() {
        hideChildLayers();
    });

    map.on('draw:deletestop', function() {
        showChildLayers();
        checkButtonsDisabled();
    });

    // END EVENTS

    checkButtonsDisabled();

})();
