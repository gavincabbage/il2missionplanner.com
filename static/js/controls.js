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

})();
