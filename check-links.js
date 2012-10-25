var lazy = require("lazy");
var fs = require("fs");
var http = require('http');

new lazy(fs.createReadStream('links-to-check.txt'))
    .lines
    .forEach(function(line){
        http.get(line.toString(), function(res) {
           console.log(res.statusCode + ' ' + line); 
        }).on('error', function(err){
            console.log('ERROR!! ' + line);
        });
     });
