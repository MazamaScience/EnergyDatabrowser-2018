d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;
var years = [];
function ready(error, loaded_json)
{
	merged_json = loaded_json;
	plotStackChart("mtoe","CN","coal");

}

function plotStackChart(unit, country, resource)
{
var resource_data = [];


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
        

        var trace0 = {
          type: "scatter",
          x: years,
          y: production_values,
          fill: "tozeroy",
          fillcolor: '#98fb98',
          name: "Production"
        }
        var trace1 = {
          type: "scatter",
          x: years,
          y: consumption_values,
          fill: "tonexty",
          fillcolor:'#ff5f5f' ,
          name: "Consumption"
        }

        resource_data = [trace0,trace1];
    }


    var layout = {
        title: country + " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data, layout);
}

/*function toggleTooltip_pc(){

    var toggle = document.querySelector('input[name = "toggle"]:checked').value;

    if(toggle=="off"){
    var trace0 = {
        hoverinfo:'none'
        }
      
      var trace1 = {
          hoverinfo: 'none'
        }
      }
    else{
          var trace0 = {
        hoverinfo:'x+text'
        }
      
      var trace1 = {
          hoverinfo: ''
        }
      }

    Plotly.restyle('stackChart', stacked_trace);
    Plotly.restyle('consumptionChart', line_trace);
  }

  */