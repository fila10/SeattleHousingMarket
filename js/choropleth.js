// ✅ Use your Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHN1Z3MiLCJhIjoiY203em45cTM5MG1kZTJscHk1bWJweGp5NiJ9.4iDQS5066jGVPcFcZArztQ';

const SEATTLE_CENTER = [-122.3321, 47.6062];
const DEFAULT_ZOOM = 10.5;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mattsugs/cm83gnyhu000b01ss292i88x5',
    center: SEATTLE_CENTER,
    zoom: DEFAULT_ZOOM
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
    }, 'poi-label');

    let layers = [];
    if (variable === "PRICE_SQFT") {
        title = "per sq ft";
        layers = [
            "No Data",
            "≤ $" + new Intl.NumberFormat('en-US').format(num1 - 0.001),
            "$" + new Intl.NumberFormat('en-US').format(num1 + 0.009) + " to $" + new Intl.NumberFormat('en-US').format(num2 - 0.001),
            "$" + new Intl.NumberFormat('en-US').format(num2 + 0.009) + " to $" + new Intl.NumberFormat('en-US').format(num3 - 0.001),
            "> $" + new Intl.NumberFormat('en-US').format(num3 - 0.001)
        ];
    } else {
        title = "nominative";
        layers = [
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

// ✅ Reset View Function
function resetMapView() {
    map.flyTo({ center: SEATTLE_CENTER, zoom: DEFAULT_ZOOM, essential: true });
    map.setFilter('tract-selected', ['==', 'CRA_NAME', '']); // Reset selection
}

document.getElementById("resetView").addEventListener("click", resetMapView);

let currentDataset;

// ✅ Function to Load Housing Data & Update Rankings
async function loadHousingData() {
    try {
        const response = await fetch(currentDataset);
        const data = await response.json();
        const features = data.features;

        // Detect if the selected display is per square foot or nominative
        const priceKey = document.querySelector('input[name="selector"]:checked').value === "square"
            ? "PRICE_SQFT"
            : "PRICE_NOM";

        // Extract and sort prices
        const sortedByPrice = features
            .filter(f => f.properties[priceKey]) // Ensure valid prices
            .sort((a, b) => a.properties[priceKey] - b.properties[priceKey]);

        // Get top 5 cheapest & most expensive
        const cheapest = sortedByPrice.slice(0, 5);
        const expensive = sortedByPrice.slice(-5).reverse();

        updateTopList(cheapest, "cheapest-list", priceKey);
        updateTopList(expensive, "expensive-list", priceKey);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// ✅ Function to Update Lists (Now with Neighborhood & Census Tract)
function updateTopList(data, listId, priceKey) {
    const list = document.getElementById(listId);
    list.innerHTML = ""; // Clear previous content
    const headings = document.querySelectorAll('h3');
    if (priceKey === "PRICE_SQFT") {
        headings[1].innerHTML = "💰 Top 5 Most Expensive<br>(Per Sq Ft)";
        headings[2].innerHTML = "🏡 Top 5 Cheapest (Per Sq Ft)";
    } else {
        headings[1].innerHTML = "💰 Top 5 Most Expensive<br>(Nominative)";
        headings[2].innerHTML = "🏡 Top 5 Cheapest (Nominative)";
    };

    data.forEach(feature => {
        const neighborhood = feature.properties.CRA_NAME || "Unknown Neighborhood";
        const censusTract = feature.properties.TRACT || "N/A";
        
        const li = document.createElement("li");
        li.textContent = `${neighborhood} (${censusTract}): $${new Intl.NumberFormat('en-US').format(feature.properties[priceKey])}`;
        list.appendChild(li);
    });
}

// ✅ Listen for Radio Button Changes to Refresh Rankings
document.querySelectorAll('input[name="selector"]').forEach(input => {
    input.addEventListener("change", loadHousingData);
});