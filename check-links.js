var http = require('http');
var fs = require('fs');

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
}

fs.readFile('links.json', function(err, data) {
    if (err) throw err;
    var sites = JSON.parse(data);
    for (var i = 0; i < sites.length; i++) {
        var site = sites[i];
        for (var j = 0; j < site.pages.length; j++) {
            check(site.site, site.pages[j], site.errors);
        }
    }
});