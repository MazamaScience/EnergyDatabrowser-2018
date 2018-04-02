d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;

function ready(error, loaded_json)
{
	merged_json = loaded_json;
	plotStackChart("mtoe","US","consumption");

}

function plotStackChart(unit, country, resource_pattern)
{
var resource_data = [];
var traceflag = 'tozeroy'
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
          fill: traceflag
        }

        resource_data.push(trace);
        traceflag='tonexty';
    }
    
    var layout = {
        title: 'India energy resource consumption for all years', 
    };
    Plotly.newPlot('stackChart', resource_data, layout);
}