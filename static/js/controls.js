var drawnItems = (function(content) {

    var drawnItems = new L.FeatureGroup();

    const
        FA_PLANE = 'fa-plane',
        FA_MARKER = 'fa-map-marker',
        FA_TRASH = 'fa-trash',
        FA_ERASER = 'fa-eraser',
        FA_PENCIL = 'fa-pencil';

    var createControl = function(icon, container, title, callback) {
        var classes = 'fa ' + icon;
        var control = L.DomUtil.create('a', classes, container);
        control.title = title;
        var href = '#';
        L.DomEvent.addListener(control, 'click', callback);
    }

    var createToolbarDiv = function() {
        var div = L.DomUtil.create('div', 'leaflet-bar');
        L.DomEvent
            .addListener(div, 'click', L.DomEvent.stopPropagation)
            .addListener(div, 'click', L.DomEvent.preventDefault)
            .addListener(div, 'dblclick', L.DomEvent.stopPropagation)
            .addListener(div, 'dblclick', L.DomEvent.preventDefault)
            .addListener(div, 'mousedown', L.DomEvent.stopPropagation)
            .addListener(div, 'mousedown', L.DomEvent.preventDefault);
        return div;
    }

    L.Control.FlightCreationToolbar = L.Control.extend({

        options: {
            position: 'topleft'
        },

        onAdd: function(map) {

            var controlDiv = createToolbarDiv();

            createControl(FA_PLANE, controlDiv, content.toolbar.buttons.flight, function() {
                new L.Draw.Polyline(map, {}).enable();
            });
            createControl(FA_MARKER, controlDiv, content.toolbar.buttons.marker, function() {
                new L.Draw.Marker(map, {}).enable();
            });

            return controlDiv;
        }
    });

    L.Control.FlightEditToolbar = L.Control.extend({

        options: {
            position: 'topleft'
        },

        onAdd: function(map) {

            var controlDiv = createToolbarDiv();

            createControl(FA_ERASER, controlDiv, content.toolbar.buttons.delete, function() {
                new L.EditToolbar.Delete(map, {
                    featureGroup: drawnItems
                }).enable();
            });

            createControl(FA_TRASH, controlDiv, content.toolbar.buttons.clear, function() {
                drawnItems.clearLayers();
            });

            // TODO Edit control first attempt
            // Keep commented out for arcane selectedPathOptions required insight
            // createControl(FA_PENCIL, controlDiv, content.toolbar.buttons.polyline, function() {
            //     new L.EditToolbar.Edit(map, {
            //         featureGroup: drawnItems,
            //         selectedPathOptions: {
            //             maintainColor: true,
            //             opacity: 0.3
            //         }
            //     }).enable();
            // });

            return controlDiv;
        }
    });

    return drawnItems;

})(content);
