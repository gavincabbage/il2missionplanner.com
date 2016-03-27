var drawnItems = (function(content) {

    var drawnItems = new L.FeatureGroup();

    const
        FA_PLANE = 'fa-plane',
        FA_MARKER = 'fa-map-marker',
        FA_TRASH = 'fa-trash',
        FA_ERASER = 'fa-eraser',
        FA_PENCIL = 'fa-pencil';

    var createControl = function(icon, container, title, handler) {
        var classes = 'fa ' + icon;
        var control = L.DomUtil.create('a', classes, container);
        control.title = title;
        var href = '#';
        L.DomEvent.addListener(control, 'click', function() {
            handler.enable();
        });
    }

    var createControl2 = function(icon, container, title, callback) {
        var classes = 'fa ' + icon;
        var control = L.DomUtil.create('a', classes, container);
        control.title = title;
        var href = '#';
        L.DomEvent.addListener(control, 'click', callback);
    }



    L.Control.FlightCreationToolbar = L.Control.extend({

        options: {
            position: 'topleft'
        },

        onAdd: function(map) {

            var controlDiv = L.DomUtil.create('div', 'leaflet-bar');
            L.DomEvent
                .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

            createControl(FA_PLANE, controlDiv,
                    content.toolbar.buttons.polyline, new L.Draw.Polyline(map, {}));
            createControl(FA_MARKER, controlDiv,
                    content.toolbar.buttons.marker, new L.Draw.Marker(map, {}));

            return controlDiv;
        }
    });

    L.Control.FlightEditToolbar = L.Control.extend({

        options: {
            position: 'topleft'
        },

        onAdd: function(map) {

            var controlDiv = L.DomUtil.create('div', 'leaflet-bar');
            L.DomEvent
                .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                .addListener(controlDiv, 'click', L.DomEvent.preventDefault);

            createControl2(FA_PENCIL, controlDiv, content.toolbar.buttons.polyline, function() {
                new L.EditToolbar.Edit(map, {
                    featureGroup: drawnItems
                }).enable();
            });

            createControl2(FA_TRASH, controlDiv, content.toolbar.buttons.polyline, function() {
                drawnItems.clearLayers();
            });


            //
            //
            // createControl2(FA_MARKER, controlDiv,
            //         content.toolbar.buttons.marker, new L.Draw.Marker(map, {}));

            return controlDiv;
        }
    });

    return drawnItems;

})(content);
