new fullpage('#fullpage', {
  licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
  sectionsColor: ['#F5F3D7', '#F5F3D7', '#F5F3D7', 'F5F3D7', '#F5F3D7'],
  scrollOverflow: true,

  // events
  afterSlideLoad: function(section, origin, destination, direction) {
    if(destination.index > 0 && destination.index < 2){
      var runChart = charts['chart' + destination.index];
      runChart();
    }
  },
});


charts.storage = {};
d3.cachedJson = function(url, key, callback) {
	if (charts.storage[key]) {
		callback(JSON.parse(charts.storage[key]));
	} else {
		d3.json(url, function(json) {
      charts.storage[key] = JSON.stringify(json);
      callback(json);
    });
	}
}