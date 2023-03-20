mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 11 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<b>${campground.title}</b> <p>${campground.location}</p>`
))
.addTo(map);

//console.log(campground.geometry.coordinates)