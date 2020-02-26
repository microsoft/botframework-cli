/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const translateHelpers = require('./../lufile/translate-helpers')
const luOptions = require('./luOptions')

class Lu {
    constructor(content, options = new luOptions){
        this.content = content
        this.id = options.id ? options.id : ''
        this.includeInCollate = options.includeInCollate !== undefined ? options.includeInCollate : true
        this.language = options.language ? options.language : ''
        this.path = options.path ? options.path : ''

        if (this.language !== '') {
            this.name = this.id + '.' + this.language + '.lu'
        } else {
            this.name = this.id + '.lu'
        }
    }

    async translate(translate_key, tgt_lang, translate_comments = false, translate_link_text = false){
        this.content = await translateHelpers.parseAndTranslate(this.content, translate_key, tgt_lang, '', translate_comments, translate_link_text)
    }
}

module.exports = Lu
