/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const qnaContext = require('./qnaContext');

class qnaList { 
    /**
     * @property {string} id
     */
    /**
     * @property {string} answer
     */
    /**
     * @property {string} source
     */
    /**
     * @property {string []} questions
     */
    /**
     * @property {qnaMetaData []} metadata
     */
    /** 
     * @property {qnaContext} context
     */
    constructor(id, answer, source, questions, metadata, context) {
        this.id = id?id:0;
        this.answer = answer?answer:'';
        this.source = source?source:'custom editorial';
        this.questions = questions?questions:[];
        this.metadata = metadata?metadata:[];
        this.context = context ? context : new qnaContext();
    }
}

module.exports = qnaList;