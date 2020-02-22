/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const qnaConverter = require('./qnaConverter')

class QnAMaker {
    constructor(qnaJSON = null) {
        if (qnaJSON) {
            for (let prop in qnaJSON) {
                this[prop] = qnaJSON[prop];
            }
        } else {
            this.urls = [];
            this.qnaList = [];
            this.files = [];
        }
    }

    parseToLuContent() {
        return qnaConverter(this)
   }
}

module.exports = QnAMaker
