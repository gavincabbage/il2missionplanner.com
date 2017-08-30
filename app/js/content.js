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
            defaultZoom: 3,
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
            defaultZoom: 3,
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
            lngMax: 254,
            lngGridMax: 17.6,
            gridHopZoom: 4,
            defaultZoom: 3,
            tileUrl: 'http://tiles.il2missionplanner.com/luki/{z}/{x}/{y}.png'
            //tileUrl: 'file:///Users/fkc930/Development/personal/tiles.il2missionplanner.com/dist/luki/{z}/{x}/{y}.png'
        },
        kuban: {
            fullName: 'Kuban',
            name: 'kuban',
            hash: '#kuban',
            selectIndex: 3,
            scale: 2.876397232, // TODO 18882 19327 -> 445px per 10km | 18477w 12792h
            latMin: 0,
            latMax: 103, // TODO
            latGridMax: 29.7,
            lngMin: 0,
            lngMax: 148, // TODO
            lngGridMax: 42.5,
            gridHopZoom: 6,
            defaultZoom: 4,
            tileUrl: 'http://tiles.il2missionplanner.com/kuban/{z}/{x}/{y}.png'
            //tileUrl: 'http://localhost:5001//kuban/{z}/{x}/{y}.png'
        }
    };

    var defaults = {
      flightName: 'New Flight',
      flightSpeed: 300,
      pointType: 'marker',
      pointColor: 'black',
      pointName: 'New Marker'
    };

    var validatinatorConfig = {
        'grid-jump-form': {
            'grid-input': 'digitsLength:4'
        },
        'flight-leg-form': {
            'flight-leg-speed': 'between:0,9999'
        },
        'connect-form': {
            'stream-password': 'required',
            'stream-code': 'requiredIf:leader-checkbox:checked'
        }
    };

    return {
        augmentedLeafletDrawLocal: augmentedLeafletDrawLocal,
        maps: mapConfigs,
        default: defaults,
        validatinatorConfig: validatinatorConfig,
        titleText: 'Il-2 Mission Planner',
        helpTooltip: 'How to use this tool',
        clearTooltip: 'Clear the map',
        exportTooltip: 'Export mission plan',
        importTooltip: 'Import mission plan',
        gridHopTooltip: 'Jump to grid',
        missionHopTooltip: 'Jump to mission',
        settingsTooltip: 'Settings',
        streamTooltip: 'Stream mission plan',
        flightModalTemplate: fs.readFileSync('app/html/flightModal.html', 'utf8'),
        flightLegModalTemplate: fs.readFileSync('app/html/flightLegModal.html', 'utf8'),
        confirmClearModalTemplate: fs.readFileSync('app/html/confirmClearModal.html', 'utf8'),
        helpModalTemplate: fs.readFileSync('app/html/helpModal.html', 'utf8'),
        pointModalTemplate: fs.readFileSync('app/html/pointModal.html', 'utf8'),
        importModalTemplate: fs.readFileSync('app/html/importModal.html', 'utf8'),
        gridJumpModalTemplate: fs.readFileSync('app/html/gridJumpModal.html', 'utf8'),
        settingsModalTemplate: fs.readFileSync('app/html/settingsModal.html', 'utf8'),
        streamModalTemplate: fs.readFileSync('app/html/streamModal.html', 'utf8'),
        startStreamModalTemplate: fs.readFileSync('app/html/startStreamModal.html', 'utf8'),
        connectStreamModalTemplate: fs.readFileSync('app/html/connectStreamModal.html', 'utf8'),
        alreadyConnectedModalTemplate: fs.readFileSync('app/html/alreadyConnectedModal.html', 'utf8'),
        alreadyStreamingModalTemplate: fs.readFileSync('app/html/alreadyStreamingModal.html', 'utf8')
    };
})();
