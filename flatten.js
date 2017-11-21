// cron job - need to double check node location on server
// 0 3 * * * /usr/local/bin/node /var/www/ct-search-tool/App/getLatest.js

var fs = require('fs');
var utils = require('./lib/search-utils');
// var jsonUtils = require('./lib/json-utils');
var data = require('./data/convertedXML.json');

// // Move new data file from data-drop folder and save it as JSON
// fs.rename('./data/data-drop/output.xml', './data/output.xml', function(err) {
//     if (err) throw err;
//     console.log('Moved new data file.');

//     // Converts xml output to json and saves it
//     utils.xmlToJson('./data/output.xml', function(jsonData) {
//         utils.saveFile('./data/output.json', JSON.stringify(jsonData));
//     });
// });


data = data.study.row;

var flattenedArr = {
    studies: {
        clinical_study: []
    }
}

for (i = 0; i < data.length; i++) {
    var row = data[i];

    flattenedArr.studies.clinical_study.push(
        {
            id_info: [
                {
                    nct_id: row.NCTdataId
                }
            ],
            brief_title: row.BriefTitle,
            required_header: [
                {
                    url: row.LinkUrl
                }
            ],
            official_title: row.OfficialTitle,
            phase: row.Phase,
            brief_summary: [
                {
                    textblock: row.BriefSummary
                }
            ],
            eligibility: [
                {
                    healthy_volunteers: row.Volunteers,
                    gender: row.EligibleGender,
                    criteria: [
                        {
                            textblock: row.Eligibility
                        }
                    ],
                    minimum_age: row.MinAge,
                    maximum_age: row.MaxAge
                }
            ],
            overall_official: [
                {
                    last_name: row.OverallOfficial,
                    role: row.OverallRole,
                    affiliation: row.OverallAffilitation
                }
            ],
            primary_outcome: row.StudyObjective,
            secondary_outcome: row.StudyObjective,
            keyword: row.MeshKeyword ? row.MeshKeyword[0].substring(0, row.MeshKeyword[0].length-2).split(',') : [],
            overall_contact: [
                {
                    last_name: row.ContactName,
                    phone: row.ContactPhone,
                    email: row.ContactEmail
                }
            ],
            detailed_description: [
                {
                    textblock: row.Description
                }
            ],
            site_disease_group: row.DiseaseSiteListDesc,
            status: row.CurrentStudyStatus,
            lastchanged_date: row.LastChanged
        }
    )
}

utils.saveFile('./data/output.json', JSON.stringify(flattenedArr));