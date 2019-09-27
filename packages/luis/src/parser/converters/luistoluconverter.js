const NEWLINE = require('os').EOL;
const fs = require('fs-extra')
const path = require('path')
const txtfile = require('./../lufile/read-text-file')
const luisFile = require('./../luisfile/parseLuisFile')
const helperClasses = require('./../lufile/classes/hclasses')
const exception = require('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')

module.exports = {
    parseLuisFileToLu: async function(file, sort) {
        let LUISFileContent = await openFileAndReadContent(file)
        return await this.parseLuisObjectToLu(LUISFileContent, file, sort)
    },
    parseLuisObjectToLu: async function(luisObjectString, src, sort) {
        let LUISJSON = await parseLuis(luisObjectString, src, sort)
        return await this.constructMdFromLUISJSON(LUISJSON.model)
    },
    /**
     * Construct lu file content from LUIS JSON object
     * @param {object} LUISJSON LUIS JSON object
     * @returns {String} Generated lu content 
     */
    constructMdFromLUISJSON: async function(LUISJSON) {
        let fileContent = '';
        let luisObj = new helperClasses.rLuisObj();
        (LUISJSON.intents || []).forEach(function(intent) {
            luisObj.intents.push(new helperClasses.intent(intent, []));
        });
        // add utterances to luisObj
        updateUtterancesList(LUISJSON.utterances, luisObj.intents, 'text');
        // add patterns to luisObj
        updateUtterancesList(LUISJSON.patterns, luisObj.intents, 'pattern');
        if(luisObj.intents.length >= 0) {
            fileContent += NEWLINE;
            fileContent += '> # Intent definitions' + NEWLINE + NEWLINE;
            // write out intents and utterances..
            luisObj.intents.forEach(function(intent) {
                // Add inherits information if any
                if (intent.intent.inherits !== undefined) {
                    // > !# @intent.inherits = {name = Web.WebSearch; domain_name = Web; model_name = WebSearch}
                    fileContent += '> !# @intent.inherits = name : ' + intent.intent.name;
                    if (intent.intent.inherits.domain_name !== undefined) {
                        fileContent += '; domain_name : ' + intent.intent.inherits.domain_name;
                    }
                    if (intent.intent.inherits.model_name !== undefined) {
                        fileContent += '; model_name : ' + intent.intent.inherits.model_name;
                    }
                    fileContent += NEWLINE + NEWLINE;
                }
                fileContent += '# ' + intent.intent.name + NEWLINE;
                intent.utterances.forEach(function(utterance) {
                    let updatedText = utterance.text;
                    if(utterance.entities.length >= 0) {
                        // update utterance for each entity
                        let text = utterance.text;
                        let sortedEntitiesList = objectSortByStartPos(utterance.entities);
                        let tokenizedText = text.split('');
                        let nonCompositesInUtterance = sortedEntitiesList.filter(entity => LUISJSON.composites.find(composite => composite.name == entity.entity) == undefined);
                        nonCompositesInUtterance.forEach(entity => {
                            if (entity.role !== undefined) {
                                tokenizedText[parseInt(entity.startPos)] = `{${entity.entity}:${entity.role}=${tokenizedText[parseInt(entity.startPos)]}`;    
                            } else {
                                tokenizedText[parseInt(entity.startPos)] = `{${entity.entity}=${tokenizedText[parseInt(entity.startPos)]}`;    
                            }
                            tokenizedText[parseInt(entity.endPos)] += `}`;
                        })
                        let compositeEntitiesInUtterance = sortedEntitiesList.filter(entity => LUISJSON.composites.find(composite => composite.name == entity.entity) != undefined);
                        compositeEntitiesInUtterance.forEach(entity => {
                            if (entity.role !== undefined) {
                                tokenizedText[parseInt(entity.startPos)] = `{${entity.entity}:${entity.role}=${tokenizedText[parseInt(entity.startPos)]}`;
                            } else {
                                tokenizedText[parseInt(entity.startPos)] = `{${entity.entity}=${tokenizedText[parseInt(entity.startPos)]}`;
                            }
                            tokenizedText[parseInt(entity.endPos)] += `}`;
                        })
                        updatedText = tokenizedText.join(''); 
                    }
                    if(updatedText) fileContent += '- ' + updatedText + NEWLINE;
                });
                fileContent += NEWLINE + NEWLINE;
            });
        }
        
        if(LUISJSON.entities && LUISJSON.entities.length >= 0) {
            fileContent += '> # Entity definitions' + NEWLINE + NEWLINE;
            LUISJSON.entities.forEach(function(entity) {
                // Add inherits information if any
                if (entity.inherits !== undefined) {
                    // > !# @intent.inherits = {name = Web.WebSearch; domain_name = Web; model_name = WebSearch}
                    fileContent += '> !# @entity.inherits = name : ' + entity.name;
                    if (entity.inherits.domain_name !== undefined) {
                        fileContent += '; domain_name : ' + entity.inherits.domain_name;
                    }
                    if (entity.inherits.model_name !== undefined) {
                        fileContent += '; model_name : ' + entity.inherits.model_name;
                    }
                    fileContent += NEWLINE + NEWLINE;
                }
                fileContent += '$' + entity.name + ':simple';
                if (entity.roles.length > 0) {
                    fileContent += ` Roles=${entity.roles.join(', ')}`;
                }
                fileContent += NEWLINE + NEWLINE;
            });
            fileContent += NEWLINE;
        }
    
        if(LUISJSON.prebuiltEntities && LUISJSON.prebuiltEntities.length >= 0){
            fileContent += '> # PREBUILT Entity definitions' + NEWLINE + NEWLINE;
            LUISJSON.prebuiltEntities.forEach(function(entity) {
                fileContent += '$PREBUILT:' + entity.name;
                if (entity.roles.length > 0) {
                    fileContent += ` Roles=${entity.roles.join(', ')}`;
                }
                fileContent += NEWLINE + NEWLINE;
            });
            fileContent += NEWLINE;
        }
        
        if(LUISJSON.model_features && LUISJSON.model_features.length >= 0) {
            fileContent += '> # Phrase list definitions' + NEWLINE + NEWLINE;
            LUISJSON.model_features.forEach(function(entity) {
                fileContent += '$' + entity.name + ':phraseList' + (entity.mode ? ' interchangeable' : '') + NEWLINE;
                fileContent += '- ' + entity.words + NEWLINE;
            });
            fileContent += NEWLINE;
        }
        if(LUISJSON.closedLists && LUISJSON.closedLists.length >= 0){
            fileContent += '> # List entities' + NEWLINE + NEWLINE;
            LUISJSON.closedLists.forEach(function(ListItem) {
                ListItem.subLists.forEach(function(list) {
                    fileContent += '$' + ListItem.name + ':' + list.canonicalForm + '=';
                    if (ListItem.roles.length > 0) {
                        fileContent += ` Roles=${ListItem.roles.join(', ')}`;
                    }
                    fileContent += NEWLINE;
                    list.list.forEach(function(listItem) {
                        fileContent += '- ' + listItem + NEWLINE;
                    });
                    fileContent += NEWLINE;
                });
                fileContent += NEWLINE + NEWLINE;
            });
        }

        if(LUISJSON.regex_entities && LUISJSON.regex_entities.length >= 0) {
            fileContent += '> # RegEx entities' + NEWLINE + NEWLINE; 
            LUISJSON.regex_entities.forEach(function(regExEntity) {
                fileContent += '$' + regExEntity.name + ':/' + regExEntity.regexPattern + '/';
                if (regExEntity.roles.length > 0) {
                    fileContent += ` Roles=${regExEntity.roles.join(', ')}`;
                }
                fileContent += NEWLINE;
            });
            fileContent += NEWLINE;
        }

        // add composite entities if found in source LUIS JSON
        if(LUISJSON.composites && LUISJSON.composites.length > 0) {
            fileContent += '> # Composite entities' + NEWLINE + NEWLINE; 
            LUISJSON.composites.forEach(composite => {
                fileContent += '$' + composite.name + ':[' + composite.children.join(', ') + ']';
                if (composite.roles.length > 0) {
                    fileContent += ` Roles=${composite.roles.join(', ')}`;
                }
                fileContent += NEWLINE;
            })
        }
        return fileContent;
    }
}

