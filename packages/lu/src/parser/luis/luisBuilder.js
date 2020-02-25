/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const mergeLuFiles = require('./../lu/luMerger').Build
const Luis = require('./luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile
const collate = require('./luisCollate')

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
        let parsedContent = await parseFileContents(luObject.content, false, luObject.language)
        return new Luis(parsedContent.LUISJsonStructure)
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
        if (parsedLUISList.length === 0) return new Luis()
        let luisList = []
        parsedLUISList.forEach(i => {
            luisList.push(i.LUISJsonStructure)
        });
        return collate(luisList)
    }
}

module.exports = LuisBuilder


