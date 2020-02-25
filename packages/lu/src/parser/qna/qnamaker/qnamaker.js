/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const KB = require('./kb')
const Alterations = require('./../alterations/alterations')
const QnA = require('./../../lu/qna')

class QnAMaker {
    constructor(kb = null, alterations = null){
        this.kb = kb instanceof KB ? kb : null
        this.alterations = alterations instanceof Alterations ? alterations : null 
    }

    parseToQnAContent() {
        let content = this.kb ? this.kb.parseToLuContent() : ''
        content += this.alterations ? this.alterations.parseToLuContent() : ''
        return content
   }

   parseToQNA() {
       return new QnA(this.parseToQnAContent(), '')
   }
}

module.exports = QnAMaker
