var content = (function() {

    var content = {
        toolbar: {
            buttons: {
                flight: 'Map a flight',
                marker: 'Mark a location',
                clear: 'Clear the map',
                delete: 'Delete an item from the map'
            }
        }
    };

    function setToolbarLanguage() {
        L.drawLocal.draw.toolbar.buttons.polyline = content.toolbar.buttons.polyline;
        L.drawLocal.draw.toolbar.buttons.marker = content.toolbar.buttons.marker;
        L.drawLocal.edit.toolbar.buttons.edit = content.toolbar.buttons.edit;
        L.drawLocal.edit.toolbar.buttons.editDisabled = content.toolbar.buttons.editDisabled;
        L.drawLocal.edit.toolbar.buttons.delete = content.toolbar.buttons.delete;
        L.drawLocal.edit.toolbar.buttons.deleteDisabled = content.toolbar.buttons.deleteDisabled;
    }

    setToolbarLanguage();
    return content
})();
