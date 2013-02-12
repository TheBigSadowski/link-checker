var http = require('http');

function check(link) {
    var request = http.get(link.url, function(res) {
        res.setEncoding('utf8');
        res.data = '';
        res.on('data', function(chunk) {
            res.data += chunk;
        });
        res.on('end', function() {
            if (link.failOnMatch) {
                var rx = new RegExp(link.failOnMatch, "i");
                var fail = res.data.search(rx) >= 0;
                if (fail) {
                    console.log("FAIL: " + link.url);
                }
            }
        });
    });
    request.on('error', function(err) {
        console.log(err);
    });
}

var links = [
 { "failOnMatch": "askldjf", "url": "http://nodejs.org/api/fs.html"},
 { "failOnMatch": "manual", "url": "http://nodejs.org/api/fs.html?"}
];

for (var i = 0; i < links.length; i++) {
    check(links[i]);
}