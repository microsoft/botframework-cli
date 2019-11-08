const mergeLuFiles = require('./../lu/luMerger').Build
const Luis = require('./luis')

class LuisBuilder {
    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<Lu>} luObjArray Array of LU files to be merge
     * @param {boolean} log indicates if we need verbose logging.
     * @param {string} luis_culture LUIS locale code
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(luArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let parsedLUISList = mergedContent.LUISContent.filter(item => item.includeInCollate)
        let result = new Luis();
        if (parsedLUISList.length === 0) return result
        let luisList = []
        parsedLUISList.forEach(i => {
            luisList.push(i.LUISJsonStructure)
        });
        result.collate(luisList)
        return result
    }
}

module.exports = LuisBuilder

