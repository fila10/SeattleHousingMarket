mapboxgl.accessToken = 'pk.eyJ1Ijoic25lZGVjb3JqYWNlIiwiYSI6ImNtNnR1NjhueDA2dDcya24wMnJlcXJqdGQifQ.B_KtFOxpa2pNBufKS2HiQA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-122.335167, 47.62],
    zoom: 9.8
});

const square = document.querySelector('input[value="square"]');
const nominative = document.querySelector('input[value="nominative"]');

function addNewLayer(layerName, source, variable, num1, num2, num3) {
    map.addLayer({
        'id': layerName,
        'type': 'fill',
        'source': source,
        paint: {
            // These fill colors were created using the "Natural Breaks (Jenks) Method in ArcGIS Pro"
            'fill-color': [
                'step',
                ['get', variable],
                '#999999',
                1,
                '#FEE7E7', 
                num1,
                '#E9A698',
                num2,
                '#C9654F',
                num3,
                '#A2160B'
            ],
            'fill-outline-color': "#6E6E6E"
        }
    });
}

function swapLayer(oldLayer, newLayer, source, variable, num1, num2, num3) {
    if (map.getLayer(oldLayer)) {
        map.removeLayer(oldLayer);
        addNewLayer(newLayer, source, variable, num1, num2, num3);
    }
}