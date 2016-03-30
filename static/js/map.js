(function(content) {

    const
        SCALE_FACTOR = 7.14,
        LAT_MIN = 0
        LAT_MAX = 164,
        LNG_MIN = 0,
        LNG_MAX = 252,
        BORDER = 5,
        CENTER = [LAT_MAX / 2, LNG_MAX / 2]
    ;

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
                shapeOptions: {
                    color: '#ff0000',
                    weight: 2
                }
            }
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

    map.on('draw:drawvertex', function(e) {
        console.log(e.layers.getLayers());
        // e.layers.eachLayer(function(layer) {
        //     console.log(layer);
        // });
        // var layers = e.layers.getLayers();
        // console.log(layers.pop());
        // var cur = layers.pop();
        // var curLatLng = cur.getLatLng();
        // var prev = layers[layers.length-2];
        // var prevLatLng = prev.getLatLng();
        //
        // L.marker(curLatLng, {
        //     icon: L.divIcon({
        //         className: 'heading-icon',
        //         html: curLatLng.distanceTo(prevLatLng).toString(),
        //         iconAnchor: curLatLng,
        //         iconSize: [100, 0]
        //     })
        // }).addTo(map).addTo(drawnItems);

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

    L.marker([7.219,5.016]).addTo(map);
    L.marker([14.359,12.156]).addTo(map);

    map.setMaxBounds(new L.LatLngBounds(
        [LAT_MIN - BORDER, LNG_MIN - BORDER],
        [LAT_MAX + BORDER, LNG_MAX + BORDER]
    ));

})(content);
