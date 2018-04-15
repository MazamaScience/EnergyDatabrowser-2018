d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;
var years = [];
function ready(error, loaded_json)
{
  merged_json = loaded_json;
  plotStackChart("mtoe","EG","oil");

}

function plotStackChart(unit, country, resource)
{
var resource_data = [];
var traceflag = "tozeroy";

    for (data in merged_json[unit][resource])
      {
        
        country_data = merged_json[unit][resource][country];
        //Parsing value from all years
        years = d3.keys(country_data);
       
        production_values = [];
        for(var year in country_data){
            production_values.push(country_data[year]["production"]);
        }
        
        consumption_values = [];

        for(var year in country_data){
            consumption_values.push(country_data[year]["consumption"]);
        }
        
        /*for (data in production_values)
          {console.log(production_values[data])} */

        var trace1 = {
          type: "scatter",
          x: years,
          y: production_values,
          fill: "tonexty",
          
          
          name: "Production",
          mode: "none"
        };
        var trace2 = {
          type: "scatter",
          x: years,
          y: consumption_values,
          fill: "tozeroy",
          
          
          name: "Consumption",
          mode: "none"
        };

        resource_data = [trace1,trace2];
    }


    var layout = {
        title: country +"YPT"+ " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data, layout);
}