/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const mergeLuFiles = require('./../../lu/luMerger').Build
const Alterations = require('./../alterations/alterations')
const QnAMaker = require('./qnamaker')
const KB = require('./kb')
const collate = require('./kbCollate')
const parseFileContents = require('./../../lufile/parseFileContents').parseFile

class QnABuilder{
    /**
     * Builds a Luis instance from a Lu list.
     * @param {JSON} qnamakerJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnaMakerJson(qnamakerJson) {
        return new QnAMaker(new KB(qnamakerJson))
    }

    /**
     * Builds a QnAMaker instance from a QnAMaker list.
     * @param {Qna} qnaObject QnA instance
     * @returns {Luis} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnA(qnaObject) {
        let parsedContent = await parseFileContents(qnaObject.content, false)
        return new QnAMaker(new KB(parsedContent.qnaJsonStructure), new Alterations(parsedContent.qnaAlterations))
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<QnA>} qnaObjArray Array of LU files to be merge
     * @param {function} qnaSearchFn function to retrieve the qna files found in the references
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnAList(qnaObjArray, qnaSearchFn) {
        return this.build(qnaObjArray, false, qnaSearchFn)
    }

    /**
     * Builds a QnAMaker instance from a Qna list.
     * @param {Array<Qna>} qnaObjArray Array of QnA files to be merge
     * @param {boolean} verbose indicates if we need verbose logging.
     * @param {function} qnaSearchFn function to retrieve the lu files found in the references
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(qnaObjArray, verbose, qnaSearchFn) {
        let mergedContent = await mergeLuFiles(qnaObjArray, verbose, '', qnaSearchFn)
        let parsedQnAList = mergedContent.QnAContent.filter(item => item.includeInCollate)

        let qnaList = []
        parsedQnAList.forEach(index =>{
            qnaList.push(index.qnaJsonStructure)
        })
        let kbResult = collate(qnaList)

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
        return new QnAMaker(kbResult, finalQnAAlterationsList)
    }
}

module.exports = QnABuilder
