var fs = require('fs');
var Monitor = require('./lib/monitor');

fs.readFile('links.json', function(err, data) {
    if (err) throw err;
    var sites = JSON.parse(data);
	var monitor = new Monitor();
	monitor.on('fail', function(why) { console.log(why); });
	monitor.on('end', function() { /* checking complete! */ });
	monitor.check(sites);
});
