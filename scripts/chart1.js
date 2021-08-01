// https://codepen.io/MichaelWStuart/pen/Xpmbyq?editors=0110
// https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084
// https://bl.ocks.org/mbostock/5537697

charts.chart1 = function () {
    var fileName = "data/club_stats.csv";
    var textFields = [ 'Country_with_most_players', 'Position', 'Highest_Paid_Player']
    var nutritionFields = ['Average_Age', 'Average_potential', //'Highest_Paid_Player',
    'Highest_Paid_Wage(Euros)', 'Total_Players']

    d3.csv(fileName, function (error, data) {
        var cerealMap = {};
        data.forEach(function (d) {
            var cereal = d.Club;
            cerealMap[cereal] = [];

            // { cerealName: [ bar1Val, bar2Val, ... ] }
            nutritionFields.forEach(function (field) {
                cerealMap[cereal].push(+d[field]);
            });
            textFields.forEach(function (field) {
                cerealMap[cereal].push(d[field]);
            });
        });
        console.log(cerealMap);
        makeVis(cerealMap);
    });

    var makeVis = function (cerealMap) {
        // Define dimensions of vis
        var margin = {top: 40, right: 20, bottom: 60, left: 60};
        var width = 550;
        var height = 400;

        // Make x scale
        var xScale = d3.scale.ordinal()
            .domain(nutritionFields)
            .rangeRoundBands([0, width], 0.1);

        // Make y scale, the domain will be defined on bar update
        var yScale = d3.scale.linear()
            .range([height, 0]);

        // Create canvas
        var canvas = d3.select("#svg1")
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Make x-axis and add to canvas
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-15)");

        // Make y-axis and add to canvas
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
                .attr("x", function (d, i) { return xScale(nutritionFields[i]); })
                .attr("width", xScale.rangeBand())
                .attr("y", function (d, i) { return yScale(d); })
                .attr("height", function (d, i) { return height - yScale(d); });

                debugger;
            bars.append("text")
            .text(function(d) { 
                return d;
            })
            .attr("x", function(d, i){
                return xScale(nutritionFields[i]) + xScale.rangeBand()/2;
            })
            .attr("y", function(d){
                return yScale(d) - 5;
            })
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");

            // Update old ones, already have x / width from before
            bars
                .transition().duration(250)
                .attr("y", function (d, i) { return yScale(d); })
                .attr("height", function (d, i) { return height - yScale(d); });

            // Remove old ones
            bars.exit().remove();
            // debugger;
            d3.select("#CountryLabel").text(data[4]);
            d3.select("#PlayerHigh").text(data[6]);
            d3.select("#Position").text(data[5]);
        };

        // Handler for dropdown value change
        var dropdownChange = function () {
            var newCereal = d3.select(this).property('value'),
                newData = cerealMap[newCereal];

            updateBars(newData);
        };

        // Get names of cereals, for dropdown
        var cereals = Object.keys(cerealMap).sort();

        var dropdown = d3.select("#svg1")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(cereals)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) {
                return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
            });

        var initialData = cerealMap[cereals[0]];
        updateBars(initialData);
    };


};