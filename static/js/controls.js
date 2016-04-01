(function() {

    L.Control.TitleControl = L.Control.extend({

        options: {
            position: 'topright'
        },

        onAdd: function() {
            var container = L.DomUtil.create('div', 'title-control');
            container.innerHTML = 'Il-2: Battle of Stalingrad Mission Planner';
            return container;
        }
    });

    L.Control.ClearButton = L.Control.extend({

        clearFn: null,
        options: {
            position: 'bottomleft'
        },

        initialize: function(options, fn) {
            L.Control.prototype.initialize(options);
            clearFn = fn;
        },

        onAdd: function() {
            var container = L.DomUtil.create('div', 'leaflet-bar');
            var link = L.DomUtil.create('a', 'fa fa-trash', container);
            link.addEventListener('click', function() {
                clearFn();
            });
            return container;
        }
    });

    // L.Control.ModalButton = L.Control.extend({
    //
    //     clearFn: null,
    //     options: {
    //         position: 'bottomleft'
    //     },
    //
    //     initialize: function(options, fn) {
    //         L.Control.prototype.initialize(options);
    //         clearFn = fn;
    //     },
    //
    //     onAdd: function() {
    //         var container = L.DomUtil.create('div', 'leaflet-bar');
    //         L.DomEvent
    //             .addListener(container, 'click', L.DomEvent.stopPropagation)
    //             .addListener(container, 'click', L.DomEvent.preventDefault)
    //             .addListener(container, 'dblclick', L.DomEvent.stopPropagation)
    //             .addListener(container, 'dblclick', L.DomEvent.preventDefault)
    //             .addListener(container, 'mousedown', L.DomEvent.stopPropagation)
    //             .addListener(container, 'mousedown', L.DomEvent.preventDefault);
    //         var link = L.DomUtil.create('a', 'fa fa-camera-retro', container);
    //         link.setAttribute('href', '#modal');
    //         return container;
    //     }
    // });


})();
