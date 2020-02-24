/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const KB = require('./kb')
const Alterations = require('./../alterations/alterations')

class QnAMaker {
    constructor(kb = null, alterations = null){
        this.kb = kb instanceof KB ? kb : null
        this.alterations = alterations instanceof Alterations ? alterations : null 
    }

    parseToLuContent() {
        let content = this.kb ? this.kb.parseToLuContent() : ''
        content += this.alterations ? this.alterations.parseToLuContent() : ''
        return content
   }
}

module.exports = QnAMaker
