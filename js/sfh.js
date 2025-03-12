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

let tracts = []; // Store loaded GeoJSON data

const neighborhoodGroups = {
    "North Seattle": [
        "Ballard",
        "Broadview/Bitter Lake",
        "Cedar Park/Meadowbrook",
        "Fremont",
        "Green Lake",
        "Greenwood/Phinney Ridge",
        "Haller Lake",
        "Laurelhurst/Sand Point",
        "Licton Springs",
        "North Beach/Blue Ridge",
        "Northgate/Maple Leaf",
        "Olympic Hills/Victory Heights",
        "Ravenna/Bryant",
        "Sunset Hill/Loyal Heights",
        "University District",
        "Wallingford",
        "Wedgwood/View Ridge",
        "Whittier Heights"
    ],
    "Central Seattle": [

        "Belltown",
        "Capitol Hill",
        "Cascade/Eastlake",
        "Central Area/Squire Park",
        "Downtown Commercial Core",
        "First Hill",
        "Interbay",
        "Judkins Park",
        "Madison Park",
        "Madrona/Leschi",
        "Magnolia",
        "Miller Park",
        "Montlake/Portage Bay",
        "North Capitol Hill",
        "Pioneer Square/International District",
        "Queen Anne"
    ],
    "West Seattle": [
        "Alki/Admiral",
        "Arbor Heights",
        "Fauntleroy/Seaview",
        "High Point",
        "Highland Park",
        "North Delridge",
        "Riverview",
        "Roxhill/Westwood",
        "South Park",
        "West Seattle Junction/Genesee Hill"
    ],
    "South Seattle": [
        "Beacon Hill",
        "Columbia City",
        "Duwamish/SODO",
        "Georgetown",
        "Mt. Baker/North Rainier",
        "North Beacon Hill/Jefferson Park",
        "Rainier Beach",
        "Seward Park",
        "South Beacon Hill/NewHolly"
    ]
};

// ✅ Assign a single color per region
const regionColors = {
    "North Seattle": "#e6194b",
    "Central Seattle": "#3cb44b",
    "South Seattle": "#4363d8",
    "West Seattle": "#f58231"
};

// ✅ Function to Assign Colors to Neighborhoods by Region
function getNeighborhoodColor(name) {
    for (const [region, neighborhoods] of Object.entries(neighborhoodGroups)) {
        if (neighborhoods.includes(name)) {
            return regionColors[region]; // ✅ Assign region color
        }
    }
    return "#cccccc"; // Default gray for ungrouped neighborhoods
}

// ✅ Load Census Tract GeoJSON
async function loadTracts() {
    try {
        console.log("🔍 Fetching GeoJSON...");
        const response = await fetch('assets/singlefamily2023.geojson');
        const geojsonData = await response.json();

        console.log("✅ GeoJSON Loaded:", geojsonData);
        tracts = geojsonData.features;

        // ✅ Add Source for Census Tracts
        if (!map.getSource('tracts')) {
            map.addSource('tracts', {
                type: 'geojson',
                data: geojsonData
            });
        }

        // ✅ Remove Existing Layers if Present
        if (map.getLayer('tract-layer')) map.removeLayer('tract-layer');
        if (map.getLayer('tract-hover')) map.removeLayer('tract-hover');
        if (map.getLayer('tract-selected')) map.removeLayer('tract-selected');

        // ✅ Apply Colors Based on Region
        const colorExpression = ['case'];
        geojsonData.features.forEach(feature => {
            const name = feature.properties.CRA_NAME || "Unknown";
            colorExpression.push(['==', ['get', 'CRA_NAME'], name], getNeighborhoodColor(name));
        });
        colorExpression.push('#cccccc'); // Default color

        // ✅ Add Census Tracts Layer
        map.addLayer({
            id: 'tract-layer',
            type: 'fill',
            source: 'tracts',
            paint: {
                'fill-color': colorExpression,
                'fill-opacity': 0.6,
                'fill-outline-color': '#000'
            }
        }, 'poi-label');

        // ✅ Add Hover Effect Layer (White)
        map.addLayer({
            id: 'tract-hover',
            type: 'fill',
            source: 'tracts',
            paint: {
                'fill-color': '#FFFFFF',
                'fill-opacity': 0.7
            },
            filter: ['==', 'CRA_NAME', '']
        }, 'poi-label');

        // ✅ Add Selection Effect Layer (Yellow)
        map.addLayer({
            id: 'tract-selected',
            type: 'fill',
            source: 'tracts',
            paint: {
                'fill-color': '#FFD700',  // Gold/Yellow for selected neighborhoods
                'fill-opacity': 0.6
            },
            filter: ['==', 'CRA_NAME', '']
        }, 'poi-label');

        enableTractClick();
        enableTractHover();
        populateSidebar(geojsonData.features); // ✅ Populate Sidebar with Grouped Neighborhoods
    } catch (error) {
        console.error('❌ Error loading GeoJSON:', error);
    }
}

