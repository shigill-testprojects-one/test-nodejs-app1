var searchUtils = require('../lib/search-utils');

searchUtils.getSynonyms("hypertension", function(matches) {
    console.log(matches);
});