const path = require('path')
const fs = require('fs-extra')
const txtfile = require('./../lufile/read-text-file')
const exception = require('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')
const translateHelpers = require('./../lufile/translate-helpers')

module.exports = {
    translateLuList: async function(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        let translation = {}
        let i = 0
        while(files.length > i) {
            let luObject = files[i++]
            try {
                translation[path.basename(luObject.id)] = await this.translateLuObj(luObject.content, translate_key, to_lang, src_lang, translate_comments, translate_link_text)      
            } catch (err) {
                throw(err);
            }
         }
        return translation
    },
    translateLuObj: async function(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        let translation = {}
        try {
            translation = await translateLuObject(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text)      
        } catch (err) {
            throw(err);
        }
        return translation
    }
}

async function translateLuObject(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
    let parsedLocContent = ''
    let result = {}
    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    let toLang = to_lang.split(/[, ]/g)
    for (let idx in toLang) {
        let tgt_lang = toLang[idx].trim();
        if (tgt_lang === '') continue;
        try {
            parsedLocContent = await translateHelpers.parseAndTranslate(luObject, translate_key, tgt_lang, src_lang, translate_comments, translate_link_text, false)
        } catch (err) {
            throw(err);
        }
        if (!parsedLocContent) {
            throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, file : ' + file + 'had invalid content'));
        } 

        result[tgt_lang] = parsedLocContent   
    }
    return result
}