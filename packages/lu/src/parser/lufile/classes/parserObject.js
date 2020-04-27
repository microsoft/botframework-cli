/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const QnA = require('./../../qna/qnamaker/kb');
const LUIS = require('./../../luis/luis');
const qnaAlterations = require('./../../qna/alterations/alterations');
class parserObject {
    /**
     * @property {FileToParse []} additionalFilesToParse
     */
    /**
     * @property {LUIS} LUISJsonStructure
     */
    /**
     * @property {QnA} qnaJsonStructure
     */
    /**
     * @property {qnaAlterations} qnaAlterations
     */
    /**
     * @property {string} srcFile
     */
    /**
     * @property {Boolean} includeInCollate
     */
    constructor() {
        this.additionalFilesToParse = [];
        this.LUISJsonStructure = new LUIS();
        this.qnaJsonStructure = new QnA();
        this.qnaAlterations = new qnaAlterations();
        this.srcFile = undefined;
        this.includeInCollate = true;
    }
}
/**
 * Helper method to create a parser object based on arbitrary attributes passed in.
 * @param {Object} LUISJsonStructure 
 * @param {Object} qnaJsonStructure 
 * @param {Object} lQnaAlterations 
 * @param {Object} srcFile 
 * @param {Object} includeInCollate 
 */
parserObject.create = function(LUISJsonStructure, qnaJsonStructure, lQnaAlterations, srcFile, includeInCollate) {
    let parserObj = new parserObject();
    parserObj.LUISJsonStructure = (LUISJsonStructure || new LUIS());
    parserObj.qnaJsonStructure = (qnaJsonStructure || new QnA());
    parserObj.qnaAlterations = (lQnaAlterations || new qnaAlterations());
    parserObj.srcFile = (srcFile || undefined);
    if(includeInCollate === undefined) parserObj.includeInCollate = true;
    else parserObj.includeInCollate = includeInCollate;
    return parserObj;
}

module.exports = parserObject;