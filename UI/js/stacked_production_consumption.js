d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;
var years = [];
function ready(error, loaded_json)
{
  merged_json = loaded_json;
  var cid_sp = document.getElementById("countryID");
    var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
  plotStackChart("mtoe",countryID_sp,country_sp,"oil");

}

function updateDiffChart()
{
    var cid_sp = document.getElementById("countryID");
    var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    updateStackChart("mtoe",countryID_sp,country_sp,"oil");

}

function plotStackChart(unit, country_id,country_text, resource)
{
var resource_data = [];
var traceflag = "tozeroy";

    for (data in merged_json[unit][resource])
      {
        
        country_data = merged_json[unit][resource][country_id];
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

        var trace3 = {
          type: "scatter",
          x: years,
          y: [100,200,300,400],
          
          
          name: "Export"
          
        };

        var trace4 = {
          type: "scatter",
          x: years,
          y: [-100,-200,-300,-400],
          
      
          name: "Import"

        };
        resource_data = [trace1,trace2,trace3,trace4];
    }


    var layout = {
        title: country_text + " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data,);
}

function updateStackChart(unit, country_id,country_text, resource)
{
var resource_data = [];
var traceflag = "tozeroy";

    for (data in merged_json[unit][resource])
      {
        
        country_data = merged_json[unit][resource][country_id];
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
        
        var trace3 = {
          type: "scatter",
          x: years,
          y: [100,200,300,400],
          
          
          name: "Export"
          
        };

        var trace4 = {
          type: "scatter",
          x: years,
          y: [-100,-200,-300,-400],
          
      
          name: "Import"

        };
        resource_data = [trace1,trace2,trace3,trace4];
    }


    var layout = {
        title: country_text + " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data, layout);
}