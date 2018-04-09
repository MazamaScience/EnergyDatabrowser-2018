var margin_sv = {top: 20, right: 20, bottom: 30, left: 50},
		width_sv = 960 - margin_sv.left - margin_sv.right,
		height_sv = 500 - margin_sv.top - margin_sv.bottom;

		var x_sv = d3.scaleTime().range([0, width_sv]);
		var y_sv = d3.scaleLinear().range([height_sv, 0]);

		var parseDate_sv = d3.timeParse('%Y');

		var svg_sv = d3.select(".graph").append("svg")
			    .attr("width", width_sv + margin_sv.left + margin_sv.right)
			    .attr("height", height_sv + margin_sv.top + margin_sv.bottom)
			  	.append("g")
			    .attr("transform",
			          "translate(" + margin_sv.left + "," + margin_sv.top + ")");

		var valueline_sv = d3.line()
          .x(function(d) { return x_sv(d.YEAR); })
          .y(function(d) { return y_sv(d[countryID_sv]); });

    var countryID_sv = 0;
    var coal_sv=0;
    var gas_sv=0;
    var hydro_sv=0;
    var nuclear_sv=0;
    var oil_sv=0;


		function drawStack(){
          
					var cid_sv = document.getElementById("countryID");
					countryID_sv = cid_sv.options[cid_sv.selectedIndex].value;
					
          var val_sv=document.querySelector('input[name="units"]:checked').value;
    				

    				d3.queue()
		  				.defer(d3.csv, "data/BP_2017_coal_consumption_"+val_sv+".csv")
		  				.defer(d3.csv, "data/BP_2017_gas_consumption_"+val_sv+".csv")
              .defer(d3.csv, "data/BP_2017_hydro_consumption_"+val_sv+".csv")
              .defer(d3.csv, "data/BP_2017_nuclear_consumption_"+val_sv+".csv")
              .defer(d3.csv, "data/BP_2017_oil_consumption_"+val_sv+".csv")
		  				.await(draw_stack); 
		};


		function draw_stack(error, coal, gas, hydro, nuclear, oil) {
			  if (error) throw error;
        

          coal_sv=coal;
          gas_sv=gas;
          hydro_sv=hydro;
          nuclear_sv=nuclear;
          oil_sv=oil;

			    coal_sv.forEach(function(d) {
				      d.YEAR = parseDate_sv(d.YEAR);
				      d[countryID_sv] = +d[countryID_sv] || 0
  				});

  				gas_sv.forEach(function(d) {
  					d.YEAR = parseDate_sv(d.YEAR);
				      d[countryID_sv] = +d[countryID_sv] || 0
  				});

          hydro_sv.forEach(function(d) {
            d.YEAR = parseDate_sv(d.YEAR);
              d[countryID_sv] = +d[countryID_sv] || 0
          });

          nuclear_sv.forEach(function(d) {
            d.YEAR = parseDate_sv(d.YEAR);
              d[countryID_sv] = +d[countryID_sv] || 0
          });

          oil_sv.forEach(function(d) {

            d.YEAR = parseDate_sv(d.YEAR);
              d[countryID_sv] = +d[countryID_sv] || 0
          });


				x_sv.domain(d3.extent(coal_sv, function(d) { return d.YEAR; }));
  			y_sv.domain([0, d3.max([d3.max(coal_sv, function(d) { return d[countryID_sv]; }),d3.max(gas_sv, function(d) { return d[countryID_sv]; }),d3.max(hydro_sv, function(d) { return d[countryID_sv]; }),d3.max(nuclear_sv, function(d) { return d[countryID_sv]; }),d3.max(oil_sv, function(d) { return d[countryID_sv]; })])]);


  				svg_sv.append("path")
			      .data([coal_sv])
			      .attr("class", "line")
			      .attr("d", valueline_sv);

			    svg_sv.append("path")
			      .data([gas_sv])
			      .attr("class", "line2")
			      .attr("d", valueline_sv);

          svg_sv.append("path")
            .data([hydro_sv])
            .attr("class", "line3")
            .attr("d", valueline_sv);

          svg_sv.append("path")
            .data([nuclear_sv])
            .attr("class", "line4")
            .attr("d", valueline_sv);

          svg_sv.append("path")
            .data([oil_sv])
            .attr("class", "line5")
            .attr("d", valueline_sv);

			    svg_sv.append("g")
            .attr("class", "xaxis")
			      .attr("transform", "translate(0," + height_sv + ")")
			      .call(d3.axisBottom(x_sv));

			  // Add the Y Axis
			  	svg_sv.append("g")
            .attr("class", "yaxis")
			      .call(d3.axisLeft(y_sv));
			    
			}



function updateData(){
          var cid_sv = document.getElementById("countryID");
          countryID_sv = cid_sv.options[cid_sv.selectedIndex].value;
          
          
          coal_sv.forEach(function(d) {
              d[countryID_sv] = +d[countryID_sv] || 0
              
          });

          gas_sv.forEach(function(d) {
            d[countryID_sv] = +d[countryID_sv] || 0

          });

          hydro_sv.forEach(function(d) {
            d[countryID_sv] = +d[countryID_sv] || 0

          });

          nuclear_sv.forEach(function(d) {
            d[countryID_sv] = +d[countryID_sv] || 0

          });

          oil_sv.forEach(function(d) {
            d[countryID_sv] = +d[countryID_sv] || 0

          });

          x_sv.domain(d3.extent(coal_sv, function(d) { return d.YEAR; }));
          y_sv.domain([0, d3.max([d3.max(coal_sv, function(d) { return d[countryID_sv]; }),d3.max(gas_sv, function(d) { return d[countryID_sv]; }),d3.max(hydro_sv, function(d) { return d[countryID_sv]; }),d3.max(nuclear_sv, function(d) { return d[countryID_sv]; }),d3.max(oil_sv, function(d) { return d[countryID_sv]; })])]);

          var svg_sv = d3.select(".graph").transition();

          svg_sv.select(".line")
            .duration(250)
            .attr("d", valueline_sv(coal_sv));

          svg_sv.select(".line2")
            .duration(250)
            .attr("d", valueline_sv(gas_sv));

          svg_sv.select(".line3")
            .duration(250)
            .attr("d", valueline_sv(hydro_sv));

          svg_sv.select(".line4")
            .duration(250)
            .attr("d", valueline_sv(nuclear_sv));

          svg_sv.select(".line5")
            .duration(250)
            .attr("d", valueline_sv(oil_sv));

          svg_sv.select(".xaxis") // change the x axis
            .duration(250)
            .call(d3.axisBottom(x_sv));
          
          svg_sv.select(".yaxis") // change the y axis
            .duration(250)
            .call(d3.axisLeft(y_sv));

    };