var state = {
    style: '2/flow_relative-light'
};
let center = [31.3508916099721,30.057316244023994]
var map = tt.map({
    key: 'NkYMUbTzRUoHALzkBZHf9PdS3KA5VEWg',
    container: 'map',
    style: getCurrentStyleUrl(),
    stylesVisibility: {
        trafficFlow: true
    },
    center: center,
    zoom: 10,
    // dragPan: !isMobileOrTablet()
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

function getCurrentStyleUrl() {
    return 'https://api.tomtom.com/style/1/style/22.2.1-*?map=2/basic_street-light' +
              '&traffic_flow=' + state.style + '&poi=2/poi_light&key=NkYMUbTzRUoHALzkBZHf9PdS3KA5VEWg';
}