// https://codepen.io/MichaelWStuart/pen/Xpmbyq?editors=0110
// https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084
// https://bl.ocks.org/mbostock/5537697

charts.chart1 = function () {

  var file = "data/club_stats.csv";
  var fields = ['Club', 'Average_Age', 'Average_potential', //'Highest_Paid_Player',
  'Highest_Paid_Wage(Euros)', 'Total_Players']

  d3.csv(file, function (err, data) {
    var statsMap = {};
    data.forEach(element => {
      var club = element.Club;
      statsMap[club] = [];
      fields.forEach(field => {

        if (isNaN(+element[field]))
          statsMap[club].push(element[field]);
        else
          statsMap[club].push(+element[field]); 
      })
    });
    console.log(statsMap);
    createVisual(statsMap);
  });

  var createVisual = function (statsMap) {
    var margin = { top: 30, right: 50, bottom: 30, left: 50 },
                    width  = 550 - margin.left - margin.right,
                    height = 250 - margin.top  - margin.bottom;

    var xScale = d3.scale.ordinal()
      .domain(fields)
      .rangeRoundBands([0, width], 0.1);
  
    var yScale = d3.scaleBand()
      .range([height, 0]);
  
    var canvas = d3.select("#vis-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
  
    canvas.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");
  
    var yAxisHandleForUpdate = canvas.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  
    yAxisHandleForUpdate.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");

      var updateBars = function (data) {
        // First update the y-axis domain to match data
        yScale.domain(d3.extent(data));
        yAxisHandleForUpdate.call(yAxis);
      
        var bars = canvas.selectAll(".bar").data(data);
      
        // Add bars for new data
        bars.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function (d, i) { return xScale(fields[i]); })
          .attr("width", xScale.rangeBand())
          .attr("y", function (d, i) { return yScale(d); })
          .attr("height", function (d, i) { return height - yScale(d); });
      
        // Update old ones, already have x / width from before
        bars
          .transition().duration(250)
          .attr("y", function (d, i) { return yScale(d); })
          .attr("height", function (d, i) { return height - yScale(d); });
      
        // Remove old ones
        bars.exit().remove();
      };

      var clubs = Object.keys(statsMap).sort();
      var dropdown = d3.select("#vis-container")
        .insert("select", "svg")
        .on("change", dropdownChange);
      dropdown.selectAll("option")
        .data(clubs)
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
          return d[0].toUpperCase() + d.slice(1, d.length);
        });
    
      statsMap[clubs[0]];
      updateBars(statsMap[clubs[0]]);
    
      var dropdownChange = function() {
        var newCereal = d3.select(this).property('value'),
            newData   = statsMap[newCereal];
      
        updateBars(newData);
      };
  };


};