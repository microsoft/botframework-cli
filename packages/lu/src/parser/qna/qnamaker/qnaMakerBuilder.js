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
     * Builds a QnAMaker instance from a KB json.
     * @param {JSON} kbJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromKBJson(kbJson) {
        return new QnAMaker(new KB(kbJson))
    }

    /**
     * Builds a QnAMaker instance from a Alterations Json.
     * @param {JSON} alterationsJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromAlterationsJson(alterationsJson) {
        return new QnAMaker('', new Alterations(alterationsJson))
    }

    /**
     * Builds a QnAMaker instance from a KB and Alterations Json.
     * @param {JSON} kbJson KB json
     * @param {JSON} alterationsJsonson alterations json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromKbAndAlterationsJson(kbJson, alterationsJson) {
        return new QnAMaker(new KB(kbJson), new Alterations(alterationsJson))
    }

    /**
     * Builds a QnAMaker instance from a qna instance.
     * @param {Qna} qnaObject QnA instance
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnA(qnaObject) {
        let parsedContent = await parseFileContents(qnaObject.content, false)
        return new QnAMaker(new KB(parsedContent.qnaJsonStructure), new Alterations(parsedContent.qnaAlterations))
    }

    /**
     * Builds a QnAMaker instance from a qna content.
     * @param {Qna} qnaContent QnA content
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnaContent(qnaContent) {
        let parsedContent = await parseFileContents(qnaContent, false)
        return new QnAMaker(new KB(parsedContent.qnaJsonStructure), new Alterations(parsedContent.qnaAlterations))
    }

    /**
     * Builds a QnAMaker instance from a qna list.
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
