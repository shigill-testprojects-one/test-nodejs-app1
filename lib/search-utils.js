var fs = require('fs');
var xml2js = require('xml2js');
var StringRef = require('./StringRef');
var util = require('util');


/*** PRIVATE ***/

        
/**
 * Check if property exists and performs search.
 * If property value is an array, iterate over them and perform search.
 * 
 * @param {Object} currentObject    - The object being considered
 * @param {Array} queryArr          - An array of search strings
 * @param {StringRef} ref           - A StringRef of the property being checked
 * @param {Array} matches           - An array with existing matches
 * @param {Integer} index           - The current index
 */
   
function propertyCheck(currentObject, queryArr, ref) {
   
    var currentVal = ref.getVal(currentObject);
    
    // Check if property exists
    if (currentVal) {
    
        // Check if value is a string
        if (typeof currentVal === "string") {
            
            // Perform search and add to array
            if (findMatch(queryArr, currentVal)) {
                return true;
            }
            
        } else {
            
            // Iterate of array and search each item
            for (i in currentVal) {
                if (currentVal.hasOwnProperty(i)) {
                    
                    if (typeof currentVal[i] !== "string") {
                        throw ("Error: " + currentVal[i] + " is not a searchable string or array of strings."); 
                    }
                    
                    // Perform search and add to array
                    if (findMatch(queryArr, currentVal[i])) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}


/**
 * Iterates over search terms and returns true once one is found
 * 
 * @params {Array} needleArr    - An array of search strings
 * @params {string} haystack    - The text to be searched
 */

function findMatch(needleArr, haystack) {

    for (var i = 0; i < needleArr.length; i++) {
        var regex = new RegExp(needleArr[i], "i");
        if (haystack.match(regex)) {
            return true
        }
    }
    return false;
}

    
/*** PUBLIC ***/


var self = module.exports = {
    
    /** 
     * Searches an array of objects, looks at the properties specified in propertyArr
     * Returns an array with the indices of matches
     *
     * @param {Array} object Arr    - The data to be considered
     * @param {Array} queryArr      - An array of search strings
     * @param {Array} propertyArr   - A list of properties to be searched
     * @param {Array} matchesArr    - (Optional) An array with pre-existing matches
     *                                If no array is passed, the function returns an array
     */  
        
    search: function(objectArr, queryArr, propertyArr, matchesArr) {
        // This flag indicates whether the function should return an array of matches or not
        var returnFlag = false;
        
        // Initialize matches if not passed in
        if (!matchesArr) {
            matchesArr = [];
            returnFlag = true;
        }
        
        // Iterate over all objects
        for (var i in objectArr) {
            var obj = objectArr[i];
            
            // Iterate over only the properties in propertyArr
            for (var j in propertyArr) {
                if (propertyArr.hasOwnProperty(j)) {
                    var property = propertyArr[j];
                    
                    if (propertyCheck(obj, queryArr, new StringRef(property))) {
                        if(matchesArr.indexOf(i) === -1) {
                            matchesArr.push(i);
                        }
                        break;
                    }
                }
                
                
            };
        }
        // Return an array of matches if no matches were passed in
        if (returnFlag === true) {
            return matchesArr;
        }
    },
   
    
    /** 
     * Returns an object array with all matches and desired properties
     *
     * @param {Array} objectArr     - The data to be considered
     * @param {Array} indexArr      - An array of indices
     * @param {Object} propsToSave  - The properties to be saved
     */  
    
    getResults: function(objectArr, indexArray, propsToSave) {
        var results = [];
        
        indexArray.forEach(function(index) {
            var saveObj = {};
            for (var i in propsToSave) {
                var ref = new StringRef(propsToSave[i]);
                saveObj[i] = ref.getVal(objectArr[index]);    
            }
            results.push(saveObj);
        });
        return results;
    },
    
    
    /**
     * Returns an array of synonyms for a word (inclusive) using wordnet
     *  
     * @param {string} word         - The word to look up
     * @param {function} callback   - A callback function
     */
    
    getSynonyms: function(word, callback) {
        var path = require('path');
        var appDir = path.dirname(require.main.filename);
        var wordNet = require('wordnet-magic');
        var wn = wordNet(appDir + '/data/wordnet.db');

        var matches = [word];

        var word = new wn.Word(word, 'n');
     
        // Get synset
        word.getSynsets(function(err, data){
            if (err) throw err;

            if(data.length === 0) {
                // No matches
                callback(matches);
            } else {
                data = data[0].words;
                 // Add all lemmas to matches array
                for (var j=0; j < data.length; j++) {
                    if(matches.indexOf(data[j].lemma) === -1) {
                        matches.push(data[j].lemma);
                    }
                }
                callback(matches);
            }
        });
    },


    /**
    * Gets the search score (relevancy) for all results
    *
    * @param {object} results       - The results being iterated over
    * @param {Array} queryArr       - An array of search terms
    */

    getSearchScore: function(results, queryArr) {
        
        var totalScore = 0;

        var scores = {
            'keywords': 5,
            'brief_title': 10,
            'official_title': 5,
            'brief_summary': 3,
            'detailed_description': 2
        }

        // Iterate over results
        for (var j in results) {
            if (results.hasOwnProperty(j)) {

                var keys = Object.keys(results[j]);

                // Iterate over keys and decide what score to assign for a match
                for (var key = 0; key < keys.length; key++) {


                    // The check if any of the query terms are found in this key
                    if (propertyCheck(results[j], queryArr, new StringRef(keys[key]))) {
                        totalScore += scores[keys[key]];
                    }
                }
                // Record the score and reset totalScore
                results[j].score = totalScore;
                totalScore = 0;
            }
        }
        return results;
    },
    
    
    /**
     * Coverts an XML file to JSON
     * 
     * @params {string} filepath    - The location of the xml file
     * @params {function} callback  - A callback function
     */
    
    xmlToJson: function(filepath, callback) {
        var parser = new xml2js.Parser();
        // Read xml file
        fs.readFile(filepath, function(err, data) {
            if (err) throw err;
            // Convert to json
            parser.parseString(data, function(err, result) {
                callback(result);
            });
        });
    },
    
    
    /**
     * Saves a file to the file system
     * 
     * @params {string} filepath    - The location of the xml file
     * @params {function} callback  - A callback function
     */
    
    saveFile: function(filepath, data) {
        fs.writeFile(filepath, data, function(err) {
            if (err) throw err;
            console.log('Saved ' + filepath);
        });
    },
    
}