const parseLuis = async function(luisObject, src, sort){
    let LUISJSON = new helperClasses.readerObject()
    LUISJSON.model = await luisFile.parseLuisJson(luisObject)

    if (!LUISJSON.model) {
        throw (new exception(retCode.errorCode.FILE_OPEN_ERROR, 'No input Luis content found  '));
    }
    LUISJSON.sourceFile = src
    if (sort) {
        await sortLUISJSON(LUISJSON.model)
    }
    return LUISJSON
}

const openFileAndReadContent = async function(file) {
    // catch if input file is a folder
    if(fs.lstatSync(file).isDirectory()) {
        throw (new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, "' + file + '" is a directory! Please try a LUIS/ QnA Maker JSON file as input.'));
    }
    if(!fs.existsSync(path.resolve(file))) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry unable to open [' + file + ']'));
    }
    let fileContent = txtfile.readSync(file);
    if (!fileContent) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, error reading file: ' + file));
    }
    return fileContent;
}

/**
 * helper function to add utterances to collection if it does not exist
 * @param {object[]} tgtCollection target collection of utterance objects
 * @param {object []} srcCollection source collection of utterance objects
 * @param {string} attribute attribute to check on and copy over
 * @returns {void}
 */
const updateUtterancesList = function (srcCollection, tgtCollection, attribute) {
    (srcCollection || []).forEach(srcItem => {
        let matchInTarget = tgtCollection.find(item => item.intent.name == srcItem.intent);
        if(matchInTarget.utterances.length === 0) {
            addUtteranceToCollection(attribute, srcItem, matchInTarget);
            return;
        }
        if(!matchInTarget.utterances.find(item => item.text == srcItem[attribute])) {
            addUtteranceToCollection(attribute, srcItem, matchInTarget);
            return;
        }
    });
}
/**
 * helper function to add utterances to collection based on src type (pattern or utterance)
 * @param {string} attribute attribute to check on and copy over
 * @param {object} srcItem source object
 * @param {object []} matchInTarget target collection of objects
 * @returns {void}
 */
