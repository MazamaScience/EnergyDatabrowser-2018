d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(resourceChart);

var merged_json;
//Specific colors and symbols for all resources
var markers = {
    'nuclear': {
        'symbol': 18,
        'color': 'Gold'
    },
    'coal': {
        'symbol': 31,
        'color': 'black'
    },
    'oil': {
        'symbol': 27,
        'color': 'LightGray'
    },
    'gas': {
        'symbol': 5,
        'color': 'Aqua'
    },
    'hydro': {
        'symbol': 28,
        'color': 'blue'
    }
};

//Divide two arrays
function divideArray(A, B){
  return(A.map(function(n, i) { return n / B[i]; }));
}

//Multiply Array
function multiplyConstant(A, constant){
  //Return upto four decimal digits
  return(A.map(function(element) {return (element * constant).toFixed(4);}));
}

//Given two array of traces, normalize each chart
function normalizeResources(stacked_resource_data, line_resource_data, cummulative_values, update){
  for(resource in stacked_resource_data){

    if(update == false){
      stacked_value = stacked_resource_data[resource].y;
      resource_value = line_resource_data[resource].y;
    }
    else{
      stacked_value = stacked_resource_data[resource];
      resource_value = line_resource_data[resource];
    }
    
    normalized_stacked_value = divideArray(stacked_value, cummulative_values);
    //Getting percentage of stacked values
    normalized_stacked_value = multiplyConstant(normalized_stacked_value, 100)
    
    //Getting percentage of individual resource value
    normalized_resource_value = divideArray(resource_value, cummulative_values);
    normalized_resource_value = multiplyConstant(normalized_resource_value, 100);
  
    if(update == false){
      //Saving the normalized array back
      stacked_resource_data[resource].y = normalized_stacked_value;
      //Because the individual percentage should be shown
      stacked_resource_data[resource].text = normalized_resource_value;
      line_resource_data[resource].y = normalized_resource_value;
    }
    else{
      stacked_resource_data[resource] = normalized_stacked_value;
      line_resource_data[resource] = normalized_resource_value;
    }
  }

  return [stacked_resource_data, line_resource_data];
}

//Function to create a new plot, which shows all resources
function resourceChart(error, loaded_json) {
    merged_json = loaded_json;
    var cid_sp = document.getElementById("countryID");
    var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    plotResourceCharts('mtoe', countryID_sp, country_sp, 'consumption', true);
}

//Update the chart as the radio button changes
function updateChart() {
    var cid_sp = document.getElementById("countryID");
    var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    updateResourceCharts('mtoe', countryID_sp, country_sp, 'consumption', true);
}

//Plotting all resources
function plotResourceCharts(unit, country, country_name, resource_pattern, percentage) {
    //This array would have cummulative values of all resource traces
    var stacked_resource_data = [];
    //This array would have individual resource traces
    var line_resource_data = [];
    //First resource would help populate all years
    var first = true;
    var cummulative_values = [];
    //All resources required to plot
    var resources = ['nuclear', 'coal', 'oil', 'gas', 'hydro'];

    //The order of resources have to be fixed for stacked area
    for (var i in resources) {
        resource = resources[i];
        country_resource = merged_json[unit][resource][country];
        //Parsing value from all years
        years = d3.keys(country_resource);

        //Initializing the cummulative value array
        if (first == true) {
            cummulative_values = new Array(years.length).fill(0);
            first = false;
        }
        //But we have to display original value
        var values = new Array(years.length).fill(0);

        for (var i = 0; i < years.length; i++) {
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
            hoverinfo: 'x+name+text',
            x: years,
            y: multiplyConstant(cummulative_values.slice(), 1),
            fill: 'tonexty',
            line: {
                color: markers[resource]['color']
            }
        }

        var line_trace = {
            type: "scatter",
            mode: "markers",
            name: resource,
            hoverinfo: 'all',
            x: years,
            y: multiplyConstant(values, 1),
            marker: {
                color: markers[resource]['color'],
                symbol: markers[resource]['symbol']
            },
        }

        stacked_resource_data.push(stacked_trace);
        line_resource_data.push(line_trace);
    }

    var layout = {
        title: country_name + ' energy resource consumption for all years',
    };

    if(percentage == true){
      normalized_values = normalizeResources(stacked_resource_data, 
                                                  line_resource_data, cummulative_values, false);
      stacked_resource_data = normalized_values[0];
      line_resource_data = normalized_values[1];

    }

    Plotly.newPlot('stackChart', stacked_resource_data, layout);
    Plotly.newPlot('consumptionChart', line_resource_data, layout);  
    
}


//Updating as the buttons change
function updateResourceCharts(unit, country, country_name, resource_pattern, percentage) {
    var stacked_resource_data = [];
    var line_resource_data = [];
    var first = true;
    var cummulative_values = [];
    var resources = ['nuclear', 'coal', 'oil', 'gas', 'hydro'];

    //The order of resources have to be fixed for stacked area
    for (var i in resources) {
        resource = resources[i];
        country_resource = merged_json[unit][resource][country];
        //Parsing value from all years
        years = d3.keys(country_resource);

        //Initializing the cummulative value array
        if (first == true) {
            cummulative_values = new Array(years.length).fill(0);
            first = false;
        }
        //But we have to display original value
        var values = new Array(years.length).fill(0);

        for (var i = 0; i < years.length; i++) {
            year = years[i];
            current_value = country_resource[year][resource_pattern];
            cummulative_values[i] = cummulative_values[i] + current_value;
            values[i] = current_value;
        }

        stacked_resource_data.push(multiplyConstant(cummulative_values.slice(), 1));
        line_resource_data.push(multiplyConstant(values, 1));
    }

    var layout = {
        title: country_name + ' energy resource consumption for all years',
    };

    if(percentage == true){
      normalized_values = normalizeResources(stacked_resource_data, 
                                                  line_resource_data, cummulative_values, true);
      stacked_resource_data = normalized_values[0];
      line_resource_data = normalized_values[1];
    }

    var stacked_trace = {
      y: stacked_resource_data,
      text: line_resource_data
    }

    var line_trace = {
        y: line_resource_data
    }

    Plotly.update('stackChart', stacked_trace, layout);
    Plotly.update('consumptionChart', line_trace, layout);
}


//Allowing functionality to enable or disable tooltip
function toggleTooltip() {

    var toggle = document.querySelector('input[name = "toggle"]:checked').value;

    if (toggle == "off") {
        Plotly.d3.selectAll(".hoverlayer").style("opacity", 0);
    } else {
      Plotly.d3.selectAll(".hoverlayer").style("opacity", 1);
    }
}