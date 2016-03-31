(function() {

    L.Control.TitleControl = L.Control.extend({

        options: {
            position: 'topright'
        },

        onAdd: function(map) {
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

        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'leaflet-bar');
            var link = L.DomUtil.create('a', 'fa fa-trash', container);
            link.addEventListener('click', function() {
                clearFn();
            });
            return container;
        }
    });

})();
