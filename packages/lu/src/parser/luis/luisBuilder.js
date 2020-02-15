const mergeLuFiles = require('./../lu/luMerger').Build
const Luis = require('./luis')

class LuisBuilder {

    /**
     * Builds a Luis instance from a Lu list.
     * @param {JSON} luisJson Luis json
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLuisJson(luisJson) {
        return new Luis(luisJson)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {LU} luObject LU instance
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLU(luObject) {
        return this.buildFromLUList([luObject])
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<LU>} luArray Array of LU files to be merge
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLUList(luArray, luSearchFn) {
        return this.build(luArray, false, '', luSearchFn)
    }

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
