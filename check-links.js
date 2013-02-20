var http = require('http');
var fs = require('fs');
var events = require('events');
var util = require('util');


var Monitor = function() {
	events.EventEmitter.call(this);
	
	var self = this;
	
	this.check = function(sites) {
	    for (var i = 0; i < sites.length; i++) {
	        var site = sites[i];
	        for (var j = 0; j < site.pages.length; j++) {
	            this.checkSite(site.site, site.pages[j], site.errors);
	        }
	    }
	};
	
	this.checkSite = function(site, page, errors) {
	    var request = http.get({ hostname: site, path: page }, function(res) {
			//console.log(res.statusCode + '  ' + site + page);
	        if (res.statusCode != 200) {
				self.emit('fail', { site: site, page: page, reason: 'The server returned status code ' + res.statusCode + ' was found on the page'});
	            //console.log(res.statusCode + '  ' + site + page);
	        } else {
	            res.setEncoding('utf8');
	            res.data = '';
	            res.on('data', function(chunk) {
	                res.data += chunk;
	            });
	            res.on('end', function() {
	                if (errors) for (var i = 0; i < errors.length; i++) {
	                    var rx = new RegExp(errors[i], "i");
	                    var fail = res.data.search(rx) >= 0;
	                    if (fail) {
							self.emit('fail', { site: site, page: page, reason: 'The text [' + errors[i] + '] was found on the page'});
	                        //console.log("FAIL: " + site + page);
	                    }
	                }
	            });
	        }
	    });
	    request.on('error', function(err) {
	        console.log(err);
	    });
	};
};
util.inherits(Monitor, events.EventEmitter);

/*
function check(site, page, errors) {
    var request = http.get({ hostname: site, path: page }, function(res) {
        if (res.statusCode != 200) {
            console.log(res.statusCode + '  ' + site + page);
        } else {
            res.setEncoding('utf8');
            res.data = '';
            res.on('data', function(chunk) {
                res.data += chunk;
            });
            res.on('end', function() {
                if (errors) for (var i = 0; i < errors.length; i++) {
                    var rx = new RegExp(errors[i], "i");
                    var fail = res.data.search(rx) >= 0;
                    if (fail) {
                        console.log("FAIL: " + site + page);
                    }
                }
            });
        }
    });
    request.on('error', function(err) {
        console.log(err);
    });
}*/

fs.readFile('links.json', function(err, data) {
    if (err) throw err;
    var sites = JSON.parse(data);
    /*for (var i = 0; i < sites.length; i++) {
        var site = sites[i];
        for (var j = 0; j < site.pages.length; j++) {
            check(site.site, site.pages[j], site.errors);
        }
    }*/

	var monitor = new Monitor();
	monitor.on('fail', function(why) { console.log(why); });
	monitor.on('end', function() { /* checking complete! */ });
	monitor.check(sites);
});

//var monitor = require('./lib/checker');


