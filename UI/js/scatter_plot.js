d3.queue()
    .defer(d3.json, "../Data/BPStatReview/bp_stat_review_2017_combined.json")
    .await(ready);

var merged_json;

function ready(error, loaded_json){
    merged_json = loaded_json;
    plotPatternData('mtoe', 'IN', 'consumption')
}



function plotPatternData(unit, country, resource_pattern){
    /*Aim is to get timeseries data for a given country, unit for all resources for all years*/

    var resource_data = {};

    for (var resource in merged_json[unit]){
        resource_data[resource] = [];
        country_resource = merged_json[unit][resource][country];
        //Parsing all years
        for(var year in country_resource){
            pattern_value = country_resource[year][resource_pattern];
            resource_data[resource].push({"Date": year, "Value": pattern_value})
        }
    }
    console.log(resource_data);
}