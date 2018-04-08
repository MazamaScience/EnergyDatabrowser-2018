d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;

function ready(error, loaded_json){
    merged_json = loaded_json;
    var cid_sp = document.getElementById("countryID");
  var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
  var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
  plotStackChart('mtoe', countryID_sp, country_sp, 'consumption');
}

function updateChart(){
  var cid_sp = document.getElementById("countryID");
  var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
  var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
  updateStackChart('mtoe', countryID_sp, country_sp, 'consumption');
}

function plotStackChart(unit, country, country_name, resource_pattern)
{
  var stacked_resource_data = [];
  var line_resource_data = [];
  var first = true;
  var cummulative_values = [];
  var resources = ['nuclear', 'coal', 'oil', 'gas', 'hydro'];
  var markers = {
    'nuclear': {'symbol': 18, 'color': 'Gold'},
    'coal': {'symbol': 31, 'color': 'black'},
    'oil': {'symbol': 27, 'color': 'LightGray'},
    'gas': {'symbol': 5, 'color': 'Aqua'},
    'hydro': {'symbol': 28, 'color': 'blue'}
  };

  //The order of resources have to be fixed for stacked area
  for(var i in resources){
      resource = resources[i];
      country_resource = merged_json[unit][resource][country];
      //Parsing value from all years
      years = d3.keys(country_resource);

      //Initializing the cummulative value array
      if(first == true){
        cummulative_values =  new Array(years.length).fill(0);  
        first = false;
      }
      //But we have to display original value
      var values = new Array(years.length).fill(0);
     
      for(var i = 0; i < years.length; i++){
          year = years[i];
          current_value = country_resource[year][resource_pattern];
          cummulative_values[i] = cummulative_values[i] + current_value;
          values[i] = current_value;
      }

      var stacked_trace = {
        type: "scatter",
        mode: "lines",
        name: resource,
        text: values.slice(),
        hoverinfo:'x+text',
        x: years,
        y: cummulative_values.slice(),
        fill: 'tonexty',
        line: {
           color: markers[resource]['color']
        }
      }
      
      var line_trace = {
          type: "scatter",
          mode: "markers",
          name: resource,
          x: years,
          y: values,
          marker: {
           color: markers[resource]['color'],
           symbol: markers[resource]['symbol']
          },
          hoverinfo: 'none'
        }
     
      stacked_resource_data.push(stacked_trace);
      line_resource_data.push(line_trace);
  }
  
  var layout = {
      title: country_name+' energy resource consumption for all years', 
  };
  Plotly.newPlot('stackChart', stacked_resource_data, layout);
  Plotly.newPlot('consumptionChart', line_resource_data, layout);
}


function updateStackChart(unit, country, country_name, resource_pattern)
{
  var stacked_resource_data = [];
  var line_resource_data = [];
  var first = true;
  var cummulative_values = [];
  var resources = ['nuclear', 'coal', 'oil', 'gas', 'hydro'];
  var markers = {
    'nuclear': {'symbol': 18, 'color': 'Gold'},
    'coal': {'symbol': 31, 'color': 'black'},
    'oil': {'symbol': 27, 'color': 'LightGray'},
    'gas': {'symbol': 5, 'color': 'Aqua'},
    'hydro': {'symbol': 28, 'color': 'blue'}
  };

  //The order of resources have to be fixed for stacked area
  for(var i in resources){
      resource = resources[i];
      country_resource = merged_json[unit][resource][country];
      //Parsing value from all years
      years = d3.keys(country_resource);

      //Initializing the cummulative value array
      if(first == true){
        cummulative_values =  new Array(years.length).fill(0);  
        first = false;
      }
      //But we have to display original value
      var values = new Array(years.length).fill(0);
     
      for(var i = 0; i < years.length; i++){
          year = years[i];
          current_value = country_resource[year][resource_pattern];
          cummulative_values[i] = cummulative_values[i] + current_value;
          values[i] = current_value;
      }

      stacked_resource_data.push(cummulative_values.slice());
      line_resource_data.push(values);

      var stacked_trace = {

        y: stacked_resource_data,
      }
      
      var line_trace = {
          y: line_resource_data,
        }
     
      
  }
  
  var layout = {
      title: country_name+' energy resource consumption for all years', 
  };
  Plotly.update('stackChart', stacked_trace, layout);
  Plotly.update('consumptionChart', line_trace, layout);
}