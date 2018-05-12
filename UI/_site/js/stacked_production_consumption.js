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
  var unit = document.querySelector('input[name = "units"]:checked').value;
  var resource = document.querySelector('input[name = "resource"]:checked').value;
  plotStackChart(unit,countryID_sp,country_sp,resource);

}

function updateDiffChart()
{
    var cid_sp = document.getElementById("countryID");
    var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    var unit = document.querySelector('input[name = "units"]:checked').value;
    var resource = document.querySelector('input[name = "resource"]:checked').value;
    updateStackChart(unit,countryID_sp,country_sp,resource);

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
        for(i in production_values)
        { if(isNaN(production_values[i]))
          {production_values[i]=0}
        }

        consumption_values = [];
        
        for(var year in country_data){
            consumption_values.push(country_data[year]["consumption"]);
        }
        for(i in consumption_values)
        { if(isNaN(consumption_values[i]))
          {consumption_values[i]=0}
        }
        
        imp_exp = [];
        imp = [];
        exp = [];
          for (i in production_values)
          {
            imp_exp.push(production_values[i]-consumption_values[i])
          }
        /*for (data in production_values)
          {console.log(production_values[data])} */


          for (i in years) {

            if (imp_exp[i] > 0) {
              exp[i] = imp_exp[i];
              imp[i] = 0;
            }
            else if (imp_exp[i] < 0) {
              imp[i] = imp_exp[i];
              exp[i] = 0;
            }  

            else {
              imp[i] = 0;
              exp[i] = 0;
            }
          }
          

        var trace1 = {
          type: "scatter",
          x: years,
          y: production_values,
          fill: "tozeroy",
          name: "Production",
          mode: "none"
        };
        var trace2 = {
          type: "scatter",
          x: years,
          y: consumption_values,
          name: "Consumption",
          
        };

        var trace3 = {
          type: "scatter",
          x: years,
          y: exp,
          fill: "tozeroy",
          name: "Export",
          
        };

        var trace4 = {
          type: "scatter",
          x: years,
          y: imp,
          fill: "tozeroy",
          name: "Import",
          
        }
        resource_data = [trace1,trace2,trace3,trace4];
    }


    var layout = {
        title: country_text + " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data, layout, {displaylogo: false});
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
        for(i in production_values)
        { if(isNaN(production_values[i]))
          {production_values[i]=0}
        }
        consumption_values = [];
        
        for(var year in country_data){
            consumption_values.push(country_data[year]["consumption"]);
        }
        for(i in consumption_values)
        { if(isNaN(consumption_values[i]))
          {consumption_values[i]=0}
        }
        /*for (data in production_values)
          {console.log(production_values[data])} */

          imp_exp = []
          imp = [];
          exp = [];
          for (i in production_values)
          {
            imp_exp.push(production_values[i]-consumption_values[i])
          }

          for (i in years) {

            if (imp_exp[i] > 0) {
              exp[i] = imp_exp[i];
              imp[i] = 0;
            }
            else if (imp_exp[i] < 0) {
              imp[i] = imp_exp[i];
              exp[i] = 0;
            }  

            else {
              imp[i] = 0;
              exp[i] = 0;
            }
          }

        var trace1 = {
          type: "scatter",
          x: years,
          y: production_values,
          fill: "tozeroy",
          
          
          name: "Production",
          mode: "none"
        };
        var trace2 = {
          type: "scatter",
          x: years,
          y: consumption_values,
          
          
          name: "Consumption",
          
        };
        
       var trace3 = {
          type: "scatter",
          x: years,
          y: exp,
          fill: "tozeroy",
          name: "Export",
          
        };

        var trace4 = {
          type: "scatter",
          x: years,
          y: imp,
          fill: "tozeroy",
          name: "Import",
          
        }
        resource_data = [trace1,trace2,trace3,trace4];
    }


    var layout = {
        title: country_text + " " + resource + ' trends for ' + years[0] + ' - ' + years[years.length - 1 ]
    };
    Plotly.newPlot('stackChart_production_consumption', resource_data, layout, {displaylogo: false});
}