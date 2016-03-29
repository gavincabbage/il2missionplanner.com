(function() {

    // const
    //     MIN_LAT = 0.0,
    //     MAX_LAT = 1.964286,
    //     MIN_LONG = 0.089286,
    //     MAX_LONG = 3.125,
    //     GRIDS_WIDE = 33,
    //     GRIDS_TALL = 22,
    //     GRID_OFFSET = 37,
    //     GRID_ROW_DIFF = 3,
    //     MAP_FILE = 'img/map.png',
    //     MAP_BOUNDS = [[MIN_LAT, MIN_LONG], [MAX_LAT, MAX_LONG]],
    //     GRID_SIDE_LENGTH =
    //             ((MAX_LAT-MIN_LAT)/GRIDS_TALL + (MAX_LONG - MIN_LONG)/GRIDS_WIDE) / 2,
    //     GRID_SIDE_DISTANCE = 10,
    //     RED_PATH_OPTIONS = {
    //         color: '#ff0000',
    //         fillColor: '#ff0000',
    //         fill: true,
    //         fillOpacity: 1,
    //         opacity: 1,
    //         weight: 1
    //     },
    //     RED_POLYLINE_OPTIONS = {
    //         color: '#ff0000',
    //         weight: 2,
    //         opacity: 1
    //     }
    //     DEFAULT_SPEED = 300
    // ;
    //
    // function calculateDistance(start, end) {
    //     var deltaLng = end.lng - start.lng;
    //     var deltaLat = end.lat - start.lat;
    //     return Math.sqrt(deltaLng*deltaLng + deltaLat*deltaLat);
    // }
    //
    // function convertLatLngDistance(distance) {
    //     return distance / GRID_SIDE_LENGTH * GRID_SIDE_DISTANCE;
    // }
    //
    // function convertDistanceToTime(distance, speed) {
    //     let hours = distance / speed;
    //     let seconds = (hours * 3600);
    //     let minutes = Math.floor(seconds / 60);
    //     let secondsOver = seconds % 60;
    //     let formattedSeconds = secondsOver < 10 ? '0'+secondsOver.toFixed(0) : secondsOver.toFixed(0);
    //     return minutes.toFixed(0) + ':' + formattedSeconds;
    // }
    //
    // function getRowSubtotal(lat) {
    //     var invertedLat = MAX_LAT - lat;
    //     var numRows = Math.floor(invertedLat / GRID_SIDE_LENGTH);
    //     var gridDiff = numRows * GRID_ROW_DIFF;
    //     return numRows * GRIDS_WIDE + gridDiff;
    // }
    //
    // function latLngToGrid(latLng) {
    //     var subtotal = getRowSubtotal(latLng.lat);
    //     var numCols = Math.floor(latLng.lng / GRID_SIDE_LENGTH);
    //     var total = subtotal + numCols + GRID_OFFSET;
    //     return total;
    // }
    //
    // function mathDegreesToGeographic(degrees) {
    //     if (degrees < 0) {
    //         degrees += 360;
    //     }
    //     return (450 - degrees) % 360;
    // }
    //
    // function calculateHeading(start, end) {
    //     var radians = Math.atan2(end.lat - start.lat, end.lng - start.lng);
    //     var degrees = radians * 180 / Math.PI;
    //     degrees = mathDegreesToGeographic(degrees);
    //     return degrees;
    // }
    //
    // function setToolbarLanguage() {
    //     L.drawLocal.draw.toolbar.buttons.polyline = 'Map a flight';
    //     L.drawLocal.draw.toolbar.buttons.marker = 'Mark a location';
    //     L.drawLocal.edit.toolbar.buttons.edit = 'Edit a flight';
    //     L.drawLocal.edit.toolbar.buttons.editDisabled = 'No flights to edit';
    //     L.drawLocal.edit.toolbar.buttons.delete = 'Delete a flight';
    //     L.drawLocal.edit.toolbar.buttons.delete = 'No flights to delete';
    // }
    //
    // function applyNavigationToPolyline(polyline) {
    //     polyline.setStyle(RED_POLYLINE_OPTIONS);
    //
    //     var decorator = L.polylineDecorator(polyline, {
    //         patterns: [
    //         {
    //             repeat: false,
    //             symbol: L.Symbol.arrowHead({
    //                 pathOptions: RED_PATH_OPTIONS
    //             })
    //         }]
    //     }).addTo(map);
    //
    //
    //     var latLngs = polyline.getLatLngs();
    //     for (ndx = 0; ndx < latLngs.length; ndx++) {
    //
    //         if (ndx > 0) {
    //             var circle = L.circleMarker(latLngs[ndx], RED_PATH_OPTIONS);
    //             circle.setRadius(2);
    //             map.addLayer(circle);
    //             drawnItems.addLayer(circle);
    //         }
    //
    //         if (ndx < latLngs.length-1) {
    //             var heading = calculateHeading(latLngs[ndx], latLngs[ndx+1]);
    //             var distance = convertLatLngDistance(calculateDistance(latLngs[ndx], latLngs[ndx+1]));
    //             var time = convertDistanceToTime(distance, speed);
    //             L.marker(latLngs[ndx], {
    //                 icon: L.divIcon({
    //                     className: 'heading-icon',
    //                     html: heading.toFixed(0) + '&deg;|' + distance.toFixed(1) + 'km.|' + time,
    //                     iconAnchor: latLngs[ndx],
    //                     iconSize: [100, 0]
    //                 })
    //             }).addTo(map);
    //         }
    //     }
    //     return polyline;
    // }
    //
    // setToolbarLanguage();
    // var speed = DEFAULT_SPEED;

    // var map = L.map('map', {
    //     crs: L.CRS.Simple,
    //     maxZoom: 11,
    //     minZoom: 9,
    //     attributionControl: false,
    //     drawControlTooltips: false
    // });
    //
    // var bounds = MAP_BOUNDS;
    // var image = L.imageOverlay(MAP_FILE, bounds).addTo(map);
    // map.fitBounds(bounds);

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

    // L.marker([0,0]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([0,1]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([1,0]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([1,1]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([2,2]).bindLabel('HELLO THERE').addTo(map);
    //
    // L.marker([0,10]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([0,25]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([0,252]).bindLabel('HELLO THERE').addTo(map);
    // L.marker([164,0]).bindLabel('HELLO THERE').addTo(map);
    //
    // map.on('moveend', function() {
    //  console.log(map.getBounds());
    // });
    //
    // console.log(map.project([0, 0], 1));
    // console.log(map.project([16128, 10496], 1));


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
    //
    map.on('draw:created', function(e) {
        if (e.layerType === 'marker') {
            e.layer.bindLabel(e.layer.getLatLng().toString() + ', grid ' + latLngToGrid(e.layer.getLatLng()).toString());
        } else if (e.layerType === 'polyline') {
            //e.layer = applyNavigationToPolyline(e.layer);
        }
        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
    });
    //
    // map.on('draw:edited', function(e) {
    //     e.layers.eachLayer(function(layer) {
    //         if (typeof layer.getLatLngs !== 'undefined') {
    //             applyNavigationToPolyline(layer);
    //         }
    //     })
    // });

})();
