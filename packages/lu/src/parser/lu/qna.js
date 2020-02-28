/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const translateHelpers = require('./../lufile/translate-helpers')
const qnaOptions = require('./qnaOptions')

class Qna {
    constructor(content, options = new qnaOptions()){
        this.content = content
        this.id = options.id ? options.id : ''
        this.includeInCollate = options.includeInCollate !== undefined ? options.includeInCollate : true
        this.language = options.language ? options.language : ''

    }

    async translate(translate_key, tgt_lang, translate_comments = false, translate_link_text = false){
        this.content = await translateHelpers.parseAndTranslate(this.content, translate_key, tgt_lang, '', translate_comments, translate_link_text, false)
    }
}

module.exports = Qna
