var state = {
    style: '2/flow_relative-light'
};
var state2 = {
            style2: '2/incidents_light'
};  
let center = [31.3508916099721,30.057316244023994]
var map = tt.map({
    key: 'NkYMUbTzRUoHALzkBZHf9PdS3KA5VEWg',
    container: 'map',
    style: getCurrentStyleUrl(),
    stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true
    },
    center: center,
    zoom: 10,
    // dragPan: !isMobileOrTablet()
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());


function getCurrentStyleUrl() {
    return 'https://api.tomtom.com/style/1/style/22.2.1-*?map=2/basic_street-light' +
              '&traffic_flow=' + state.style + '&poi=2/poi_light&key=NkYMUbTzRUoHALzkBZHf9PdS3KA5VEWg' +
              '&traffic_incidents=' + state2.style2 ;
}


var styleSelect = tail.select('.js-style-select', {
    classNames: 'tt-fake-select',
    hideSelected: true
});


map.once('load', function() {
    styleSelect.on('change', function(event) {
        state.style = event.value;
        map.setStyle(getCurrentStyleUrl());
    });
});




var infoHint = new InfoHint('info', 'bottom-center', 10000)
.addTo(document.getElementById('map'));

infoHint.setMessage('Click on POI icons to select them.');

var popup = null;
var hoveredFeature = null;

map.on('load', function() {
bindMapEvents();
});


function bindMapEvents() {
    map.on('click', function(event) {
        var feature = map.queryRenderedFeatures(event.point)[0];

        hidePoiMarker();

        if (feature.sourceLayer === 'Point of Interest') {
            map.addLayer({
                'id': 'selectedPoi',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': feature.geometry.coordinates
                        }
                    }
                },
                'type': 'symbol',
                'paint': {
                    'text-color': 'rgba(0, 0, 0, 1)',
                    'text-halo-color': 'rgba(255, 255, 255, 1)',
                    'text-halo-width': 1
                },
                'layout': {
                    'text-field': feature.properties.name || feature.properties.description,
                    'icon-image': `${feature.properties.icon}_pin`,
                    'icon-anchor': 'bottom',
                    'text-letter-spacing': 0.1,
                    'icon-padding': 5,
                    'icon-offset': [0, 5],
                    'text-max-width': 10,
                    'text-variable-anchor': ['top'],
                    'text-font': ['Noto-Bold'],
                    'text-size': 14,
                    'text-radial-offset': 0.2
                }
            });
        }
    });

    
    map.on('mouseenter', 'POI', function(event) {
        map.getCanvas().style.cursor = 'pointer';
        var feature = map.queryRenderedFeatures(event.point)[0];

        createPopup(feature);
        hoveredFeature = feature;

        map.setFeatureState(feature, { hover: true });
    });

    map.on('mouseleave', 'POI', function(event) {
        map.getCanvas().style.cursor = '';

        if (hoveredFeature) {
            map.setFeatureState(hoveredFeature, { hover: false });
        }

        hoveredFeature = null;

        if (!event.originalEvent.relatedTarget) {
            removePopup();
        }
    });

    map.on('click', 'POI', function(event) {
        map.getCanvas().style.cursor = '';

        if (hoveredFeature) {
            map.setFeatureState(hoveredFeature, { hover: false });
        }

        hoveredFeature = null;

        if (!event.originalEvent.relatedTarget) {
            removePopup();
        }
    });
}

function createPopup(result) {
    var markerSize = 10;
    removePopup();

    var popupOffset = {
        'top': [0, markerSize],
        'top-left': [0, markerSize],
        'top-right': [0, markerSize],
        'bottom': [0, -markerSize],
        'bottom-left': [0, -markerSize],
        'bottom-right': [0, -markerSize],
        'left': [markerSize, -markerSize],
        'right': [-markerSize, -markerSize]
    };

    var htmlContent = document.createElement('div');

    htmlContent.innerHTML = '<div class="popup-container">' +
        '<div class="category">' +
            Formatters.formatCategoryName(result.properties.category) +
        '</div>' +
        '<div class="name">' + result.properties.name + '</div>' +
    '</div>';

    popup = new tt.Popup({ offset: popupOffset })
        .setLngLat(result.geometry.coordinates)
        .setDOMContent(htmlContent)
        .addTo(map)
        .setMaxWidth('200px');

    htmlContent.addEventListener('mouseleave', function() {
        removePopup();
    });
}

function removePopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }
}

function hidePoiMarker() {
    if (map.getLayer('selectedPoi')) {
        map.removeLayer('selectedPoi');
        map.removeSource('selectedPoi');
    }
}




