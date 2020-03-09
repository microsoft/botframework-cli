/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const Luis = require('./luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile
const build = require('./luisCollate').build
const LU = require('./../lu/lu')
class LuisBuilder {

    /**
     * Builds a Luis instance from a Luis json.
     * @param {JSON} luisJson Luis json
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static fromJson(luisJson) {
        return new Luis(luisJson)
    }

    /**
     * Builds a Luis instance from a Lu Content.
     * @param {string} luContent LU content
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromContentAsync(luContent) {
        return await parseAndValidateLuFile(luContent)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<LU>} luArray Array of LU files to be merge
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromLUAsync(luArray, luSearchFn) {
        if(!Array.isArray(luArray)){
            if (luArray instanceof LU)
                luArray = new Array(luArray)
            else 
                luArray = new Array(new LU(luArray))
        }
        let parsedContent = await build(luArray, false, '', luSearchFn)
        parsedContent.validate()
        return parsedContent
    }

}

module.exports = LuisBuilder

const parseAndValidateLuFile = async function(luContent, log = undefined, culture = undefined) {
    let parsedContent = await parseFileContents(luContent, log, culture)
    let LUISObj = new Luis(parsedContent.LUISJsonStructure)
    LUISObj.validate()
    return LUISObj
}
