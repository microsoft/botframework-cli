/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const Alterations = require('./alterations')
const mergeLuFiles = require('./../../lu/luMerger').Build
const parseFileContents = require('./../../lufile/parseFileContents').parseFile

class AlterationsBuilder {
    
    static async buildFromQnA(qnaObject) {
        let parsedContent = await parseFileContents(qnaObject.content, false, '')
        return new Alterations(parsedContent.qnaAlterations)
    }

    /**
     * Builds a QnAMaker instance from a Qna list.
     * @param {Array<Qna>} qnaObjArray Array of QnA files to be merge
     * @param {boolean} verbose indicates if we need verbose logging.
     * @param {string} luis_culture LUIS locale code
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Alterations} new Alterations instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(qnaObjArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(qnaObjArray, verbose, luis_culture, luSearchFn)
        let allParsedQnAAlterations = mergedContent.QnAAlterations.filter(item => item.includeInCollate)

        let finalQnAAlterationsList = new Alterations()
        allParsedQnAAlterations.forEach(function (alterationList) {
            alterationList = alterationList.qnaAlterations;
            if (alterationList.wordAlterations) {
                alterationList.wordAlterations.forEach(function (alteration) {
                    finalQnAAlterationsList.wordAlterations.push(alteration);
                })
            }
        })
        return finalQnAAlterationsList;
    }
}

module.exports = AlterationsBuilder