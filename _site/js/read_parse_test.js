var global_data;
var year = '2017';
var resource = 'wind';
var process = 'consumption';
var unit = 'twh';
loadData(year, resource, process, unit)

function loadData(year, resource, process, unit) {
	/*
	var resulting = Papa.parse("/data/BP_2017_wind_consumption_twh.csv",{
		download: true,
		beforeFirstChunk: function(chunk){
			return chunk.split('\n').slice(6).join('\n');
		},
		header: true,
		complete: function (result) {
			console.log(result);
		}
		
	});*/

	var url = '/' + 'data/BP_' + year + '_' + resource + '_' + process + '_' + unit
+ '.csv'

	console.log(url);
	d3.csv(url, function(data) {
		console.log(data);
	})
	
	

	




	
}
