// Get the prod / con data 
d3.queue()
	.defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
	.await(ready);

var data_json;
var res_data;

function ready(error, loaded_json) {
	data_json = loaded_json;

	//printFilter('mtoe','2016', 'oil');
}
/*
function printFilter(unit, year, res) {
	var resource_data = []
		console
	
		for ( var country in data_json[unit][res])
		{
			var country_resource = data_json[unit][res][country];

			// Get all years data 
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
			var trace = {
				country: country,
				year: year,
				resource: res,
				val: values
			}

			resource_data.push(trace);
	}

	res_data = resource_data;
	console.log(res_data);

	var i = 0;
	for (i = 0; i < statesData.features.length; i++) {
		var feature = statesData.features[i];
	
	if(feature.properties.name == res_data[i].country) {

		feature.properties['value'] = res_data[i].val[0];
	}
}


	
}
*/

function updateChart(){

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

  // Get units
  var units;
  if (document.getElementById("mtoe").checked) {
  	units = document.getElementById("mtoe").value;
  } else {
  	units = document.getElementById("joule").value
  }

  var cid_sp = document.getElementById("countryID");
  try {
  var countryID_sp = JSON.parse(String(cid_sp.options[cid_sp.selectedIndex].value));

  if (Array.isArray(countryID_sp.value2))
  	forGroup(countryID_sp.value2, countryID_sp.value3, units, '2016', resource)
  else
  	forIndividual(countryID_sp.value1, countryID_sp.value2, units, '2016', resource)
  }

  catch (err) {
  console.log(err)
  var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
 
  }
  var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
  
  


  //if(countryID_sp.val)
  //if(Array.isArray(countryID_sp.value2))
  //	forGroup(countryID_sp.value1, countryID_sp.value2);
  //else if(countryID_sp)
} 

function forGroup(data_countries, geo_countries, unit, year, res){
	console.log("reached here")
	var resource_data = []

	for (var ix = 0; ix < geo_countries.length; ix++) {
		console.log(data_countries[ix])
		if (data_json[unit][res][data_countries[ix]]) {
		var country_resource = data_json[unit][res][data_countries[ix]];
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
		country: geo_countries[ix],
		year: year,
		resource: res,
		val: values
		}

		resource_data.push(trace);

		res_data = resource_data;
	}
	console.log(res_data);

	var i = 0;
	for (var i = 0; i < statesData.features.length; i++) {
		var feature = statesData.features[i];
		feature.properties['value'] = null;
		for (ix = 0; ix < res_data.length; ix++) {
			
			if(feature.id == res_data[ix].country) {

				feature.properties['value'] = res_data[ix].val[0];
				console.log(res_data[ix].val[0])
			}
			
		}

		
	}
	refreshMapLocations()
}

function forIndividual(data_country, geo_country, unit, year, res){

	var resource_data = []
	
	if (data_json[unit][res][data_country]) {

	var country_resource = data_json[unit][res][data_country];

	// Get all years data 
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
		country: geo_country,
		year: year,
		resource: res,
		val: values
	}

	resource_data.push(trace);

	res_data = resource_data;
	console.log(res_data);

	var i = 0;
	for (i = 0; i < statesData.features.length; i++) {
		var feature = statesData.features[i];
		if(feature.id == res_data[0].country) {

			feature.properties['value'] = res_data[0].val[0];
			console.log(res_data[0].val[0])
		}
		else {
			feature.properties['value'] = null;
		}
	}
	refreshMapLocations()


}

function refreshMapLocations() {
	map.removeLayer(geojson);
	geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
	}).addTo(map);
}

function forAll(){

}

$("#first").on("load", function() {
	$("head").append('<script id = "second" type="text/javascript" src="js/geo_map.js"></script>');
})

