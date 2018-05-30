
// Variable to toggle plots
var energyPlotFlag = 0;
// Specific colors and symbols for all resources
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
        'color': '#9966ff'
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

// Global variables to handle radio buttons
var countryID_global = null;
var country_global = null;


// Function to toggle between creating a new plot and updating it
function toggleAllEnergyPlots(countryID, country){

  countryID_global = countryID;
  country_global = country;

  if(energyPlotFlag == 0) {
    resourceChart()
    energyPlotFlag ++;
  }
  else {
   updateChart()
  }
}

//Divide two arrays
function divideArray(A, B){
  return(A.map(function(n, i) { return n / B[i]; }));
}

//Multiply Array
function multiplyConstant(A, constant){
  //Return upto four decimal digits
  return(A.map(function(element) {return (element * constant).toFixed(4);}));
}

//Null Comparision
function fillZeros(A){
  return(A.map(function(element) {return (element || 0);}));
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
function resourceChart() {
    // var cid_sp = document.getElementById("countryID");
    // var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    // var country_sp = cid_sp.options[cid_sp.selectedIndex].text;

    var utility = document.querySelector('input[name = "utility"]:checked').value;
    var pct = document.getElementById("percent").checked;
    plotResourceCharts('mtoe', countryID_global, country_global, utility, pct);
}

//Update the chart as the radio button changes
function updateChart(countryID, country) {
    // var cid_sp = document.getElementById("countryID");
    // var countryID_sp = cid_sp.options[cid_sp.selectedIndex].value;
    // var country_sp = cid_sp.options[cid_sp.selectedIndex].text;
    var utility = document.querySelector('input[name = "utility"]:checked').value;
    var pct = document.getElementById("percent").checked;
    updateResourceCharts('mtoe', countryID_global, country_global, utility, pct);
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

    var subtitle = 0

    //The order of resources have to be fixed for stacked area
    for (var i in resources) {
        resource = resources[i];
        country_resource = data_json[unit][resource][country];
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
            current_value = country_resource[year][resource_pattern] || 0;
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
            hoverinfo: 'all',
            x: years,
            y: values,
            marker: {
                color: markers[resource]['color'],
                symbol: markers[resource]['symbol']
            },
        }
        stacked_resource_data.push(stacked_trace);
        line_resource_data.push(line_trace);

    }
    
    var pct_chg = Math.round((stacked_trace.y[51]-stacked_trace.y[36])/stacked_trace.y[36]*10000)/100
    
    if(pct_chg>0){
        subtitle = " Increased by " +  pct_chg + "% since 2000"
    }
    else{
        subtitle = " Decreased by " +  pct_chg + "% since 2000"
    }

    if(percentage == true){
      normalized_values = normalizeResources(stacked_resource_data, 
                                                  line_resource_data, cummulative_values, false);
      stacked_resource_data = normalized_values[0];
      line_resource_data = normalized_values[1];

    }

    var layout = {
        title: country_name + ' energy resource '+ resource_pattern + ' for all years',
        annotations: [{ 
            text: subtitle,            
            x: 1990,
            y: 1.13,
            showarrow: false,
            yref: 'paper',
            font: {
                size: 15,
            }
        }],

        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('stackChart', stacked_resource_data, layout);
    
    var layout = {
        title: country_name + ' energy resource '+ resource_pattern + ' for all years',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot('consumptionChart', line_resource_data, layout);
 
    
}

//Updating as the buttons change
function updateResourceCharts(unit, country, country_name, resource_pattern, percentage) {
    var stacked_resource_data = [];
    var line_resource_data = [];
    var first = true;
    var cummulative_values = [];
    var resources = ['nuclear', 'coal', 'oil', 'gas', 'hydro'];
    var subtitle = 0

    //The order of resources have to be fixed for stacked area
    for (var i in resources) {
        resource = resources[i];
        country_resource = data_json[unit][resource][country];
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
            current_value = country_resource[year][resource_pattern] || 0;
            cummulative_values[i] = cummulative_values[i] + current_value;
            values[i] = current_value;
        }

        stacked_resource_data.push(cummulative_values.slice());
        line_resource_data.push(values);
    }


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

    

    var pct_chg = Math.round((stacked_trace.y[4][51]-stacked_trace.y[4][36])/stacked_trace.y[4][36]*10000)/100
    
    if(pct_chg>0){
        subtitle = " Increased by " +  pct_chg + "% since 2000"
    }
    else{
        subtitle = " Decreased by " +  Math.abs(pct_chg) + "% since 2000"
    }

    var layout = {
        title: country_name + ' energy resource '+ resource_pattern + ' for all years',
        annotations: [{ 
            text: subtitle,            
            x: 1990,
            y: 1.13,
            showarrow: false,
            yref: 'paper',
            font: {
                size: 15,
            }
        }],

        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.update('stackChart', stacked_trace, layout);

    var layout = {
        title: country_name + ' energy resource '+ resource_pattern + ' for all years',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.update('consumptionChart', line_trace, layout);
}

//Allowing functionality to enable or disable tooltip
function toggleTooltip() {

    var toggle = document.querySelector('input[name = "toggle_tt"]:checked').value;
    if (toggle == "off") {
        console.log("err")
        Plotly.d3.selectAll(".hoverlayer").style("opacity", 0);
    } else {
      Plotly.d3.selectAll(".hoverlayer").style("opacity", 1);
    }
}