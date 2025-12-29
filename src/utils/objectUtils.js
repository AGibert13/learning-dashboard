// /src/utils/objectUtils.js
// Utility functions for object manipulation
// Used across various modules for common object operations

/** 
 * Return a new object with only the defined fields from the input object
 * Useful for cleaning up request bodies before processing
*/

function filterDefinedFields(inputObj) {
    return Object.fromEntries(
        Object.entries(inputObj).filter(([_, value]) => value !== undefined)
    )
}

module.exports = { filterDefinedFields };