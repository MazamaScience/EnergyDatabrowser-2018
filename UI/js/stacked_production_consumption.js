var years = [];
var diffPlotFlag = 0;
var countryID_sp = null;
var country_sp = null;

function toggleDiffChart(unit, country_id, country_text, resource)
{ countryID_sp = country_id;
  country_sp = country_text;
  if(diffPlotFlag == 0)
  { 
    plotStackChart(unit,countryID_sp,country_sp,resource);
    diffPlotFlag++;
  };
  else 
  {
    updateDiffChart();
  };
}

function updateDiffChart()
{   
  var resource;

  if (document.getElementById("coal_m").checked) {
  resource = document.getElementById("coal_m").value;
  }
  else if (document.getElementById("oil_m").checked) {
    resource = document.getElementById("oil_m").value;
  }
  else if (document.getElementById("gas_m").checked) {
    resource = document.getElementById("gas_m").value;
  }
  else if (document.getElementById("nuc_m").checked) {
    resource = document.getElementById("nuc_m").value;
  }
  else {
    resource = document.getElementById("hyd_m").value;
  }

  grayRadio(resource);

  // Get units
  var units;
  if (document.getElementById("mtoe_m").checked) {
    units = document.getElementById("mtoe_m").value;
  } else if (document.getElementById("bbl_m").checked) {
    units = document.getElementById("bbl_m").value;
  } else if (document.getElementById("ft3_m").checked) {
    units = document.getElementById("ft3_m").value;
  } else if (document.getElementById("twh_m").checked) {
    units = document.getElementById("twh_m").value;
  } else if (document.getElementById("m3_m").checked) {
    units = document.getElementById("m3_m").value;
  }
  else {
    units = document.getElementById("joule_m").value
  }

    updateStackChart(unit,countryID_sp,country_sp,resource);
}

function grayRadio(resource){
  var units = unitMap[resource];
  var unit_list = ["bbl","ft3","m3","twh","mtoe","joule"]
  for (var ui = 0; ui < unit_list.length; ui++){
      document.getElementById(unit_list[ui] + '_span_m').style.color = 'gray';
      document.getElementById(unit_list[ui]).disabled = true;
    for (var gi = 0; gi < units.length; gi++) {

      if (units[gi] == unit_list[ui]){
          document.getElementById(unit_list[ui] + '_span_m').style.color = 'black';
        document.getElementById(units[gi]).disabled = false;
      }
    }
  }
}


function plotStackChart(unit, country_id,country_text, resource)
{
var resource_data = [];
var traceflag = "tozeroy";

    for (data in data_json[unit][resource])
      {
        
        country_data = data_json[unit][resource][country_id];
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

    for (data in data_json[unit][resource])
      {
        
        country_data = data_json[unit][resource][country_id];
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