(function() {

var margin = {top: 50, left:50, right:50, bottom:50},
	height = 400 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

var svg = d3.select("#map")
			.append("svg")
			.attr("height", height + margin.top + margin.bottom)
			.attr("width", width + margin.left + margin.right)
			.append("g")
			.attr("tranform", "translate(" + margin.left + "," + margin.top + ")");

d3.queue()

            .defer(d3.json, "countries.json")
            .await(ready);


function parseData(file) {
    Papa.parse(file, {
	complete: function(results) {
		console.log("Finished:", results.data);
	}
	});
}

function ready(error, d1, d2){
	if(error) throw(error);

	var countries = d1
	console.log(countries)

	var coalstats = d2
	var coalstats = parseData("BP_2017_coal_consumption_mtoe.csv")

	buildMap(countries, coalstats)
            
        }
function buildMap(countries, coalstats){
            var features = countries.features;

            constructEmptyMap(features);
       
            }
})();