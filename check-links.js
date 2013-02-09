var lazy = require("lazy");
var fs = require("fs");
var http = require('http');

/*
new lazy(fs.createReadStream('links-to-check.txt'))
    .lines
    .forEach(function(line){
        http.get(line.toString(), function(res) {
           console.log(res.statusCode + ' ' + line); 
        }).on('error', function(err){
            console.log('ERROR!! ' + line);
        });
     });
*/

function check(link) {
	//console.log(link);
	var request = http.get(link.url, function(res) {
		console.log('response from ' + link.url);
		//console.log(res);
		res.setEncoding('utf8');
		res.data = '';
		res.on('data', function(chunk) {
			res.data += chunk;
			//console.log('  chunk from ' + link.url);
		});
		res.on('end', function() {
			console.log(' end: ' + link.url);
			if (link.lookFor) {
				var fail = res.data.search(link.lookFor) >= 0 ? 'found' : 'not-found';
				console.log(link.url + ' : ' + fail);
			}
		});
	});
	request.on('data', function(chunk) {
		console.log(' chunk from ' + link.url);
	});
	request.on('error', function(err) {
		console.log(err);
	});
}

var links = [
 { lookFor: /askldjf/, url: "http://nodejs.org/api/fs.html"},
 { lookFor: /manual/i, url: "http://nodejs.org/api/fs.html?"}
];

//console.log(stuff);
for (var i = 0; i < 2; i++) {
	check(links[i]);
}