/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const Alterations = require('./../alterations/alterations')
const QnAMaker = require('./qnamaker')
const KB = require('./kb')
const build = require('./kbCollate').build
const parseFileContents = require('./../../lufile/parseFileContents').parseFile

class QnABuilder{
    /**
     * Builds a QnAMaker instance from a KB json.
     * @param {JSON} kbJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromKB(kbJson) {
        return new QnAMaker(new KB(kbJson))
    }

    /**
     * Builds a QnAMaker instance from a Alterations Json.
     * @param {JSON} alterationsJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromAlterations(alterationsJson) {
        return new QnAMaker('', new Alterations(alterationsJson))
    }

    /**
     * Builds a QnAMaker instance from a KB and Alterations Json.
     * @param {JSON} kbJson KB json
     * @param {JSON} alterationsJsonson alterations json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromKbAndAlterations(kbJson, alterationsJson) {
        return new QnAMaker(new KB(kbJson), new Alterations(alterationsJson))
    }

    /**
     * Builds a QnAMaker instance from a qna content.
     * @param {Qna} qnaContent QnA content
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async fromContent(qnaContent) {
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
    static async fromQna(qnaObjArray, qnaSearchFn) {
        if(!Array.isArray(qnaObjArray)) {
            new QnAMaker()
        }

        if(qnaObjArray.length === 1){
            let parsedContent = await parseFileContents(qnaObjArray[0].content, false)
            return new QnAMaker(new KB(parsedContent.qnaJsonStructure), new Alterations(parsedContent.qnaAlterations))
        }

        return build(qnaObjArray, false, qnaSearchFn)
    }
}

module.exports = QnABuilder
