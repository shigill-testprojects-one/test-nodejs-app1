var StringRef = require('./StringRef');

module.exports = {

    /**
     * Flattens a nested object
     * 
     * @params {object} obj - An object with other nested objects
     * @params {object} mappings - Nested to flat mappings using 
     *      the StringRef notation
     * 
     * @return {object} result - The flattened object
     */

    flatten: function (obj, mappings) {
        var result = {};

        for (i in mappings) {

            var item = mappings[i];
            var ref = new StringRef(item.tag);
            var val = ref.getVal(obj) || '';

            if (val !== '') {

                // Convert to JSON string if field is dynamic
                if (item.dynamic) {
                    val = JSON.stringify(val);
                }

                // Check if above max size for solr
                if (val.length > 32766) {
                    val = '';
                }
            }
            result[item.mapping] = val;
        }
        return result;
    }
}