var global_data;
loadData()

function loadData() {
	
	var resulting = Papa.parse("/data/BP_2017_wind_consumption_twh.csv",{
		download: true,
		beforeFirstChunk: function(chunk){
			return chunk.split('\n').slice(6).join('\n');
		},
		header: true,
		complete: function (result) {
			console.log(result);
		}
		
	});

	




	
}
