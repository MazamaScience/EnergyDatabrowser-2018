d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;

function ready(error, loaded_json){
    merged_json = loaded_json;
    plotPatternData('mtoe', 'IN', 'consumption')
}


function plotPatternData(unit, country, resource_pattern){
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
          y: values
        }

        resource_data.push(trace);
    }
    
    var layout = {
        title: 'India energy resource consumption for all years', 
    };
    Plotly.newPlot('consumptionChart', resource_data, layout);
}