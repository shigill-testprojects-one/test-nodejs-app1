var fs = require('fs'),
    xml2js = require('xml2js');
var utils = require('./lib/search-utils')
var convert = require('xml-js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/data/data-drop/test.xml', "utf-8", function (err, data) {
    // console.log(data);
    // var data2 = data.replace("\uFEFF", "")
    // console.log(data);
    parser.parseString(data, function (err, result) {
        console.log(err);
        console.dir(result);
        console.log('Done');
        utils.saveFile('./data/convertedXML.json', JSON.stringify(result));
    });

    // var result = convert.xml2js(data);
});

// var parser = new xml2js.Parser();
// // Read xml file
// fs.readFile('./data/data-drop/output.xml', function (err, data) {
//     if (err) throw err;
//     // Convert to json
//     console.log(data);
//     parser.parseString(data, function (err, result) {
//         console.log(result);
//     });
// });

// // // Move new data file from data-drop folder and save it as JSON
// fs.rename('./data/data-drop/output.xml', './data/output.xml', function(err) {
//     if (err) throw err;
//     console.log('Moved new data file.');

// // Converts xml output to json and saves it
// utils.xmlToJson('./data/data-drop/output.xml', function (jsonData) {
//     console.log(jsonData);
//     utils.saveFile('./data/output.json', JSON.stringify(jsonData));
// });
// // });