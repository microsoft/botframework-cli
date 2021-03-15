/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fetch = require('node-fetch');
const PARSERCONSTS = require('./../utils/enums/parserconsts');
const retCode = require('./../utils/enums/CLI-errors');
const chalk = require('chalk');
const exception = require('./../utils/exception');
const helpers = require('./../utils/helpers');
const NEWLINE = require('os').EOL;
const MAX_TRANSLATE_BATCH_SIZE = 25;
const MAX_CHAR_IN_REQUEST = 4990;

const translateHelpers = {
    translationSettings : class {
        subscriptionKey = '';
        to_lang = '';
        src_lang = '';
        translate_comments = false;
        translate_link_text = false;
        log = false;
        batch_translate = MAX_TRANSLATE_BATCH_SIZE;
        region = '';
    },
    /**
     * Helper function to parseAndTranslate lu file content
     * @param {string} fileContent file content
     * @param {string} subscriptionKey translate text API key
     * @param {string} to_lang language code to translate content to
     * @param {string} src_lang language code for source content
     * @param {boolean} translate_comments translate comments in .lu files if this is set to true
     * @param {boolean} translate_link_text translate URL or LU reference link text in .lu files if this is set to true
     * @param {boolean} log indicates if this function should write verbose messages to process.stdout
     * @param {number} batch_translate indicates number of input lines to batch up before calling translation API
     * @returns {string} Localized file content
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    parseAndTranslate : async function(fileContent, ts) {
        const initializeTS = new this.translationSettings();
        const translationSettings = {...initializeTS, ...ts};
        let batch_translate_size = translationSettings.batch_translate;
        fileContent = helpers.sanitizeNewLines(fileContent);
        let linesInFile = fileContent.split(NEWLINE);
        let linesToTranslate = [];
        let localizedContent = '';
        let currentSectionType = '';
        let inAnswer = false;
        let lineCtr = 0;
        for(let lineIndex in linesInFile) {
            lineCtr++;
            let currentLine = linesInFile[lineIndex].trim();
            // is current line a comment? 
            if(currentLine.indexOf(PARSERCONSTS.COMMENT) === 0) {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                if(translationSettings.translate_comments) {
                    addSegment(linesToTranslate, currentLine.charAt(0), false);
                    addSegment(linesToTranslate, currentLine.substring(1), true);
                } else {
                    addSegment(linesToTranslate, currentLine, false);
                }
            } else if (currentLine.indexOf(PARSERCONSTS.FILTER) === 0) {
                addSegment(linesToTranslate, currentLine, false);
                currentSectionType = PARSERCONSTS.FILTER;
            } else if (currentLine.indexOf(PARSERCONSTS.INTENT) === 0) {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                let intentName = currentLine.substring(currentLine.indexOf(' ') + 1).trim();
                //is this a QnA? 
                if(intentName.indexOf(PARSERCONSTS.QNA) === 0) {
                    let beforeQuestion = currentLine.substring(0, currentLine.indexOf(' ') + 1);
                    let question = intentName.slice(1).trim();
                    addSegment(linesToTranslate, beforeQuestion + '? ', false);
                    addSegment(linesToTranslate, question, true);
                    currentSectionType = PARSERCONSTS.QNA;
                } else {
                    // we would not localize intent name but remember we are under intent section
                    currentSectionType = PARSERCONSTS.INTENT;
                    addSegment(linesToTranslate, currentLine, false);
                }
            } else if(currentLine.indexOf('-') === 0 || 
                    currentLine.indexOf('*') === 0 || 
                    currentLine.indexOf('+') === 0 ) {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                // Fix for #1191. Do not localize meta-data filters for QnA.
                if (currentSectionType === PARSERCONSTS.FILTER) {
                    addSegment(linesToTranslate, currentLine, false);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                let listSeparator = '';
                let content = '';
                switch (currentSectionType) {
                case PARSERCONSTS.INTENT: 
                listSeparator = currentLine.charAt(0);
                addSegment(linesToTranslate, listSeparator + ' ', false);
                content = currentLine.slice(1).trim();
                let skipChars = ['{', '}', '(', ')', '[', ']', '|', '='] 
                for (let i = 0; i < content.length; i++) {
                    let processedText = ''
                    let tslt = false
                    if (!skipChars.includes(content.charAt(i))) {  
                        for (let j = i; j < content.length && !skipChars.includes(content.charAt(j)); j++) {
                            processedText += content.charAt(j)
                        } 
                        tslt = true  
                    } else if (content.charAt(i) == '{') {
                        for (let j = i; j < content.length && (content.charAt(j) !== '=' && content.charAt(j) !== '}'); j++) {
                            processedText += content.charAt(j)
                        }
                    } else {
                        processedText += content.charAt(i)
                    }

                    if (processedText.charAt(0) === ' ') {
                        addSegment(linesToTranslate, ' ', false)
                    }
                    
                    addSegment(linesToTranslate, processedText, tslt)
                    content = content.slice(processedText.length)
                    i--
                }
                break;
                case PARSERCONSTS.NEWENTITY:
                    // if current line is a normalized value, add it to the list to localize// strip line of the list separator
                    listSeparator = currentLine.charAt(0);
                    content = currentLine.slice(1).trim();
                    if (content.trim().endsWith(':')) {
                        let normalizedValueAsSynonym = content.replace(/:$/g, '').trim();
                        addSegment(linesToTranslate, `\t- ${normalizedValueAsSynonym}:`, false);
                        addSegment(linesToTranslate, NEWLINE, false);
                        addSegment(linesToTranslate, '\t\t- ', false);
                        addSegment(linesToTranslate, normalizedValueAsSynonym, true);
                    } else {
                        addSegment(linesToTranslate, '\t\t- ', false);
                        addSegment(linesToTranslate, content, true);
                    }
                    break;
                case PARSERCONSTS.ENTITY:
                case PARSERCONSTS.QNA:
                default:
                    // strip line of the list separator
                    listSeparator = currentLine.charAt(0);
                    content = currentLine.slice(1).trim();
                    addSegment(linesToTranslate, listSeparator + ' ', false);
                    addSegment(linesToTranslate, content, true);
                    break;
                }
            } else if(currentLine.indexOf(PARSERCONSTS.ENTITY) === 0) {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                // we need to localize qna alterations if specified.
                let entityDef = currentLine.replace(PARSERCONSTS.ENTITY, '').split(':');
                let entityName = entityDef[0];
                let entityType = entityDef[1];
                if(entityType.includes(PARSERCONSTS.QNAALTERATIONS)) {
                    addSegment(linesToTranslate, '$', false);
                    addSegment(linesToTranslate, entityName.trim(), true);
                    addSegment(linesToTranslate, ' : ' + PARSERCONSTS.QNAALTERATIONS + ' = ', false);
                } else {
                    // we would not localize entity line but remember we are under entity section for list entities
                    // FIX for BF CLI # 121
                    // If list entity, add normalized value to list of synonyms to translate.
                    addSegment(linesToTranslate, currentLine, false);
                    if (entityType.trim().endsWith('=')) {
                        addSegment(linesToTranslate, NEWLINE, false);
                        let normalizedValueAsSynonym = entityType.replace('=', '').trim();
                        addSegment(linesToTranslate, '- ', false);
                        addSegment(linesToTranslate, normalizedValueAsSynonym, true);
                    } 
                }
            } else if(currentLine.indexOf(PARSERCONSTS.ANSWER) === 0) {
                if (inAnswer) {
                    let answerData = '';
                }
                addSegment(linesToTranslate, currentLine, false);
                inAnswer = !inAnswer;
                currentSectionType = PARSERCONSTS.ANSWER;
            } else if (currentLine.indexOf(PARSERCONSTS.URLORFILEREF) ===0) {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
                currentSectionType = PARSERCONSTS.URLORFILEREF;
                if(translationSettings.translate_link_text) {
                    const linkValueRegEx = new RegExp(/\(.*?\)/g);
                    let linkValueList = currentLine.trim().match(linkValueRegEx);
                    let linkValue = linkValueList[0].replace('(','').replace(')','');
                    const linkTextRegEx = new RegExp(/\[.*\]/g);
                    let linkTextList = currentLine.trim().match(linkTextRegEx);
                    let linkTextValue = linkTextList[0].replace('[','').replace(']','');
                    addSegment(linesToTranslate, '[', false);
                    addSegment(linesToTranslate, linkTextValue, true);
                    addSegment(linesToTranslate, ']', false);
                    addSegment(linesToTranslate, '(' + linkValue + ')', false);
                } else {
                    addSegment(linesToTranslate, currentLine, false);
                }
            } else if(currentLine === '') {
                if (inAnswer) {
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                }
            } else if(currentLine.indexOf(PARSERCONSTS.NEWENTITY) === 0) {
                // Nothing in the entity line should be localized.
                addSegment(linesToTranslate, currentLine, false);
                currentSectionType = PARSERCONSTS.NEWENTITY;
            } else {
                if (inAnswer) {
                    addSegment(linesToTranslate, currentLine, true);
                    addSegment(linesToTranslate, NEWLINE, false);
                    continue;
                } else {
                    throw(new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Error: Unexpected line encountered when parsing \n' + '[' + lineIndex + ']:' + currentLine));
                }
            }
            addSegment(linesToTranslate, NEWLINE, false);
            // do we have any payload to localize? and have we hit the batch size limit?
            if ((linesToTranslate.length !== 0) && (lineCtr % batch_translate_size === 0)) {
                try {
                    localizedContent += await batchTranslateText(linesToTranslate, translationSettings);
                    linesToTranslate = [];
                } catch (err) {
                    throw (err)
                }
            }
        }
        if (linesToTranslate.length !== 0) {
            try {
                localizedContent += await batchTranslateText(linesToTranslate, translationSettings);
                linesToTranslate = [];
            } catch (err) {
                throw (err)
            }
        }
        return localizedContent;
    },
    
    
    
    /**
     * Helper function to call MT rest API to translate content
     * @param {string} text Text to translate
     * @param {string} subscriptionKey user provided subscription to text translation API
     * @param {string} to_lang target language to localize to
     * @param {string} from_lang source language of text
     * @returns {object} response from MT call.
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    translateText: async function(text, translationSettings) {
        let payload = Array.isArray(text) ? text : [{'Text' : text}];
        let tUri = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' + translationSettings.to_lang + '&includeAlignment=true';
        if(translationSettings.src_lang) tUri += '&from=' + translationSettings.src_lang;
        const options = {
            method: 'POST',
            body: JSON.stringify (payload),
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : translationSettings.subscriptionKey,
                'X-ClientTraceId' : get_guid (),
            }
        };

        if (translationSettings.region) {
            options.headers['Ocp-Apim-Subscription-Region'] = translationSettings.region
        }

        const res = await fetch(tUri, options);
        if (!res.ok) {
            throw(new exception(retCode.errorCode.TRANSLATE_SERVICE_FAIL,'Text translator service call failed with [' + res.status + '] : ' + res.statusText + '.\nPlease check key & language code validity'));
        }
        let data = await res.json();
        return data;
    }
};
/**
 * Helper function to break down input string if it is longer than MAX_CHAR_IN_REQUEST to translate API
 * @param {translateLine []} linesToTranslate Array of translateLine objects
 * @param {string} text text to translate
 * @param {boolean} localize indicates if the request should be localized or not.
 * @returns {void} 
 */
const addSegment = function (linesToTranslate, text, localize) {
    if (text.length >= MAX_CHAR_IN_REQUEST) {
        // break it up into smaller segments and add it to the batchRequest payload
        let splitRegExp = new RegExp(`(.{${MAX_CHAR_IN_REQUEST}})`);
        let splitLine = text.split(splitRegExp).filter(O => O);
        splitLine.forEach(item => {
            linesToTranslate.push(new translateLine(item, localize));
        })
    } else {
        linesToTranslate.push(new translateLine(text, localize));
    }
};
/**
 * Helper function to batch calls to translate API
 * @param {translateLine []} linesToTranslate Array of translateLine objects
 * @param {string} subscriptionKey translate text API key
 * @param {string} to_lang language code to translate content to
 * @param {string} src_lang language code for source content
 * @param {boolean} log indicates if this function should write verbose messages to process.stdout
 * @returns {string} translated content
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const batchTranslateText = async function(linesToTranslate, translationSettings) {
    // responsible for breaking localizable text into chunks that are 
    // - not more than 5000 characters in combined length 
    // - not more than 25 segments in one chunk
    let retValue = '';
    if (!Array.isArray(linesToTranslate) || linesToTranslate.length === 0) return retValue;
    let charCountInChunk = 0;
    let batchTranslate = [];
    for (var idx in linesToTranslate) {
        let item = linesToTranslate[idx];
        if (item.text.length + charCountInChunk >= MAX_CHAR_IN_REQUEST) {
            await translateAndMap(batchTranslate, linesToTranslate, translationSettings);
            batchTranslate = [];
            charCountInChunk = 0;
        }
        let currentBatchSize = batchTranslate.length > 0 ? batchTranslate.length : 1;
        if (currentBatchSize % MAX_TRANSLATE_BATCH_SIZE === 0) {
            await translateAndMap(batchTranslate, linesToTranslate, translationSettings);
            batchTranslate = [];
            charCountInChunk = 0;
        }
        if (item.localize) {
            item.idx = batchTranslate.length; 
            batchTranslate.push({'Text': item.text});
            charCountInChunk += item.text.length;
        }
    }
    if (batchTranslate.length !== 0) {
        await translateAndMap(batchTranslate, linesToTranslate, translationSettings);
        batchTranslate = [];
        charCountInChunk = 0;
    }
    linesToTranslate.forEach(item => retValue += item.text);
    if(translationSettings.log) process.stdout.write(chalk.default.gray(retValue));
    return retValue;
};

/**
 * Helper function to call translate and update text with localized result
 * @param {object []} batchRequest Array of {'Text':'value'} objects
 * @param {string} subscriptionKey translate text API key
 * @param {string} to_lang language code to translate content to
 * @param {string} src_lang language code for source content
 * @param {translateLine []} linesToTranslateCopy Array of translateLine objects
 * @returns {void} 
 */
const translateAndMap = async function (batchRequest, linesToTranslateCopy, translationSettings) {
    if (batchRequest.length === 0) return;
    let data;
    data = await translateHelpers.translateText(batchRequest, translationSettings);
    data.forEach((item, idx) => {
        // find the correponding item in linesToTranslate
        let itemInLine = linesToTranslateCopy.find(item => item.idx === idx);
        if (itemInLine) {
            itemInLine.text = item.translations[0].text;
            itemInLine.idx = -1;        
        }
    });
};

/**
 * Helper function to create a random guid
  * @returns {string} GUID
 */
const get_guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class translateLine{
    constructor(text, localize, idx) {
        this.text = text ? text: '';
        this.localize = localize ? localize : false;
        this.idx = idx ? idx : -1;
    }
}

module.exports = translateHelpers;
