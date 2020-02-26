/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const translateHelpers = require('./../lufile/translate-helpers')

class Lu {
    constructor(content, id, includeInCollate = true, language = '', path = ''){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.language = language
        this.path = path

        if (this.language !== '') {
            this.name = id + '.' + this.language + '.lu'
        } else {
            this.name = id + '.lu'
        }
    }

    async translate(translate_key, tgt_lang, translate_comments = false, translate_link_text = false){
        this.content = await translateHelpers.parseAndTranslate(this.content, translate_key, tgt_lang, '', translate_comments, translate_link_text)
    }
}

module.exports = Lu
