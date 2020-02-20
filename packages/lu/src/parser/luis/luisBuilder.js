/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const deepEqual = require('deep-equal')
const mergeLuFiles = require('./../lu/luMerger').Build
const LUISObjNameEnum = require('./../utils/enums/luisobjenum')
const Luis = require('./luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile
const helpers = require('./../utils/helpers')

class LuisBuilder {

    /**
     * Builds a Luis instance from a Lu list.
     * @param {JSON} luisJson Luis json
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLuisJson(luisJson) {
        return new Luis(luisJson)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {LU} luObject LU instance
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLU(luObject) {
        let parsedContent = await parseFileContents(luObject.content, false)
        return new Luis(parsedContent.LUISJsonStructure)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<LU>} luArray Array of LU files to be merge
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromLUList(luArray, luSearchFn) {
        return this.build(luArray, false, '', luSearchFn)
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<Lu>} luObjArray Array of LU files to be merge
     * @param {boolean} log indicates if we need verbose logging.
     * @param {string} luis_culture LUIS locale code
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {Luis} new Luis instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(luArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let parsedLUISList = mergedContent.LUISContent.filter(item => item.includeInCollate)
        if (parsedLUISList.length === 0) return new Luis()
        let luisList = []
        parsedLUISList.forEach(i => {
            luisList.push(i.LUISJsonStructure)
        });
        return collate(luisList)
    }
}

module.exports = LuisBuilder

/**
 * Collates a list of Luis instances into one.
 * @param {Array<Luis>} luisList Array of Luis instances to be collate
 * @param {Luis} luisObject Luis instances to collate with
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const collate = function(luisList) {
    let hashTable = {};
    if (luisList.length === 0) return
    let luisObject = new Luis(luisList[0])
    luisList.splice(0, 1)
    initializeHash(luisObject, hashTable)
    for(let i = 0; i < luisList.length; i++) {
        let blob = luisList[i]
        mergeResults(blob, luisObject, LUISObjNameEnum.INTENT);
        mergeResults(blob, luisObject, LUISObjNameEnum.ENTITIES);
        mergeResults_closedlists(blob, luisObject, LUISObjNameEnum.CLOSEDLISTS);
        mergeResults(blob, luisObject, LUISObjNameEnum.PATTERNANYENTITY);
        mergeResultsWithHash(blob, luisObject, LUISObjNameEnum.UTTERANCE, hashTable);
        mergeResultsWithHash(blob, luisObject, LUISObjNameEnum.PATTERNS, hashTable);
        buildRegex(blob, luisObject)
        buildPrebuiltEntities(blob, luisObject)
        buildModelFeatures(blob, luisObject)
        buildComposites(blob, luisObject)
        buildPatternAny(blob, luisObject)
    }
    helpers.checkAndUpdateVersion(luisObject)
    return luisObject
}

const mergeResultsWithHash = function (blob, finalCollection, type, hashTable) {
    if (blob[type].length === 0) { 
        return
    }
    blob[type].forEach(function (blobItem) {
        // add if this item if it does not already exist by hash look up.
        let hashCode = helpers.hashCode(JSON.stringify(blobItem));
        if (!hashTable[hashCode]) {
            finalCollection[type].push(blobItem);
            hashTable[hashCode] = blobItem;
        } else {
            let item = hashTable[hashCode];

            if (type !== LUISObjNameEnum.INTENT &&
                type !== LUISObjNameEnum.PATTERNS &&
                type !== LUISObjNameEnum.UTTERANCE &&
                item.name === blobItem.name) {
                    // merge roles
                    (blobItem.roles || []).forEach(blobRole => {
                        if (item.roles && 
                            !item.roles.includes(blobRole)) {
                                item.roles.push(blobRole);
                            }
                    });
            }            
        }
    });
}

/**
 * Helper function to merge item if it does not already exist
 *
 * @param {object} blob Contents of all parsed file blobs
 * @param {object} finalCollection Reference to the final collection of items
 * @param {LUISObjNameEnum} type Enum type of possible LUIS object types
 * @returns {void} Nothing
 */
const mergeResults = function (blob, finalCollection, type) {
    if (blob[type].length === 0) { 
        return
    }
    blob[type].forEach(function (blobItem) {
        if (finalCollection[type].length === 0) {
            finalCollection[type].push(blobItem);
            return;
        }
        // add if this item if it does not already exist in final collection
        let itemExists = false;
        for (let fIndex in finalCollection[type]) {
            if (deepEqual(finalCollection[type][fIndex], blobItem)) {
                itemExists = true;
                break;
            } 

            // if item name matches, merge roles if available for everything other than intent
            if (type === LUISObjNameEnum.INTENT || 
                type === LUISObjNameEnum.PATTERNS || 
                type === LUISObjNameEnum.UTTERANCE ||
                finalCollection[type][fIndex].name !== blobItem.name) {
                    continue;
            }
    
            itemExists = true;
            (blobItem.roles || []).forEach(blobRole => {
                if (finalCollection[type][fIndex].roles && 
                    !finalCollection[type][fIndex].roles.includes(blobRole)) {
                        finalCollection[type][fIndex].roles.push(blobRole);
                }
            });
       
        }
        if (!itemExists) {
            finalCollection[type].push(blobItem);
        }
    });

}

/**
 * Helper function to merge closed list item if it does not already exist
 *
 * @param {object} blob Contents of all parsed file blobs
 * @param {object} finalCollection Reference to the final collection of items
 * @param {LUISObjNameEnum} type Enum type of possible LUIS object types
 * @returns {void} nothing
 */
const mergeResults_closedlists = function (blob, finalCollection, type) {
    if (blob[type].length === 0) {
        return
    }

    blob[type].forEach(function (blobItem) {
        let listInFinal = helpers.filterMatch(finalCollection[type], 'name', blobItem.name);
        if (listInFinal.length === 0) {
            finalCollection[type].push(blobItem);
        } else {
            blobItem.subLists.forEach(function (blobSLItem) {
                // see if there is a sublist match in listInFinal
                let slInFinal = helpers.filterMatch(listInFinal[0].subLists, 'canonicalForm', blobSLItem.canonicalForm);
                if (slInFinal.length === 0) {
                    listInFinal[0].subLists.push(blobSLItem);
                } else {
                    // there is a canonical form match. See if the values all exist
                    blobSLItem.list.forEach(function (listItem) {
                        if (!slInFinal[0].list.includes(listItem)) slInFinal[0].list.push(listItem);
                    })
                }
            });

            // merge roles if they are different
            (blobItem.roles || []).forEach(blobRole => {
                if (!listInFinal[0].roles.includes(blobRole)) {
                    listInFinal[0].roles.push(blobRole);
                }
            })
        }
    });
}

const buildRegex = function(blob, FinalLUISJSON){
    // do we have regex entities here?
    if (blob.regex_entities.length === 0) {
        return
    }
    blob.regex_entities.forEach(function (regexEntity) {
        // do we have the same entity in final?
        let entityExistsInFinal = (FinalLUISJSON.regex_entities || []).find(item => item.name == regexEntity.name);
        if (entityExistsInFinal === undefined) {
            FinalLUISJSON.regex_entities.push(regexEntity);
        } else {
            // verify that the pattern is the same
            if (entityExistsInFinal.regexPattern !== regexEntity.regexPattern) {
                throw (new exception(retCode.errorCode.INVALID_REGEX_ENTITY, `[ERROR]: RegEx entity : ${regexEntity.name} has inconsistent pattern definitions. \n 1. ${regexEntity.regexPattern} \n 2. ${entityExistsInFinal.regexPattern}`));
            }
            // merge roles
            if (entityExistsInFinal.roles.length > 0) {
                (regexEntity.roles || []).forEach(function (role) {
                    if (!entityExistsInFinal.roles.includes(role))
                        entityExistsInFinal.roles.push(role);
                })
            }
        }
    })
}

const buildPrebuiltEntities = function(blob, FinalLUISJSON){
    // do we have prebuiltEntities here?
    if (blob.prebuiltEntities.length === 0) {
        return
    }
    blob.prebuiltEntities.forEach(function (prebuiltEntity) {
        let prebuiltTypeExists = false;
        for (let fIndex in FinalLUISJSON.prebuiltEntities) {
            if (prebuiltEntity.name === FinalLUISJSON.prebuiltEntities[fIndex].name) {
                // do we have all the roles? if not, merge the roles
                prebuiltEntity.roles.forEach(function (role) {
                    if (!FinalLUISJSON.prebuiltEntities[fIndex].roles.includes(role)) {
                        FinalLUISJSON.prebuiltEntities[fIndex].roles.push(role);
                    }
                });
                prebuiltTypeExists = true;
                break;
            }
        }
        if (!prebuiltTypeExists) {
            FinalLUISJSON.prebuiltEntities.push(prebuiltEntity);
        }
    });
}

const buildModelFeatures = function(blob, FinalLUISJSON){
    // do we have model_features?
    if (blob.model_features.length === 0) {
        return
    }
    blob.model_features.forEach(function (modelFeature) {
        let modelFeatureInMaster = helpers.filterMatch(FinalLUISJSON.model_features, 'name', modelFeature.name);
        if (modelFeatureInMaster.length === 0) {
            FinalLUISJSON.model_features.push(modelFeature);
        } else {
            if (modelFeatureInMaster[0].mode !== modelFeature.mode) {
                // error.
                throw (new exception(retCode.errorCode.INVALID_INPUT, '[ERROR]: Phrase list : "' + modelFeature.name + '" has conflicting definitions. One marked interchangeable and another not interchangeable'));
            } else {
                modelFeature.words.split(',').forEach(function (word) {
                    if (!modelFeatureInMaster[0].words.includes(word)) modelFeatureInMaster[0].words += "," + word;
                })
            }
        }
    });
}

const buildComposites = function(blob, FinalLUISJSON){
    // do we have composites? collate them correctly
    (blob.composites || []).forEach(composite => {
        let compositeInMaster = helpers.filterMatch(FinalLUISJSON.composites, 'name', composite.name);
        if (compositeInMaster.length === 0) {
            FinalLUISJSON.composites.push(composite);
        } else {
            if (JSON.stringify(composite.children.sort()) !== JSON.stringify(compositeInMaster[0].children.sort())) {
                throw (new exception(retCode.errorCode.INVALID_COMPOSITE_ENTITY, `[ERROR]: Composite entity: ${composite.name} has multiple definition with different children. \n 1. ${compositeInMaster[0].children.join(', ')}\n 2. ${composite.children.join(', ')}`));
            } else {
                // merge roles
                (composite.roles || []).forEach(blobRole => {
                    if (!compositeInMaster[0].roles.includes(blobRole)) {
                        compositeInMaster[0].roles.push(blobRole);
                    }
                })
            }
        }
    });
}

const buildPatternAny = function(blob, FinalLUISJSON){
    // do we have pattern.any entities here? 
    (blob.patternAnyEntities || []).forEach(patternAny => {
        let paIdx = -1;
        let patternAnyInMaster = FinalLUISJSON.patternAnyEntities.find((item, idx) => {
            if (item.name === patternAny.name) {
                paIdx = idx;
                return true;
            }
            return false;
        });
        // verify that this patternAny entity does not exist as any other type
        let simpleEntityInMaster = FinalLUISJSON.entities.find(item => item.name == patternAny.name);
        let compositeInMaster = FinalLUISJSON.composites.find(item => item.name == patternAny.name);
        let listEntityInMaster = FinalLUISJSON.closedLists.find(item => item.name == patternAny.name);
        let regexEntityInMaster = FinalLUISJSON.regex_entities.find(item => item.name == patternAny.name);
        let prebuiltInMaster = FinalLUISJSON.prebuiltEntities.find(item => item.name == patternAny.name);
        if (!simpleEntityInMaster && 
            !compositeInMaster &&
            !listEntityInMaster &&
            !regexEntityInMaster &&
            !prebuiltInMaster) {
            if (patternAnyInMaster) {
                (patternAny.roles || []).forEach(role => !patternAnyInMaster.roles.includes(role) ? patternAnyInMaster.roles.push(role) : undefined);
            } else {
                    FinalLUISJSON.patternAnyEntities.push(patternAny);
            }
        } else {
            // remove the pattern.any from master if another entity type has this name.
            if (patternAnyInMaster) {
                if (paIdx !== -1) FinalLUISJSON.patternAnyEntities.splice(paIdx, 1);
            }
        }
    })
}

const initializeHash = function(LuisJSON, hashTable = undefined) {
    for (let prop in LuisJSON) {
        if (hashTable !== undefined && (prop === LUISObjNameEnum.UTTERANCE || prop === LUISObjNameEnum.PATTERNS)) {
            (LuisJSON[prop] || []).forEach(item => hashTable[helpers.hashCode(JSON.stringify(item))] = item)
        }
    }   
}