const addUtteranceToCollection = function (attribute, srcItem, matchInTarget) {
    if(attribute === 'text') {
        matchInTarget.utterances.push(srcItem); 
    } else {
        matchInTarget.utterances.push(new helperClasses.uttereances(srcItem.pattern,srcItem.intent,[]));
    }
}

/**
 * helper function sort entities list by starting position
 * @param {object} objectArray array of entity objects
 * @returns {object} sorted entities array by start position
 */
const objectSortByStartPos = function (objectArray) {
    let ObjectByStartPos = objectArray.slice(0);
    ObjectByStartPos.sort(function(a,b) {
        return a.startPos - b.startPos;
    });
    return ObjectByStartPos;
}

constructModelDescFromLUISJSON = async function(LUISJSON) {
    let modelDesc = NEWLINE;
    modelDesc += '> LUIS application information' + NEWLINE;
    modelDesc += '> !# @app.name = ' + LUISJSON.name + NEWLINE;
    modelDesc += '> !# @app.desc = ' + LUISJSON.desc + NEWLINE;
    modelDesc += '> !# @app.culture = ' + LUISJSON.culture + NEWLINE;
    modelDesc += '> !# @app.versionId = ' + LUISJSON.versionId + NEWLINE;
    modelDesc += '> !# @app.luis_schema_version = ' + LUISJSON.luis_schema_version + NEWLINE;
    return modelDesc;
}

/**
 * Helper function to return sorted LUIS JSON model
 * @param {Object} LUISJSON 
 */
const sortLUISJSON = async function(LUISJSON) {
    // sort intents first
    try {
        LUISJSON.intents.sort(sortComparers.compareNameFn);
        LUISJSON.composites.sort(sortComparers.compareNameFn);
        LUISJSON.entities.sort(sortComparers.compareNameFn);
        LUISJSON.closedLists.sort(sortComparers.compareNameFn);
        LUISJSON.regex_entities.sort(sortComparers.compareNameFn);
        LUISJSON.model_features.sort(sortComparers.compareNameFn);
        LUISJSON.patternAnyEntities.sort(sortComparers.compareNameFn);
        LUISJSON.prebuiltEntities.sort(sortComparers.compareNameFn);
        LUISJSON.utterances.sort(sortComparers.compareIntentFn);
    } catch (e) {
        throw (new exception(retCode.errorCode.INVALID_INPUT, 'Sorry, invalid LUIS json object'));
    }
}

const sortComparers = { 
    compareNameFn : function(a, b) {
        return compareString(a.name.toUpperCase(), b.name.toUpperCase())
    },    
    compareIntentFn : function(a, b) {
        return compareString(a.intent.toUpperCase(), b.intent.toUpperCase())
    }
}

const compareString = function(a, b) {
    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;
}