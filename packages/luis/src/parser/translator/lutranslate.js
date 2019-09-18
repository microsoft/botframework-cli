const path = require('path')
const fs = require('fs-extra')
const txtfile = require('./../lufile/read-text-file')
const exception = require('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')
const translateHelpers = require('./../lufile/translate-helpers')

module.exports = {
    translateLu: async function(files, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
        let translation = {}
        let i = 0
        while(files.length > i) {
            let file = files[i++] + ''       
            try {
                translation[path.basename(file)] = await parseFile(file, translate_key, to_lang, src_lang, translate_comments, translate_link_text)      
            } catch (err) {
                throw(err);
            }
         }
        return translation
    }
}

/**
 * Helper function to parse, translate and write out localized lu files
 * @param {string} file file name
 * @param {string} translate_key translate text API key
 * @param {string} to_lang language code to translate content to
 * @param {string} src_lang language code for source content
 * @param {boolean} translate_comments translate comments in .lu files if this is set to true
 * @param {boolean} translate_link_text translate URL or LU reference link text in .lu files if this is set to true
 * @returns {void} nothing
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
async function parseFile(file, translate_key, to_lang, src_lang, translate_comments, translate_link_text) {
    if(!fs.existsSync(path.resolve(file))) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry unable to open [' + file + ']'));
    }
    let fileContent = txtfile.readSync(file);
    if (!fileContent) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, error reading file:' + file));
    }

    let parsedLocContent = ''
    let result = {}
    // Support multi-language specification for targets.
    // Accepted formats are space or comma separated list of target language codes.
    // Tokenize to_lang
    let toLang = to_lang.split(/[, ]/g);
    for (idx in toLang) {
        let tgt_lang = toLang[idx].trim();
        if (tgt_lang === '') continue;
        try {
            parsedLocContent = await translateHelpers.parseAndTranslate(fileContent, translate_key, tgt_lang, src_lang, translate_comments, translate_link_text, false, undefined)
        } catch (err) {
            throw(err);
        }
        if (!parsedLocContent) {
            throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, file : ' + file + 'had invalid content'));
        } 
        if (!result[tgt_lang]) {
            result[tgt_lang] = []
        }
        result[tgt_lang].push(parsedLocContent)
        
    }
    return result
}