mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);