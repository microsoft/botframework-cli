/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const Luis = require('./luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile
const build = require('./luisCollate').build

class LuisBuilder {

    /**
     * Builds a Luis instance from a Luis json.
     * @param {JSON} luisJson Luis json
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromJson(luisJson) {
        return new Luis(luisJson)
    }

    /**
     * Builds a Luis instance from a Lu Content.
     * @param {string} luContent LU content
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromContent(luContent) {
        let parsedContent = await parseFileContents(luContent, false, '')
        return new Luis(parsedContent.LUISJsonStructure)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<LU>} luArray Array of LU files to be merge
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromLU(luArray, luSearchFn) {
        if(!Array.isArray(luArray)){
            return new Luis()
        }

        if(luArray.length === 1){
            let parsedContent = await parseFileContents(luArray[0].content, false, luArray[0].language)
            return new Luis(parsedContent.LUISJsonStructure)
        }

        return build(luArray, false, '', luSearchFn)
    }

}

module.exports = LuisBuilder
