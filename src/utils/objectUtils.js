// /src/utils/objectUtils.js
// Utility functions for object manipulation
// Used across various modules for common object operations

/** 
 * Filter out undefined fields from an object
 * 
 * @param {Object} inputObj - Object potentially containing undefined values
 * @returns {Object} New object with only defined fields
*/

function filterDefinedFields(inputObj) {
    return Object.fromEntries(
        Object.entries(inputObj).filter(([_, value]) => value !== undefined)
    )
}

module.exports = { filterDefinedFields };