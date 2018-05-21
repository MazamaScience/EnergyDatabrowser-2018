/*
** Geo_map js is used to create the map using world geojson 
** We also use this file to call the remaining visualization plots
** This is done in the onClick function
** The GeoJSON is received from map_data js file
** Author : Abhinav Garg 
*/
// NEW PART FOR SMOOTH SCROLLING - AVANTI
//For Smooth Scrolling

window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}
// END

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

function getDiffResource() {

	var resource;

	if (document.getElementById("coal").checked) {

  resource = document.getElementById("coal").value;

  }
  else if (document.getElementById("oil").checked) {

  	resource = document.getElementById("oil").value;

  }
  else if (document.getElementById("gas").checked) {

  	resource = document.getElementById("gas").value;

  }
  else if (document.getElementById("nuc").checked) {

  	resource = document.getElementById("nuc").value;

  }
  else {

  	resource = document.getElementById("hyd").value;

  }

  return resource;
}

//Get the units 
function getDiffUnits() {
	var units;
	if (document.getElementById("mtoe").checked) {

  	units = document.getElementById("mtoe").value;

  } else if (document.getElementById("bbl").checked) {

  	units = document.getElementById("bbl").value;

  } else if (document.getElementById("ft3").checked) {

  	units = document.getElementById("ft3").value;

  } else if (document.getElementById("twh").checked) {

  	units = document.getElementById("twh").value;

  } else if (document.getElementById("m3").checked) {

  	units = document.getElementById("m3").value;

  }
  else {

  	units = document.getElementById("joule").value

  }
  return units;
}


function go_on_stacked_energyplots(e) {

	var units_m = getDiffUnits();
	var resource_m = getDiffResource();

	toggleDiffChart(units_m	, e.target.feature.properties.mzm_id, e.target.feature.properties.name, resource_m);
	// window.location.href="#aside"
	smoothScroll(document.getElementById('aside2'))
	toggleAllEnergyPlots(e.target.feature.properties.mzm_id,e.target.feature.properties.name)
	country_stories()

}


// Mapping DOM events to our functions
function onEachFeature(feature, layer) {

	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: go_on_stacked_energyplots
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

