module.exports = (function() {

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
        flightModalTemplate:
            '<div id="flight-modal"> \
                <h2>Configure flight</h2> \
                <form onsubmit="return false;"> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="flight-name">Flight name</label> \
                        <input id="flight-name" class="modal-item-input" value="{name}" placeholder="name"></input> \
                    </div> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="flight-speed">Average speed</label> \
                        <input id="flight-speed" class="modal-item-input" value="{speed}"></input> \
                    </div> \
                    <button class="{okCls}" type="button">{okText}</button> \
                </form> \
            </div>',
        flightLegModalTemplate:
            '<div id="flight-leg-modal"> \
                <h2>Configure flight leg</h2> \
                <form onsubmit="return false;"> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="flight-speed">Speed</label> \
                        <input id="flight-leg-speed" class="modal-item-input" value="{speed}"></input> \
                    </div> \
                    <button class="{okCls}" type="button">{okText}</button> \
                </form> \
            </div>',
        confirmClearTemplate:
            '<div id="confirm-clear-modal"> \
                <h2>Clear the map</h2> \
                <p>Are you sure? This action cannot be undone.</p> \
                <button class="{okCls}">{okText}</button> \
                <button class="{cancelCls}">{cancelText}</button> \
            </div>',
        helpTemplate:
            '<div id="help-modal"> \
                <h2>How to</h2> \
                <img class="modal-image" src="img/help.png" height="480"></img> \
            </div>',
        targetModalTemplate:
            '<div id="target-modal"> \
                <h2>Configure target</h2> \
                <form onsubmit="return false;"> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="target-name">Target name</label> \
                        <input id="target-name" class="modal-item-input" value="{name}" placeholder="name"></input> \
                    </div> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="target-notes">Notes</label> \
                        <textarea id="target-notes" class="modal-item-text" value="{notes}">{notes}</textarea> \
                    </div> \
                    <button class="{okCls}" type="button">{okText}</button> \
                </form> \
            </div>',
        mapSelectTemplate:
            '<div id="help-modal"> \
                <h2>Change map</h2> \
                <form> \
                    <select id="map-select"> \
                        <option value="stalingrad">Stalingrad</option> \
                        <option value="moscow">Moscow</option> \
                        <option value="luki">Velikie Luki</option> \
                    </select> \
                    <button class="{okCls}" type="button">{okText}</button> \
                </form> \
            </div>',
        importTemplate:
            '<div id="import-modal"> \
                <h2>Import Mission Plan</h2> \
                <input id="import-file" type="file" name="importFile"></input>\
                <button class="{okCls}">{okText}</button> \
                <button class="{cancelCls}">{cancelText}</button> \
            </div>',
        gridHopTemplate:
            '<div id="gridhop-modal"> \
                <h2>Jump to grid</h2> \
                <form onsubmit="return false;"> \
                    <div class="modal-item"> \
                        <label class="modal-item-label" for="grid-input">Grid</label> \
                        <input id="grid-input" class="modal-item-input" placeholder="0000" maxlength="4"></input> \
                    </div> \
                    <button class="{okCls}" type="button">{okText}</button> \
                    <button class="{cancelCls}" type="button">{cancelText}</button> \
                </form> \
            </div>',
    };
})();
