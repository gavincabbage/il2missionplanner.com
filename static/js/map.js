(function() {

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
            circle: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function(e) {
        map.addLayer(e.layer);
        drawnItems.addLayer(e.layer);
    });

    map.on('moveend', function() {
     console.log(map.getBounds());
    });

    L.marker([0,0]).addTo(map);
    L.marker([0,1]).addTo(map);
    L.marker([1,0]).addTo(map);
    L.marker([1,1]).addTo(map);
    L.marker([2,2]).addTo(map);
    L.marker([0,10]).addTo(map);
    L.marker([0,25]).addTo(map);
    L.marker([0,252]).addTo(map);
    L.marker([164,0]).addTo(map);

    map.setMaxBounds(new L.LatLngBounds([-5,-5], [169,257])); // bounds in map units plus 1

})();
