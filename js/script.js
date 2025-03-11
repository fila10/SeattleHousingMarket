mapboxgl.accessToken = 'pk.eyJ1Ijoic25lZGVjb3JqYWNlIiwiYSI6ImNtNnR1NjhueDA2dDcya24wMnJlcXJqdGQifQ.B_KtFOxpa2pNBufKS2HiQA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-122.335167, 47.62],
    zoom: 10.5
});

const square = document.querySelector('input[value="square"]');
const nominative = document.querySelector('input[value="nominative"]');

const colors = [
    '#999999',
    '#FEE7E7',
    '#E9A698',
    '#C9654F',
    '#A2160B'
];


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
                colors[0],
                1,
                colors[1], 
                num1,
                colors[2],
                num2,
                colors[3],
                num3,
                colors[4]
            ],
            'fill-outline-color': "#6E6E6E"
        }
    });

    let layers = [];
    if (variable === "PRICE_SQFT") {
        layers  = [
            "No Data",
            "≤ $" + new Intl.NumberFormat('en-US').format(num1 - 0.001),
            "$" + new Intl.NumberFormat('en-US').format(num1 + 0.009) + " to $" + new Intl.NumberFormat('en-US').format(num2 - 0.001),
            "$" + new Intl.NumberFormat('en-US').format(num2 + 0.009) + " to $" + new Intl.NumberFormat('en-US').format(num3 - 0.001),
            "> $" + new Intl.NumberFormat('en-US').format(num3 - 0.001)
        ];
        title = "per sq ft";
    } else {
        title = "nominative";
        layers  = [
            "No Data",
            "≤ $" + new Intl.NumberFormat('en-US').format(num1 - 1),
            "$" + new Intl.NumberFormat('en-US').format(num1) + " to $" + new Intl.NumberFormat('en-US').format(num2 - 1),
            "$" + new Intl.NumberFormat('en-US').format(num2) + " to $" + new Intl.NumberFormat('en-US').format(num3 - 1),
            "> $" + new Intl.NumberFormat('en-US').format(num3 - 1)
        ];
    }

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Median Price </b>(" + title + ")<br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
}

function swapLayer(oldLayer, newLayer, source, variable, num1, num2, num3) {
    if (map.getLayer(oldLayer)) {
        map.removeLayer(oldLayer);
        addNewLayer(newLayer, source, variable, num1, num2, num3);
    }
}