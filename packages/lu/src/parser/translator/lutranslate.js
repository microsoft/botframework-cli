const exception = require('./../utils/exception')
const retCode = require('./../utils/enums/CLI-errors')
const translateHelpers = require('./../lufile/translate-helpers')
const Lu = require('./../lu/lu')
const LUOptions = require('./../lu/luOptions')
const Qna = require('./../lu/qna')
const QNAOptions = require('./../lu/qnaOptions')

module.exports = {
    translateLuList: async function(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        return await translateMarkDownList(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text, true)
    },
    translateLu: async function(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        return await translateMarkDown(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text, true)
    },
    translateQnAList: async function(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        return await translateMarkDownList(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text, false)
    },
    translateQnA: async function(qnaObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        return await translateMarkDown(qnaObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text, false)
    }
}


const translateMarkDownList = async function(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text, isLu) {
    let translation = {}
    let i = 0
    while(files.length > i) {
        let luObject = files[i++]
        try {
            translation[luObject.id] = await translateMarkDown(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text, isLu)      
        } catch (err) {
            throw(err);
        }
     }
    return translation
}

const translateMarkDown =  async function(luObject, translate_key, to_lang, src_lang, translate_comments, translate_link_text, isLu) {
    let parsedLocContent = ''
    let result = []
    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    let toLang = to_lang.split(/[, ]/g)
    for (let idx in toLang) {
        let tgt_lang = toLang[idx].trim();
        if (tgt_lang === '') continue;
        try {
            parsedLocContent = await translateHelpers.parseAndTranslate(luObject.content, translate_key, tgt_lang, src_lang, translate_comments, translate_link_text, false)
        } catch (err) {
            throw(err);
        }
        if (!parsedLocContent) {
            throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, file : ' + file + 'had invalid content'));
        } 

        result.push(isLu ? new Lu(parsedLocContent, new LUOptions(luObject.id, luObject.includeInCollate, tgt_lang)) : new Qna(parsedLocContent, new QNAOptions(luObject.id, luObject.includeInCollate, tgt_lang)))
    }
    return result
}