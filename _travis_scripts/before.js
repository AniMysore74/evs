// fs & util are built in
var fs = require('fs');
var util = require('util');
// cheerio is nodejs-ified version of jQuery
var cheerio = require('cheerio');
// moment.js for time handling
var moment = require('moment');

// merges the seperate json modules into one file
function mergeJson() {

    var module = [];
    for (var i = 0; i < 5; i++) {
        var json = JSON.parse(fs.readFileSync('assets/json/mod' + (i + 1) + '.json', 'utf8'));
        module.push(json);
    }
    fs.writeFileSync('assets/json/modall.json', JSON.stringify(module), 'utf-8');
}

// reads index.html and updates last-modified meta tag with current time
function updateTime() {

    var html = fs.readFileSync('index.html', 'utf8');
    var $ = cheerio.load(html);
    var now = moment().format();
    $('meta[name="last-modified"]').attr("content", now);

    fs.writeFileSync('index.html',$.html(), 'utf-8');
}

mergeJson();
updateTime();
