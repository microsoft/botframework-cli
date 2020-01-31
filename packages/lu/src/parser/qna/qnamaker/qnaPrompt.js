/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class qnaPrompt { 
    /**
     * @property {String} displayOrder
     */
    /**
     * @property {String} qnaId
     */
    /**
     * @property {String} displayText
     */
    /**
     * @property {Boolean} contextonly
     */
    /**
     * @property {qnaList} qna
     */
    constructor(displayText, qnaId, qna, contextOnly = false, displayOrder = 0) {
        this.displayText = displayText ? displayText : undefined;
        this.qnaId = qnaId ? qnaId : undefined;
        this.qna = qna ? qna : undefined;
        this.contextOnly = contextOnly ? contextOnly : false;
        this.displayOrder = displayOrder ? displayOrder : 0;
    }
}

module.exports = qnaPrompt;