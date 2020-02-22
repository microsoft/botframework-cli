/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const translateHelpers = require('./../lufile/translate-helpers')

class Qna {
    constructor(content, id, includeInCollate = true, language = ''){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.language = language
    }

    async translate(translate_key, tgt_lang, translate_comments = false, translate_link_text = false){
        this.content = await translateHelpers.parseAndTranslate(this.content, translate_key, tgt_lang, '', translate_comments, translate_link_text, false)
    }
}

module.exports = Qna
