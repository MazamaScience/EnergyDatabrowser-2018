/*
** Geo_map js is used to create the map using world geojson 
** We also use this file to call the remaining visualization plots
** This is done in the onClick function
** The GeoJSON is received from map_data js file
** Author : Abhinav Garg 
*/


// Creating the leaflet map and configuring it 
var map = L.map('map','100%','100%').setView([35.8, -36], 1);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', { maxZoom: 18, minZoom: 1.5, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>', id: 'mapbox.light', zoomSnap: 0.125, noWrap: true}).addTo(map);


// Control that shows state info on hover
var info = L.control();

// Create's a new info div on add
info.onAdd = function (map) {

	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;

};

// Update's the values in the information card
info.update = function (props) {

	this._div.innerHTML = '<h4>Net Consumption </h4>' +  (props ?
		'<b>' + props.name + '</b><br />' + props.value + ' ' + props.unit
		: 'Hover over a country');

};

info.addTo(map);


// Get color value based on Net Production - Consumption
function getColor(d) {

	if (d == null) return '#808080';
	else if (d > 0) return 'green';
	else if (d < 0) return 'red'

}

// Styling for each feature
function style(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: '#ddd',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.value)
	};
}

// Highlighting each feature
function highlightFeature(e) {

	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);

}

function resetHighlight(e) {

	geojson.resetStyle(e.target);
	info.update();

}

// Map zooming feature
function zoomToFeature(e) {

	console.log(e.target.feature.properties.name)
	console.log(e.target.feature.properties.mzm_id)

	// This calls the function in the other two visualizaitons. The Mazama country code is passed 
	// along with the name 
	toggleAllEnergyPlots(e.target.feature.properties.mzm_id,e.target.feature.properties.name)
	map.fitBounds(e.target.getBounds());

}

// Mapping DOM events to our functions
function onEachFeature(feature, layer) {

	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});

}

// Creating the GeoJSON layer 
geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);



map.attributionControl.addAttribution('Energy data &copy;');

// Creating the Legend for the Map 
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;

};

legend.addTo(map);

