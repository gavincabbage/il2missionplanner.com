var content = (function() {

    var content = {
        html: {
            flightModalTemplate: '<h1>Configure Flight</h1><form id="{formId}" onsubmit="submitModal()"><label for="speed">Speed (km/h)</label><input type="number" name="speed" min="1" max="999" value="{defaultSpeed}"><label for="speed">Altitude (km):</label><input type="number" name="altitude" min="1" max="9999" value="{defaultAltitude}"><input type="submit" value="Submit"></form>'
        }
    }

    //  Just copied this wholesale from Leaflet.draw and edited some
    L.drawLocal = {
        draw: {
    		toolbar: {
    			actions: {
    				title: 'Cancel',
    				text: 'Cancel'
    			},
    			finish: {
    				title: 'Finish',
    				text: 'Finish'
    			},
    			undo: {
    				title: 'Delete last point',
    				text: 'Delete last point'
    			},
    			buttons: {
    				polyline: 'Map a flight',
    				polygon: 'Draw a polygon',
    				rectangle: 'Draw a rectangle',
    				circle: 'Draw a circle',
    				marker: 'Mark a location'
    			}
    		},
    		handlers: {
    			circle: {
    				tooltip: {
    					start: 'Click and drag to draw circle.'
    				},
    				radius: 'Radius'
    			},
    			marker: {
    				tooltip: {
    					start: 'Click map to mark a location.'
    				}
    			},
    			polygon: {
    				tooltip: {
    					start: 'Click to start drawing shape.',
    					cont: 'Click to continue drawing shape.',
    					end: 'Click first point to close this shape.'
    				}
    			},
    			polyline: {
    				error: '<strong>Error:</strong> shape edges cannot cross!',
    				tooltip: {
    					start: 'Click to start a flight plan.',
    					cont: 'Click to continue the flight plan.',
    					end: 'Click last point to finish flight plan.'
    				}
    			},
    			rectangle: {
    				tooltip: {
    					start: 'Click and drag to draw rectangle.'
    				}
    			},
    			simpleshape: {
    				tooltip: {
    					end: 'Release mouse to finish drawing.'
    				}
    			}
    		}
    	},
    	edit: {
    		toolbar: {
    			actions: {
    				save: {
    					title: 'Save changes.',
    					text: 'Save'
    				},
    				cancel: {
    					title: 'Cancel editing, discard all changes.',
    					text: 'Cancel'
    				}
    			},
    			buttons: {
    				edit: 'Edit map.',
    				editDisabled: 'Nothing to edit.',
    				remove: 'Delete items from the map.',
    				removeDisabled: 'Nothing to delete.'
    			}
    		},
    		handlers: {
    			edit: {
    				tooltip: {
    					text: 'Drag items to edit the map.',
    					subtext: null
    				}
    			},
    			remove: {
    				tooltip: {
    					text: 'Click to delete items from the map.'
    				}
    			}
    		}
    	}
    };

    return content;

})();
