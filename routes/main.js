
var searchUtils = require('../lib/search-utils');
var bodyParser = require('body-parser');
var data = require('../data/output.json');
var studies = data.studies.clinical_study;
var util = require('util');


module.exports = function(app, root) {

    console.log('App is running.');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/', function(req, res) {       
        res.render('index');
    });


    // ** DETAILS PAGE **//

    app.get('/details/:nct', function(req, res) {

        var nct = decodeURIComponent(req.params.nct);

        detailsQuery(nct, function(results) {
            res.render('details', {
                    data: results
            });
        });
    });


    // ** DETAILS JSON **//

    app.get('/details/:nct/.json', function(req, res) {

        var nct = decodeURIComponent(req.params.nct);

        detailsQuery(nct, function(results) {
            res.jsonp(results);
        });
    });


    // ** SEARCH RESULTS PAGE ** //
    
    app.get('/search-results/:query', function(req, res) {

        console.time('query');

        var query = decodeURIComponent(req.params.query);

        searchResultQuery(query, function(results, synArr) {
            res.render('search-results', {
                data: {
                    query: query,
                    related: synArr,
                    numMatches: results.length,
                    results: results
                }
            });
        });
    });  


    // ** SEARCH RESULTS JSON ** //

    app.get('/search-results/:query/.json', function(req, res) {

        console.time('query');

        var query = decodeURIComponent(req.params.query);
        
        searchResultQuery(query, function(results, synArr) {
            res.jsonp(results);
        });
    });


    function detailsQuery(nct, callback) {
        var matches = searchUtils.search(studies, [nct],
            [
                'id_info.0.nct_id.0'
            ]
        )

        var results = searchUtils.getResults(studies, matches, 

            // Enter below the objects of interest in the JSON tree
            { 
                nct_id: 'id_info.0.nct_id.0',
                url: 'required_header.0.url.0',
                official_title: 'official_title.0',
                phase: 'phase.0',
                brief_summary: 'brief_summary.0.textblock.0',
                healthy_volunteers: 'eligibility.0.healthy_volunteers.0',
                gender: 'eligibility.0.gender.0',
                inclusion_criteria: 'eligibility.0.criteria.0.textblock.0',
                minimum_age: 'eligibility.0.minimum_age.0',
                maximum_age: 'eligibility.0.maximum_age.0',
                overall_officials: 'overall_official',
                primary_outcome: 'primary_outcome',
                secondary_outcome: 'secondary_outcome',
                keywords: 'keyword',
                contact: 'overall_contact.0',
                detailed_description: 'detailed_description.0.textblock.0',
                site_disease_group: 'site_disease_group',
                status: 'status',
                last_updated: 'lastchanged_date.0'
            }
        )

        callback(results);
    }


    function searchResultQuery(query, callback) {

        searchUtils.getSynonyms(query, function(synArr) {

            console.log('Query: ' + query);
            console.log('Synonyms: ' + synArr);
            console.log('Getting matches...');
            var matches = searchUtils.search(studies, synArr,

                // Enter below the fields in the JSON tree to be searched
                [
                    'brief_title.0',
                    'official_title.0', 
                    'detailed_description.0.textblock.0',
                    'keyword'
                ]       
            );
            
            console.log('Getting results...');
            var results = searchUtils.getResults(studies, matches, 

                // Enter below the objects of interest in the JSON tree
                { 
                    nct_id: 'id_info.0.nct_id.0',
                    url: 'required_header.0.url.0',
                    brief_title: 'brief_title.0',
                    phase: 'phase.0',
                    brief_summary: 'brief_summary.0.textblock.0',
                    keywords: 'keyword',
                    last_updated: 'lastchanged_date.0',
                    health: 'eligibility.0.healthy_volunteers.0',
                    minimum_age: 'eligibility.0.minimum_age.0',
                    maximum_age: 'eligibility.0.maximum_age.0',
                    gender: 'eligibility.0.gender.0',
                    official_title: 'official_title.0',
                    detailed_description: 'detailed_description.0.textblock.0'
                }
            );
            
            var results = searchUtils.getSearchScore(results, synArr);

            // console.log(util.inspect(results));

            // Render the page and pass in data
            console.log('Sending data...');
            callback(results, synArr);
        });
    } 
};


var fs = require('fs');
