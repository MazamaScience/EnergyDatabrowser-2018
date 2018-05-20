/*
** map_data js is used to enter values from our production and consumption data 
** We enter the value into statesData which is loaded from countries js
** The updated GeoJSON is then provided to geo_map js to plot 
** Author : Abhinav Garg 
*/

// Queue the combined data and pass it to ready function
d3.queue()
	.defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
	.await(ready);

// Global variables
var data_json;
var res_data;
var unit_json;

// Variable to create the GeoJSON layer
var geojson = null;

// Once the data gets queue, it's passed to this function which calls loadMap. One time load 
function ready(error, loaded_json) {

	data_json = loaded_json;
	console.log(data_json);
	document.getElementById("oil").checked = true;
	document.getElementById("mtoe").checked = true;
	grayOut("oil");
	loadMap('mtoe','2016','oil');

}

// Load resource data for all countries. Default : oil
function loadMap(unit, year, res) {

	var resource_data = []

	for (var ix = 0; ix < mapping_json.length; ix++) {
		
		if (data_json[unit][res][mapping_json[ix]['value1']]) {

			var country_resource = data_json[unit][res][mapping_json[ix]['value1']];

			values = [];

			if (country_resource[year]['production'] == country_resource[year]['consumption']) {

				values.push(country_resource[year]['production']);

			} else if (country_resource[year]['production'] == null && country_resource[year]['consumption'] == null) {

				values.push(0);

			} else if (country_resource[year]['production'] == null && country_resource[year]['consumption'] != null) {

				values.push(0 - country_resource[year]['consumption']);

			} else if (country_resource[year]['production'] != null && country_resource[year]['consumption'] == null) {

				values.push(country_resource[year]['production']); 

			} else {

				values.push(country_resource[year]['production'] - country_resource[year]['consumption']);

			}

		} else {
			values = [];
			values.push(null);
		}

		var trace = {
		mzm_country: mapping_json[ix]['value1'],
		country: mapping_json[ix]['value2'],
		year: year,
		resource: res,
		val: values
		}

		resource_data.push(trace);

		res_data = resource_data;
	}


	for (var i = 0; i < statesData.features.length; i++) {

		var feature = statesData.features[i];

		feature.properties['value'] = null;

		for (ix = 0; ix < res_data.length; ix++) {
			
			if (feature.id == res_data[ix].country) {

				feature.properties['value'] = res_data[ix].val[0];
				feature.properties['unit'] = unit;
				feature.properties['mzm_id'] = res_data[ix].mzm_country;

			}
			
			
		}

	}

	refreshMapLocations()

}

// Update the map based on the resource and units selected on radio buttons
function updateMap() {

  // Get the resource 
  var resource = getResource();

  // Gray out the units that aren't valid for the resource in consideration
  grayOut(resource);

  // Get units
  var units = getUnits();

  // ReloadMap based on new information
  loadMap(units, '2016', resource);

} 

// Get the resource
function getResource() {

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
function getUnits() {
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

// Removes the previous GeoJSON layer and adds the updated one 
function refreshMapLocations() {
	if (geojson) {

		map.removeLayer(geojson);
		geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
		}).addTo(map);

	}

}

// Grays out units that aren't present for a particular resource
function grayOut(resource){

	var units = unitMap[resource];

	var unit_list = ["bbl","ft3","m3","twh","mtoe"]

	for (var ui = 0; ui < unit_list.length; ui++) {

		document.getElementById(unit_list[ui] + '_span').style.color = 'gray';

		document.getElementById(unit_list[ui]).disabled = true;

		for (var gi = 0; gi < units.length; gi++) {

			if (units[gi] == unit_list[ui]) {

			    document.getElementById(unit_list[ui] + '_span').style.color = 'black';

				document.getElementById(units[gi]).disabled = false;

			}

		}

	}

}

// Performs update on Geojson first and then calls geo_map js to plot. This ordering is important.
$("#first").on("load", function() {

	$("head").append('<script id = "second" type="text/javascript" src="js/geo_map.js"></script>');

})

