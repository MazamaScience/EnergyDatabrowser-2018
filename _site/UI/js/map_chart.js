        var tradeColor = d3.scaleThreshold()
                           .domain([-500, -300, -100, 0, 100, 300, 500])
                           .range(['#6d0e04', '#aa190a', '#d3301f', '#e74c3c',
                                     '#34bc6e', '#0f753a', '#046d31']);
                           //.range(["#145a32", "#1e8449", "#52be80", " #a9dfbf",
                           //             "#c0392b", "#922b21", "#7b241c"]);

        // Set default variable for year
        var years = ["2014","2016"];

        //Define path generator, using projection
        var projection = d3.geoCylindricalStereographic()
                            .scale(150)
                            //.translate([960 / 2, 500 / 2]);
        var path = d3.geoPath()
            .projection(projection)
    
        // Develop a tooltip
        var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('opacity', '0')
            .style('padding', '5,15px')
            .style('border', 'none');

        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

            svg = svg.append("g")
                        .attr("transform", "translate( 15 ," + margin.top + ")");

        //Loading JSON files
        d3.queue()
            .defer(d3.json, "data/countries.json")
            .defer(d3.json, "data/oil_stats.json")
            .defer(d3.json,"data/inter_area.json")
            .await(ready);

        var countries, oil_stats, trade_movements;

        function ready(error, d1, d2,d3){
            if(error) throw(error);
            countries = d1;
            oil_stats = d2;
            trade_movements = d3;

            buildMap(countries, oil_stats, trade_movements);
        }

        function buildMap(countries, oil_stats, trade_movements){
            var features = countries.features;

            constructEmptyMap(features);
            selected_type = d3.select('#drop_down').node().value;
            selected_year = 2016;

            //Make it dynamic according to input values
            color = d3.scaleThreshold()
                .domain([1000, 2000, 3000, 4000, 5000, 14000])
                .range(['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac', "#19198c"]);

            if(selected_type != 'oil_trade'){
                data = oil_stats[selected_type][selected_year];
                //Showing production values
                valueMap(features, oil_stats, selected_type, selected_year);
            }
            else{
                data = trade_movements;
                //Showing trade area movements
                tradeMap(features, data, selected_year);
            }

            d3.select('#Year').on("input", function(){displayYear();
                update();});
            d3.select('#drop_down').on("change", function(){//displayText();
                update();});

            function displayText(){
                var optionSelection = document.getElementById("drop_down");
                if(optionSelection.value == "oil_trade")
                {
                    document.getElementById("chart2").innerHTML = "Trends in Oil Trade (Imports and Exports of Crude in Million Tonnes per Year)"
                }
                else
                {
                    document.getElementById("chart2").innerHTML = "Trends in Oil Produciton (Thousand Barrels Daily Averages by Year)"   
                }
            }
                        
            function displayYear() {
                var yearSlider = document.getElementById("Year");
                year = yearSlider.value
                document.getElementById("yeartext").innerHTML = year;
            }

            function update(){
                d3.selectAll("path.line").remove();
                d3.selectAll('path[id=import]').remove();
                d3.selectAll('path[id=export]').remove();
                d3.selectAll('g[id=yaxis]').remove();
                d3.selectAll('g[id=yaxis2]').remove();
                d3.selectAll("g[id=xaxis]").remove();
                d3.selectAll("g[id=xaxis2]").remove();
                d3.selectAll("#tradeChartText").remove();
                d3.selectAll("#valChartText").remove();
                d3.selectAll("#tradeImport").remove();
                d3.selectAll("#tradeExport").remove();
                d3.selectAll("#tradeRect1").remove();
                d3.selectAll("#tradeRect2").remove();
                d3.selectAll("#t1").remove()
                d3.selectAll("#t2").remove()
                d3.selectAll("#t3").remove()
                d3.selectAll("#t4").remove()
                d3.selectAll("#t5").remove()
                d3.selectAll("#t6").remove()
                d3.selectAll("#r1").remove()
                d3.selectAll("#r2").remove()
                d3.selectAll("#r3").remove()
                d3.selectAll("#r4").remove()
                d3.selectAll("#r5").remove()
                d3.selectAll("#r6").remove()


                var slider = document.getElementById("Year");
                selected_year = slider.value;

                var drop_down = document.getElementById("drop_down");
                selected_type = drop_down.value;

                if(selected_type != 'oil_trade'){
                    //Showing production values
                    valueMap(features, oil_stats, selected_type, selected_year);
                }
                else{
                    data = trade_movements;
                    //Showing trade area movements
                    svg.selectAll('path')
                            .style('fill', 'white');
                    tradeMap(features, data, selected_year);
                }
            }

            function constructEmptyMap(features){
                //Bind data and create one path per GeoJSON feature
                //var drop_down = document.getElementById("drop_down");
                //selected_type = drop_down.value;

                svg.selectAll("path")
                    .data(features)
                    .enter()
                    .append("path")
                    .attr('id', function(d) {return d.properties.interarea_category})
                    .attr("d", path)
                    .style("fill", 'white')
                    .style("stroke", 'black')
                     .on('mouseover',function(d){
                        d3.select(this).append('svg:title').text(function(d){ 
                            
                            return d.properties.production_category;
                        })
                    })}

            function valueMap(features, oil_stats, selected_type, selected_year){
                data = oil_stats[selected_type][selected_year];

                svg.selectAll("path")
                    .data(features)
                    .on("click", function(d, i){return buildValueChart(d.properties.production_category, 
                                                                    oil_stats[selected_type])})
                    
                    .transition()
                    .duration(250)
                    .style("fill", function(d){return fillMapData(d.properties.production_category, data)})

                    //console.log(d3.rgb("#f0f9e8"))

                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t1")
                    .attr("transform","translate(60,500)")
                    .text("<=1000")

                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r1")
                    .style("fill","#f0f9e8") 
                    .attr("border","black")
                    .attr("transform","translate(80,470)")
                    .attr("width",15)
                    .attr("height",15)

                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t2")
                    .attr("transform","translate(120,500)")
                    .text("<=2000")    
                    
                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r2")
                    .style("fill","#bae4bc") 
                    .attr("transform","translate(140,470)")
                    .attr("width",15)
                    .attr("height",15)
                
                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t3")
                    .attr("transform","translate(180,500)")
                    .text("<=3000") 

                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r3")
                    .style("fill","#7bccc4") 
                    .attr("transform","translate(200,470)")
                    .attr("width",15)
                    .attr("height",15)

                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t4")
                    .attr("transform","translate(240,500)")
                    .text("<=4000")    

                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r4")
                    .style("fill","#43a2ca") 
                    .attr("transform","translate(260,470)")
                    .attr("width",15)
                    .attr("height",15)

                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t5")
                    .attr("transform","translate(300,500)")
                    .text("<=5000") 
                        
                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r5")
                    .style("fill","#0868ac") 
                    .attr("transform","translate(320,470)")
                    .attr("width",15)
                    .attr("height",15)

                d3.select("#map")
                    .append('svg:text')
                    .attr("id","t6")
                    .attr("transform","translate(360,500)")
                    .text("<=14000")    

                d3.select("#map")
                    .append('svg:rect')
                    .attr("id","r6")
                    .style("fill","#19198c") 
                    .attr("transform","translate(380,470)")
                    .attr("width",15)
                    .attr("height",15)
                                    
            }

            function fillMapData(production_category, oil_values){
                if (production_category == null){
                    return "white";
                }
                return color(oil_values[production_category]);
            }

            function tradeMap(features, data, selected_year){
                current_year = data[selected_year]
                svg.selectAll("path")
                    .data(features)
                    .on("click", function(d, i){
                        buildTradeChart(d.properties.interarea_category, data)
                        return showTrade(d.properties.interarea_category, current_year)})
                   
            }

            function showTrade(interarea_category, data){
                if (interarea_category != null){
                    data = data[interarea_category];
                    keys = d3.keys(data);

                    for (var i = 0; i < keys.length; i++){
                        imp = data[keys[i]]['imp'];
                        exp = data[keys[i]]['exp'];
                        net = imp - exp;
                        
                        svg.selectAll('path[id="'+keys[i]+'"]')
                            .transition()
                            .duration(500)
                            .style('fill', tradeColor(net))
                    }
                }
            }

            function buildValueChart(id, oil_stats){
                d3.selectAll("path.line").remove();
                d3.selectAll("g[id=yaxis]").remove();
                d3.selectAll("g[id=xaxis]").remove();
                d3.selectAll("#valChartText").remove();

                var svg = d3.select("svg"),
                margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;

                svg = svg.append("g")
                        .attr("transform", "translate( 15 ," + margin.top + ")");

                
                years = d3.keys(oil_stats);
                var stats = [];
                for (var i = 0; i < years.length; i++){
                    stats.push({"Date": years[i], "stat": oil_stats[years[i]][id]});
                }
                
                var parseTime = d3.timeParse("%Y");

                var x = d3.scaleTime().range([0, width]);

                var y = d3.scaleLinear().range([height, 0]);

                // define the line
                var valueline = d3.line()
                    .x(function(d) { return x(d.Date); })
                    .y(function(d) { return y(d.stat); });

                d3.select("#line")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform",
                                  "translate(" + margin.left + "," + margin.top + ")");

                stats.forEach(function(d) {
                      d.Date = parseTime(d.Date);
                      d.stat = +d.stat;
                  });

                // sort years ascending
                stats.sort(function(a, b){
                    return a["Date"]-b["Date"];
                    })

                x.domain(d3.extent(stats, function(d) { return d.Date; }));
                y.domain([0, d3.max(stats, function(d) {return d.stat; })]);

                
                // Add the valueline path.
                d3.select("#line")
                    .append("path")
                    .data([stats])
                    .attr("class", "line")
                    .attr("d", valueline)
                    .attr("transform", "translate(40,0)")
                    //.on('mouseover',function(d){console.log(y(d))}
                        
                    ;
                    
                // Add the X Axis
                d3.select("#line")
                    .append("g")
                    .attr("id","xaxis")
                    .attr("transform", "translate(40," + height + ")")
                    .call(d3.axisBottom(x).ticks(3));

                // Add the Y Axis
                d3.select("#line")
                    .append("g")
                    .attr("id","yaxis")
                    .attr("transform", "translate(40,0)")
                    .call(d3.axisLeft(y));

               d3.select("#line")
                  .append("svg:text")
                  .attr("id","valChartText")
                  .attr("transform","translate(200,490)")
                  .text("Trends in Oil Produciton (Thousand Barrels Daily Averages by Year)")    
            }

            function buildTradeChart(id, oil_trade){
                d3.selectAll("path.line").remove();
                

                years = d3.keys(oil_trade);
                var stats = [];
                for (var i = 0; i < years.length; i++){
                    stats.push({"Date": years[i], "Import":oil_trade[years[i]][id]["total"]["imp"], 
                                "Export":oil_trade[years[i]][id]["total"]["exp"]});
                }
                
                var parseTime = d3.timeParse("%Y");

                var x = d3.scaleTime().range([0, width]);
                var y = d3.scaleLinear().range([height, 0]);

                // define the line
                var valueline = d3.line()
                    .x(function(d) { return x(d.Date); })
                    .y(function(d) { return y(d.Import); });

                var valueline2 = d3.line()
                    .x(function(d) { return x(d.Date); })
                    .y(function(d) { return y(d.Export); });

                d3.select("#line")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform",
                                  "translate(" + margin.left + "," + margin.top + ")");

                stats.forEach(function(d) {
                      d.Date = parseTime(d.Date);
                      d.Export = +d.Export;
                      d.Import = +d.Import;
                  });

                // sort years ascending
                stats.sort(function(a, b){
                    return a["Date"]-b["Date"];
                    })

                x.domain(d3.extent(stats, function(d) { return d.Date; }));
                y.domain([0, d3.max(stats, function(d) {return Math.max(d.Import, d.Export); })]);

                // Add the valueline path.
                d3.select("#line")
                    .append("path")
                    .data([stats])
                    .attr("d", valueline)
                    .attr("transform", "translate(40,0)")
                    .attr("stroke", "red")
                    .attr("id", 'import')
                    .attr("fill", "none")
                    ;
                d3.select("#line")
                    .append("path")
                    .data([stats])
                    .attr("d", valueline2)
                    .attr("transform", "translate(40,0)")
                    .attr("stroke", "green")
                    .attr("id", "export")
                    .attr("fill", "none");
                // Add the X Axis
                d3.select("#line")
                    .append("g")
                    .attr("id","xaxis2")
                    .attr("transform", "translate(40," + height + ")")
                    .call(d3.axisBottom(x).ticks(3));

                // Add the Y Axis
                d3.select("#line")
                    .append("g")
                    .attr("id","yaxis2")
                    .attr("transform", "translate(40,0)")
                    .call(d3.axisLeft(y))
                
               d3.select("#line")
                  .append("svg:text")
                  .attr("id","tradeImport")
                  .attr("transform","translate(500,20)")
                  .text("Import");
                 
                d3.select('#line')
                    .append("svg:rect")
                    .attr("id","tradeRect1")
                    .attr("transform","translate(480,10)")
                    .attr("width",10)
                    .attr("height",10)
                    .attr("fill","Red");

                d3.select("#line")
                  .append("svg:text")
                  .attr("id","tradeExport")
                  .attr("transform","translate(600,20)")
                  .text("Export"); 
                
                d3.select('#line')
                    .append("svg:rect")
                    .attr("id","tradeRect2")
                    .attr("transform","translate(580,10)")
                    .attr("width",10)
                    .attr("height",10)
                    .attr("fill","Green");    

                d3.select("#line")
                  .append("svg:text")
                  .attr("id","tradeChartText")
                  .attr("transform","translate(200,490)")
                  .text("Trends in Oil Trade (Imports and Exports of Crude in Million Tonnes per Year)");
                  
                ;    
            }

        }

