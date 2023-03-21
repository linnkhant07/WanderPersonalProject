mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
container: 'mini-map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
center: landmark.geometry.coordinates, // starting position [lng, lat]
zoom: 11 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
.setLngLat(landmark.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<b>${landmark.title}</b> <p>${landmark.location}</p>`
))
.addTo(map);
map.addControl(new mapboxgl.NavigationControl());

//console.log(landmark.geometry.coordinates)