(function(content) {

    L.Control.TitleControl = L.Control.extend({

        options: {
            position: 'topright'
        },

        onAdd: function(e) {
            L.DomEvent.stop(e);
            var container = L.DomUtil.create('div', 'title-control');
            L.DomEvent.disableClickPropagation(container);
            container.innerHTML = content.titleText;
            return container;
        }
    });

    L.Control.CustomButton = L.Control.extend({

        options: {
            position: 'bottomleft'
        },

        initialize: function(options) {
            L.Control.prototype.initialize.call(this, options);
        },

        onAdd: function(e) {
            L.DomEvent.stop(e);
            var container = L.DomUtil.create('div', 'leaflet-bar');
            L.DomEvent.disableClickPropagation(container);
            var link = L.DomUtil.create('a', 'fa '+this.options.icon, container);
            container.title = this.options.tooltip;
            link.id = this.options.id;
            link.addEventListener('click', this.options.clickFn);
            return container;
        }
    });

})(content);
