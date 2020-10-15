
const deepEqual = require('deep-equal')
const LUISObjNameEnum = require('./../utils/enums/luisobjenum')
const Luis = require('./luis')
const helpers = require('./../utils/helpers')
const mergeLuFiles = require('./../lu/luMerger').Build
const exception = require('./../utils/exception')
const retCode = require('../utils/enums/CLI-errors')

/**
 * Builds a Luis instance from a Lu list.
 * @param {Array<Lu>} luObjArray Array of LU files to be merge
 * @param {boolean} log indicates if we need verbose logging.
 * @param {string} luis_culture LUIS locale code
 * @param {function} luSearchFn function to retrieve the lu files found in the references
 * @returns {Luis} new Luis instance
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const build =  async function(luArray, verbose, luis_culture, luSearchFn) {
    let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
    let parsedLUISList = mergedContent.LUISContent.filter(item => item.includeInCollate)
    if (parsedLUISList.length === 0) return new Luis()
    let luisList = []
    parsedLUISList.forEach(i => {
        luisList.push(i.LUISJsonStructure)
    });
    return collate(luisList)
}

/**
 * Collates a list of Luis instances into one.
 * @param {Array<Luis>} luisList Array of Luis instances to be collate
 * @param {Luis} luisObject Luis instances to collate with
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const collate = function(luisList) {
    if (luisList.length === 0) return
    let luisObject = new Luis(luisList[0])
    let hashTable = {};
    initializeHash(luisObject, hashTable)
    for(let i = 1; i < luisList.length; i++) {
        let blob = luisList[i]
        mergeResults(blob, luisObject, LUISObjNameEnum.INTENT);
        mergeResults(blob, luisObject, LUISObjNameEnum.ENTITIES);
        mergeNDepthEntities(blob.entities, luisObject.entities);
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
    helpers.cleanUpExplicitEntityProperty(luisObject)
    cleanupEntities(luisObject)
    return luisObject
}

module.exports = {
    collate, 
    build
}

const cleanupEntities = function(luisObject) {
    let consolidatedList = [];
    luisObject.composites.forEach(item => consolidatedList.push(item));
    luisObject.closedLists.forEach(item => consolidatedList.push(item));
    luisObject.regex_entities.forEach(item => consolidatedList.push(item));
    luisObject.prebuiltEntities.forEach(item => consolidatedList.push(item));
    let idxToRemove = [];
    luisObject.entities.forEach((item, idx) => {
        if (consolidatedList.find(e => e.name == item.name) !== undefined) idxToRemove.push(idx);
    })
    idxToRemove.sort((a, b) => a-b).forEach(idx => luisObject.entities.splice(idx, 1))
    delete luisObject.onAmbiguousLabels;
}

const mergeResultsWithHash = function (blob, finalCollection, type, hashTable) {
    if (blob[type] === undefined || blob[type].length === 0) { 
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
const mergeNDepthEntities = function (blob, finalCollection) {
    let nDepthInBlob = (blob || []).filter(x => x.children !== undefined && Array.isArray(x.children) && x.children.length !== 0);
    if (nDepthInBlob === undefined) return;
    nDepthInBlob.forEach(item => {
        let itemExistsInFinal = (finalCollection || []).find(x => x.name == item.name);
        if (itemExistsInFinal === undefined) {
            finalCollection.push(item);
        } else {
            // de-dupe and merge roles
            (item.roles || []).forEach(r => {
                if (itemExistsInFinal.roles === undefined) {
                    itemExistsInFinal.roles = [r];
                } else {
                    if (!itemExistsInFinal.roles.includes(r)) {
                        itemExistsInFinal.roles.push(r);
                    }
                }
            })
            // de-dupe and merge children
            if (item.children !== undefined && Array.isArray(item.children) && item.children.length !== 0) {
                recursivelyMergeChildrenAndFeatures(item.children, itemExistsInFinal.children)
            }
        }
    })
}

const recursivelyMergeChildrenAndFeatures = function(srcChildren, tgtChildren) {
    if (tgtChildren === undefined || !Array.isArray(tgtChildren) || tgtChildren.length === 0) {
        tgtChildren = srcChildren;
        return;
    }
    (srcChildren || []).forEach(item => {
        // find child in tgt
        let itemExistsInFinal = (tgtChildren || []).find(x => x.name == item.name);
        if (itemExistsInFinal === undefined) {
            tgtChildren.push(item);
        } else {
            // merge features
            if (item.features !== undefined && item.features.length !== 0) {
                // merge and verify type
                let typeForFinalItem = (itemExistsInFinal.features || []).find(t => t.isRequired == true);
                let typeForItem = (item.features || []).find(t1 => t1.isRequired == true);
                if (typeForFinalItem !== undefined) {
                    if (typeForItem !== undefined) {
                        if (typeForFinalItem.modelName !== typeForItem.modelName) {
                            throw new exception(retCode.errorCode.INVALID_REGEX_ENTITY, `Child entity ${item.name} does not have consistent type definition. Please verify all definitions for this entity.`)
                        }
                    }
                }
                item.features.forEach(f => {
                    let featureInFinal = (itemExistsInFinal.features || []).find(itFea => {
                        return ((itFea.featureName !== undefined && itFea.featureName == f.featureName) || 
                                (itFea.modelName !== undefined && itFea.modelName == f.modelName))
                    });
                    if (featureInFinal === undefined) {
                        itemExistsInFinal.features.push(f);
                    } else {
                        // throw if isRequired is not the same.
                        if (featureInFinal.isRequired !== f.isRequired) {
                            throw new exception(retCode.errorCode.INVALID_REGEX_ENTITY, `Feature ${f.featureName} does not have consistent definition for entity ${item.name}. Please verify all definitions for this feature for this entity.`)
                        }
                    }
                })
            }
            // de-dupe and merge children
            if (item.children !== undefined && Array.isArray(item.children) && item.children.length !== 0) {
                recursivelyMergeChildrenAndFeatures(item.children, itemExistsInFinal.children)
            }
        }
    })
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
    if (blob[type] === undefined || blob[type].length === 0) { 
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
    if (blob[type] === undefined || blob[type].length === 0) {
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
    if (blob.regex_entities === undefined || blob.regex_entities.length === 0) {
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
    if (blob.prebuiltEntities === undefined || blob.prebuiltEntities.length === 0) {
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
    // Find what scope to use in blob
    let blobScope = blob.model_features || blob.phraselists || [];
    if (blobScope.length === 0) return;

    // Find the finalLuisJson scope to use
    let finalScope = FinalLUISJSON.model_features || FinalLUISJSON.phraselists;

    blobScope.forEach(function (modelFeature) {
        let modelFeatureInMaster = helpers.filterMatch(finalScope, 'name', modelFeature.name);
        if (modelFeatureInMaster.length === 0) {
            finalScope.push(modelFeature);
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
    if (blob.composites === undefined) return;
    // do we have composites? collate them correctly
    (blob.composites || []).forEach(composite => {
        let compositeInMaster = helpers.filterMatch(FinalLUISJSON.composites, 'name', composite.name);
        if (compositeInMaster.length === 0) {
            FinalLUISJSON.composites.push(composite);
        } else {
            if (JSON.stringify(composite.children.sort()) !== JSON.stringify(compositeInMaster[0].children.sort())) {
                composite.children.forEach(child => {
                    if (!compositeInMaster[0].children.includes(child)) compositeInMaster[0].children.push(child)
                })
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
    if (blob.patternAnyEntities === undefined) return;
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