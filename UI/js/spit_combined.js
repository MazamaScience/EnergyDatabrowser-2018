// Get the prod / con data 
d3.queue()
	.defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
	.await(ready);

var data_json;
var res_data;
var unit_json;

function ready(error, loaded_json) {
	data_json = loaded_json;
	console.log(unitMap)
	document.getElementById("oil").checked = true;
	document.getElementById("mtoe").checked = true;
	grayOut("oil");
	loadMap('mtoe','2016','oil');


}

// This function loads oil data for all the countries 

function loadMap(unit, year, res) {
	var resource_data = []

	for (var ix = 0; ix < mapping_json.length; ix++) {
		
		if (data_json[unit][res][mapping_json[ix]['value1']]) {
		var country_resource = data_json[unit][res][mapping_json[ix]['value1']];
		values = [];
		if ( country_resource[year]['production'] == null && country_resource[year]['consumption'] == null) { values.push(
		0
		); }
		else if (country_resource[year]['production'] == null && country_resource[year]['consumption'] != null) {values.push(
			0 - country_resource[year]['consumption']
			); }
		else if (country_resource[year]['production'] != null && country_resource[year]['consumption'] == null)
			{ values.push(
			 country_resource[year]['production']
			); }
		else {
		values.push(
			country_resource[year]['production'] - country_resource[year]['consumption']
			);
		}
		}
		else {
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


	var i = 0;
	for (var i = 0; i < statesData.features.length; i++) {
		var feature = statesData.features[i];
		feature.properties['value'] = null;
		for (ix = 0; ix < res_data.length; ix++) {
			
			if(feature.id == res_data[ix].country) {

				feature.properties['value'] = res_data[ix].val[0];
				feature.properties['unit'] = unit;
				feature.properties['mzm_id'] = res_data[ix].mzm_country;
			}
			
			
		}

		
	}
	refreshMapLocations()
}


function updateMap(){

  // Get the resource 
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

  grayOut(resource);

  // Get units
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

  // ReloadMap based on new information
  loadMap(units, '2016', resource);

} 

function refreshMapLocations() {
	map.removeLayer(geojson);
	geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
	}).addTo(map);
}

function grayOut(resource){
	var units = unitMap[resource];
	var unit_list = ["bbl","ft3","m3","twh","mtoe","joule"]
	for (var ui = 0; ui < unit_list.length; ui++){
			document.getElementById(unit_list[ui] + '_span').style.color = 'gray';
			document.getElementById(unit_list[ui]).disabled = true;
		for (var gi = 0; gi < units.length; gi++) {

			if (units[gi] == unit_list[ui]){
			    document.getElementById(unit_list[ui] + '_span').style.color = 'black';
				document.getElementById(units[gi]).disabled = false;
			}
		}
	}
}

$("#first").on("load", function() {
	$("head").append('<script id = "second" type="text/javascript" src="js/geo_map.js"></script>');
})