// ✅ Populate Sidebar and Add Click Event
function populateSidebar(features) {
    console.log("🔄 Populating Sidebar with Regions...");

    const listContainer = document.getElementById('tractList');
    listContainer.innerHTML = '';

    Object.entries(neighborhoodGroups).forEach(([region, neighborhoods]) => {
        const regionHeader = document.createElement('div');
        regionHeader.className = 'region-header';
        regionHeader.textContent = region;
        listContainer.appendChild(regionHeader);

        neighborhoods.forEach(name => {
            const feature = features.find(f => f.properties.CRA_NAME === name);
            if (!feature) return;

            const color = getNeighborhoodColor(name);
            const div = document.createElement('div');
            div.className = 'legend-item';
            div.innerHTML = `<span class="legend-color" style="background-color: ${color};"></span> ${name}`;

            div.addEventListener('click', () => {
                console.log(`🔍 Highlighting tracts for: ${name}`);

                // ✅ Apply Yellow Highlight to Selected Neighborhood
                map.setFilter('tract-selected', ['==', ['get', 'CRA_NAME'], name]);

                // ✅ Zoom to Neighborhood
                const neighborhoodTracts = features.filter(f => f.properties.CRA_NAME === name);
                if (neighborhoodTracts.length > 0) {
                    const coordinates = neighborhoodTracts.flatMap(f => f.geometry.coordinates[0]);
                    const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
                    map.fitBounds(bounds, { padding: 50 });
                }
            });

            listContainer.appendChild(div);
        });
    });

    console.log("✅ Sidebar Updated with Grouped Neighborhoods!");
}

// ✅ Reset View Function
function resetMapView() {
    map.flyTo({ center: SEATTLE_CENTER, zoom: DEFAULT_ZOOM, essential: true });
    map.setFilter('tract-selected', ['==', 'CRA_NAME', '']); // Reset selection
}

document.getElementById("resetView").addEventListener("click", resetMapView);

// ✅ Enable Clicking on Census Tracts
function enableTractClick() {
    map.on('click', 'tract-layer', (e) => {
        const tractData = e.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h4>${tractData.CRA_NAME}</h4>
                <p><strong>Tract:</strong> ${tractData.TRACT}</p>
                <p><strong>Price Per SqFt:</strong> $${tractData.PRICE_SQFT || "N/A"}</p>
                <p><strong>Median Price:</strong> $${tractData.PRICE_NOM || "N/A"}</p>
            `)
            .addTo(map);
    });
}

// ✅ Enable Hover Effect for Individual Census Tracts
function enableTractHover() {
    map.on('mousemove', 'tract-layer', (e) => {
        if (e.features.length > 0) {
            map.setFilter('tract-hover', ['==', ['get', 'TRACT'], e.features[0].properties.TRACT]);
        }
    });
    map.on('mouseleave', 'tract-layer', () => {
        map.setFilter('tract-hover', ['==', ['get', 'TRACT'], '']);
    });
}

// ✅ Reset Selection When Clicking Outside
map.on('click', () => {
    map.setFilter('tract-selected', ['==', 'CRA_NAME', '']);
});



// ✅ Initialize
map.on('load', () => { loadTracts(); });

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split('/').pop(); // Get the current page filename
    const menuItems = document.querySelectorAll("#menu-dropdown a");

    menuItems.forEach(item => {
        if (item.getAttribute("href") === currentPage) {
            item.classList.add("active"); // ✅ Add "active" class for shading
        }
    });
});


let userLocation = null;
let userMarker = null;

// ✅ Hardcoded Locations for Known Places
const knownLocations = {
    "university of washington": [-122.3035, 47.6553], // Exact coordinates for UW Seattle
};

// ✅ Function to Geocode Address & Restrict Search to Washington
async function geocodeAddress(address) {
    const normalizedAddress = address.toLowerCase().trim();

    // ✅ Check if Address is in Known Locations
    if (knownLocations[normalizedAddress]) {
        userLocation = knownLocations[normalizedAddress];
        updateMap(userLocation, "University of Washington, Seattle, WA");
        return;
    }

    // ✅ Bounding Box for Washington State (SW & NE corners)
    const bbox = "-124.848974,45.543541,-116.916073,49.002494";

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?bbox=${bbox}&types=place,address&access_token=${mapboxgl.accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features.length === 0) {
            alert("Address not found in Washington. Please try again.");
            return;
        }

        // ✅ Use First (Most Relevant) Result
        userLocation = data.features[0].geometry.coordinates;
        updateMap(userLocation, data.features[0].place_name);
    } catch (error) {
        console.error("❌ Geocoding error:", error);
        alert("Error fetching location. Try again later.");
    }
}

// ✅ Function to Update Map with a New Marker
function updateMap(coords, placeName) {
    // ✅ Remove previous marker if it exists
    if (userMarker) userMarker.remove();

    // ✅ Place a New Marker at the Found Location
    userMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coords)
        .addTo(map);

    // ✅ Zoom to the Location
    map.flyTo({ center: coords, zoom: 13 });

    console.log(`📍 Location set at: ${placeName} - ${coords}`);
}

// ✅ Handle Click Event for "Find Location" Button
document.getElementById("findLocation").addEventListener("click", () => {
    const address = document.getElementById("addressInput").value;
    if (address) {
        geocodeAddress(address);
    } else {
        alert("Please enter an address.");
    }
});
