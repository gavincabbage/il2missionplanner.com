(function() {

    /* CLEANUP NOTES

    Going to be quite the process...

    Next: Put map setup and last line into a main function, then organize controls

    */


    // IMPORTS

    var content = require('./content.js');
    var calc = require('./calc.js');
    var util = require('./util.js');
    var icons = require('./icons.js')(L);
    require('./controls.js');

    // VARS

    const
        SAVE_HEADER = 'data:text/json;charset=utf-8,',
        RED = '#ff0000',
        DEFAULT_SPEED = 300,
        FLIGHT_OPACITY = 0.8,
        LINE_OPTIONS = {
            color: RED,
            weight: 2,
            opacity: FLIGHT_OPACITY
        }
    ;

    var map, mapTiles, mapConfig, drawnItems, hiddenLayers;
    var mapConfig = util.getSelectedMapConfig(window.location.hash, content.maps);
    var selectedMapIndex = mapConfig.selectIndex;

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
            okCls: 'modal-ok',
            okText: 'Done',
            speed: parentRoute.speeds[marker.index],
            template: content.flightLegModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                var newSpeed = parseInt(document.getElementById('flight-leg-speed').value);
                parentRoute.speeds[marker.index] = newSpeed;
                marker.options.speed = newSpeed;
                applyCustomFlightLegCallback(marker);
            }
        });
    }

    function applyCustomFlightLegCallback(marker) {
        marker.options.time = util.formatTime(calc.time(marker.options.speed, marker.options.distance));
        var newContent = util.formatFlightLegMarker(
                marker.options.distance, marker.options.heading, marker.options.speed, marker.options.time);
        marker.setIcon(icons.textIconFactory(newContent, 'flight-leg map-text'));
    }

    function applyFlightPlanCallback(route) {
        var id = route._leaflet_id;
        var coords = route.getLatLngs();
        var decorator = newFlightDecorator(route);
        decorator.parentId = id;
        decorator.addTo(map);
        if (typeof route.speeds === 'undefined' || route.speedDirty || route.wasEdited) {
            route.speeds = util.defaultSpeedArray(route.speed, coords.length-1);
        }
        function markerClickHandlerFactory(clickedMarker) {
            return function() {
                applyCustomFlightLeg(clickedMarker);
            };
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
                icon: icons.textIconFactory(markerContent, 'flight-leg map-text')
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
            icon: icons.textIconFactory(route.name, 'map-title flight-title map-text')
        });
        nameMarker.parentId = id;
        nameMarker.on('click', function() {
            deleteAssociatedLayers(L.layerGroup([route]));
            applyFlightPlan(route);
        });
        nameMarker.addTo(map);
    }

    function applyFlightPlan(route) {
        if (typeof route.speed === 'undefined') {
            route.speed = DEFAULT_SPEED;
        }
        if (typeof route.name === 'undefined') {
            route.name = 'New Flight';
        }
        var initialSpeed = route.speed;
        map.openModal({
            okCls: 'modal-ok',
            okText: 'Done',
            speed: route.speed,
            name: route.name,
            template: content.flightModalTemplate,
            zIndex: 10000,
            onShow: function(e) {
                L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                    e.modal.hide();
                });
            },
            onHide: function(e) {
                route.name = document.getElementById('flight-name').value;
                route.speed = parseInt(document.getElementById('flight-speed').value);
                route.speedDirty = (route.speed !== initialSpeed);
                applyFlightPlanCallback(route);
            }
        });
    }

    function applyTargetInfoCallback(target) {
        var id = target._leaflet_id;
        var coords = target.getLatLng();
        var nameCoords = L.latLng(coords.lat, coords.lng);
        var nameMarker = L.marker(nameCoords, {
            draggable: false,
            icon: icons.textIconFactory(target.name, 'map-title target-title map-text')
        });
        nameMarker.parentId = id;
        nameMarker.on('click', function() {
            deleteAssociatedLayers(L.layerGroup([target]));
            applyTargetInfo(target);
        });
        nameMarker.addTo(map);
        if (target.notes !== '') {
            target.bindLabel(target.notes, {
                direction: 'left'
            }).addTo(map);
        }
    }

    function applyTargetInfo(target) {
        if (typeof target.name === 'undefined') {
            target.name = 'New Target';
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

    function checkClearButtonDisabled() {
        var element = document.getElementById('clear-button');
        if (drawnItems.getLayers().length === 0) {
            element.classList.add('leaflet-disabled');
        } else {
            element.classList.remove('leaflet-disabled');
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
                saveLayer.notes = layer.notes;
                saveData.points.push(saveLayer);
            }
        });
        return saveData;
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
                        mapConfig = content.maps[selectedMap];
                        window.location.hash = mapConfig.hash;
                        deleteAssociatedLayers(drawnItems);
                        drawnItems.clearLayers();
                        hiddenLayers.clearLayers();
                        mapTiles.setUrl(mapConfig.tileUrl);
                        map.setMaxBounds(calc.maxBounds(mapConfig));
                        map.setView(calc.center(mapConfig), 3);
                        mapTiles.redraw();
                        mapTiles.addTo(map);
                        e.modal.hide();
                    });
                }
            });
        }
    });
    map.addControl(mapSelectButton);

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
                icon: icons.factory()
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
                                clearMap();
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

    var exportButton = new L.Control.CustomButton({
        position: 'bottomright',
        id: 'export-button',
        icon: 'fa-download',
        tooltip: content.exportTooltip,
        clickFn: function() {
            var saveData = exportMapState();
            var escapedData = window.escape(JSON.stringify(saveData));
            var formattedData = SAVE_HEADER + escapedData;
            window.open(formattedData);
        }
    });
    map.addControl(exportButton);

    var importButton = new L.Control.CustomButton({
        position: 'bottomright',
        id: 'import-button',
        icon: 'fa-upload',
        tooltip: content.importTooltip,
        clickFn: function() {
            map.openModal({
                template: content.importTemplate,
                okCls: 'modal-ok',
                okText: 'Import',
                cancelCls: 'modal-cancel',
                cancelText: 'Cancel',
                onShow: function(e) {
                    var importInput = document.getElementById('import-file');
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
                        clearMap();
                        var saveData = JSON.parse(fileContent);
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
                                icon: icons.factory()
                            });
                            newPoint.name = point.name;
                            newPoint.notes = point.notes;
                            drawnItems.addLayer(newPoint);
                            applyTargetInfoCallback(newPoint);
                        }
                        checkClearButtonDisabled();
                        e.modal.hide();
                    });
                    L.DomEvent.on(e.modal._container.querySelector('.modal-cancel'), 'click', function() {
                        e.modal.hide();
                    });
                }
            });
        }
    });
    map.addControl(importButton);

    var gridHopButton = new L.Control.CustomButton({
        position: 'topleft',
        id: 'gridhop-button',
        icon: 'fa-th-large',
        tooltip: content.gridHopTooltip,
        clickFn: function() {
            map.openModal({
                template: content.gridHopTemplate,
                okCls: 'modal-ok',
                okText: 'Go',
                cancelCls: 'modal-cancel',
                cancelText: 'Cancel',
                onShow: function(e) {
                    L.DomEvent.on(e.modal._container.querySelector('.modal-ok'), 'click', function() {
                        var grid = document.getElementById('grid-input').value;
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
    });
    map.addControl(gridHopButton);

    var missionHopButton = new L.Control.CustomButton({
        position: 'topleft',
        id: 'missionhop-button',
        icon: 'fa-crop',
        tooltip: content.missionHopTooltip,
        clickFn: function() {
            map.fitBounds(drawnItems.getBounds());
        }
    });
    map.addControl(missionHopButton);

    // MAP.ON EVENTS

    map.on('draw:created', function(e) {
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
    });

    map.on('draw:deletestart', function() {
        hideChildLayers();
    });

    map.on('draw:deletestop', function() {
        showChildLayers();
    });

    // END EVENTS

    checkClearButtonDisabled();

})();
