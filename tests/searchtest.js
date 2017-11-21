var searchUtils = require('../lib/search-utils');
var data = require('../data/output.json');
var fs = require('fs');

var studies = data.studies.clinical_study;


searchUtils.getSynonyms("coronary", function(synArr) {
    console.log("search terms: " + synArr);
    
    var matches = searchUtils.search(studies, synArr,
        [
            'brief_title.0',
            'official_title.0', 
            'detailed_description.0.textblock.0',
            'keyword'
        ]
    );
    
    
    console.log('matches: ' + matches.length);
    
    var results = searchUtils.getResults(studies, matches, 
        { 
            nct_id: 'id_info.0.nct_id.0',
            url: 'required_header.0.url.0'
        }
    );
    
    console.log('results: ' + results.length);
    
});


// fs.writeFile('./results.json', JSON.stringify(results) , function(err) {
//     if (err) throw err;
// });