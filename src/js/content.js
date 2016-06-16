module.exports = (function() {

    var fs = require('fs');

    // Edited original leaflet object
    var augmentedLeafletDrawLocal = {
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
    				marker: 'Mark a target'
    			}
    		},
    		handlers: {
    			circle: {
    				tooltip: {
    					start: 'Click and drag to draw circle'
    				},
    				radius: 'Radius'
    			},
    			marker: {
    				tooltip: {
    					start: 'Click to mark a target'
    				}
    			},
    			polygon: {
    				tooltip: {
    					start: 'Click to start drawing shape',
    					cont: 'Click to continue drawing shape',
    					end: 'Click first point to close this shape'
    				}
    			},
    			polyline: {
    				error: '<strong>Error:</strong> shape edges cannot cross!',
    				tooltip: {
    					start: 'Click to start a flight plan',
    					cont: 'Click to continue the flight plan',
    					end: 'Click last point to finish flight plan'
    				}
    			},
    			rectangle: {
    				tooltip: {
    					start: 'Click and drag to draw rectangle'
    				}
    			},
    			simpleshape: {
    				tooltip: {
    					end: 'Release mouse to finish drawing'
    				}
    			}
    		}
    	},
    	edit: {
    		toolbar: {
    			actions: {
    				save: {
    					title: 'Save changes',
    					text: 'Save'
    				},
    				cancel: {
    					title: 'Cancel editing, discard all changes',
    					text: 'Cancel'
    				}
    			},
    			buttons: {
    				edit: 'Edit map',
    				editDisabled: 'Nothing to edit',
    				remove: 'Delete items from the map',
    				removeDisabled: 'Nothing to delete'
    			}
    		},
    		handlers: {
    			edit: {
    				tooltip: {
    					text: 'Drag items to edit the map',
    					subtext: null
    				}
    			},
    			remove: {
    				tooltip: {
    					text: 'Click to delete items from the map'
    				}
    			}
    		}
    	}
    };

    var mapConfigs = {
        stalingrad: {
            fullName: 'Stalingrad',
            name: 'stalingrad',
            hash: '#stalingrad',
            selectIndex: 0,
            scale: 1.40056,
            latMin: 0,
            latMax: 164,
            latGridMax: 23,
            lngMin: 0,
            lngMax: 252,
            lngGridMax: 37,
            gridHopZoom: 5,
            tileUrl: 'http://tiles.il2missionplanner.com/stalingrad/{z}/{x}/{y}.png'
            //tileUrl: 'file:///Users/fkc930/Development/personal/tiles.il2missionplanner.com/dist/stalingrad/{z}/{x}/{y}.png'
        },
        moscow: {
            fullName: 'Moscow',
            name: 'moscow',
            hash: '#moscow',
            selectIndex: 1,
            scale: 1.46621,
            latMin: 0,
            latMax: 192,
            latGridMax: 29,
            lngMin: 0,
            lngMax: 192,
            lngGridMax: 29,
            gridHopZoom: 5,
            tileUrl: 'http://tiles.il2missionplanner.com/moscow/{z}/{x}/{y}.png'
            //tileUrl: 'file:///Users/fkc930/Development/personal/tiles.il2missionplanner.com/dist/moscow/{z}/{x}/{y}.png'
        },
        luki: {
            fullName: 'Velikie Luki',
            name: 'luki',
            hash: '#luki',
            selectIndex: 2,
            scale: 0.65306,
            latMin: 0,
            latMax: 160,
            latGridMax: 10.4,
            lngMin: 0,
            lngMax: 224,
            lngGridMax: 16.6,
            gridHopZoom: 4,
            tileUrl: 'http://tiles.il2missionplanner.com/luki/{z}/{x}/{y}.png'
            //tileUrl: 'file:///Users/fkc930/Development/personal/tiles.il2missionplanner.com/dist/luki/{z}/{x}/{y}.png'
        }
    };

    return {
        augmentedLeafletDrawLocal: augmentedLeafletDrawLocal,
        maps: mapConfigs,
        titleText: 'Il-2 Mission Planner',
        helpTooltip: 'How to use this tool',
        clearTooltip: 'Clear the map',
        mapSelectTooltip: 'Select game map',
        exportTooltip: 'Export mission plan',
        importTooltip: 'Import mission plan',
        gridHopTooltip: 'Jump to grid',
        missionHopTooltip: 'Jump to mission',
        settingsTooltip: 'Settings',
        flightModalTemplate: fs.readFileSync('src/html/flightModal.html', 'utf8'),
        flightLegModalTemplate: fs.readFileSync('src/html/flightLegModal.html', 'utf8'),
        confirmClearModalTemplate: fs.readFileSync('src/html/confirmClearModal.html', 'utf8'),
        helpModalTemplate: fs.readFileSync('src/html/helpModal.html', 'utf8'),
        pointModalTemplate: fs.readFileSync('src/html/pointModal.html', 'utf8'),
        mapSelectModalTemplate: fs.readFileSync('src/html/mapSelectModal.html', 'utf8'),
        importModalTemplate: fs.readFileSync('src/html/importModal.html', 'utf8'),
        gridJumpModalTemplate: fs.readFileSync('src/html/gridJumpModal.html', 'utf8'),
        settingsModalTemplate: fs.readFileSync('src/html/settingsModal.html', 'utf8')
    };
})();
