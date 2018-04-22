d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;

function ready(error, loaded_json){
    merged_json = loaded_json;
    var cid_sp = document.getElementById("countryID");
	var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
	var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    plotPatternData('mtoe', countryID_sp, country_sp, 'consumption');
}

function updateScatter(){
	var cid_sp = document.getElementById("countryID");
	var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
	var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
	updatePatternData('mtoe', countryID_sp, country_sp, 'consumption');
}


function plotPatternData(unit, country, country_name, resource_pattern){
    /*Aim is to get timeseries data for a given country, unit for all resources for all years*/

    var resource_data = [];

    for (var resource in merged_json[unit]){
        country_resource = merged_json[unit][resource][country];
        //Parsing value from all years
        years = d3.keys(country_resource);
        values = [];
        for(var year in country_resource){
            values.push(country_resource[year][resource_pattern]);
        }

        var trace = {
          type: "scatter",
          mode: "lines",
          name: resource,
          x: years,
          y: values,
          hoverinfo: 'none'
        }

        resource_data.push(trace);
    }
    
    var layout = {
        title: country_name+' energy resource consumption for all years', 
    };
    	Plotly.newPlot('consumptionChart', resource_data, layout);
}


function updatePatternData(unit, country, country_name, resource_pattern){
    /*Aim is to get timeseries data for a given country, unit for all resources for all years*/

    var resource_data = [];
    for (var resource in merged_json[unit]){
        country_resource = merged_json[unit][resource][country];
        //Parsing value from all years
        years = d3.keys(country_resource);
        
        values = [];
        for(var year in country_resource){
            values.push(country_resource[year][resource_pattern]);
        }
        resource_data.push(values)

        var trace = {
          y: resource_data
        }
    }
    
    var layout = {
        title: country_name+' energy resource consumption for all years', 
    };
    	Plotly.update('consumptionChart', trace, layout);
}