const lu = require('./lumerger')
const deepEqual = require('deep-equal')
const luisJSON = require('./../luisfile/parseLuisFile')
const retCode = require('./../lufile/enums/CLI-errors')
const helpers = require('./../lufile/helpers')
const exception = require('./../lufile/classes/exception')
const LUISObjNameEnum = require('./../lufile/enums/luisobjenum')

module.exports = {
    /**
     * Parses a list of luObject to a LUIS JSON
     * @param {luObject []} luArray luObject list to be parsed
     * @param {boolean} verbose verbose logging
     * @param {string} luis_culture luis culture
     * @param {function} luSearchFn function to search for lu references: function search(source: string, additionalFilesToParse: Array<string>): Array<luObject>
     * @returns {LUIS} Collated LUIS json contents
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    parseLuToLuis: async function(luArray, verbose, luis_culture, luSearchFn) {
        try {
            // Extract all lu files and merge all into and object
            let allParsedContent = await lu.mergeAndResolveReferences(luArray, verbose, luis_culture, luSearchFn)
            // pass only files that need to be collated.
            let finalLUISJSON  = await this.collateLUISFiles(allParsedContent.LUISContent.filter(item => item.includeInCollate))
            if (haveLUISContent(finalLUISJSON)) {
                await luisJSON.validateLUISBlob(finalLUISJSON)
            }
            checkAndUpdateVersion(finalLUISJSON)
            return finalLUISJSON
        } catch (err) {
            throw(err)
        }
    },
    /**
     * Collate LUIS sections across parsed files into one LUIS collection
     * @param {LUIS []} parsedLUISList Contents of all parsed file blobs
     * @returns {LUIS} Collated LUIS json contents
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    collateLUISFiles: async function (parsedLUISList) {
        if (parsedLUISList.length === 0) return undefined;
        let FinalLUISJSON = parsedLUISList[0].LUISJsonStructure;
        parsedLUISList.splice(0, 1);
        parsedLUISList.forEach(function (blob) {
            blob = blob.LUISJsonStructure;
            mergeResults(blob, FinalLUISJSON, LUISObjNameEnum.INTENT);
            mergeResults(blob, FinalLUISJSON, LUISObjNameEnum.ENTITIES);
            mergeResults_closedlists(blob, FinalLUISJSON, LUISObjNameEnum.CLOSEDLISTS);
            mergeResults(blob, FinalLUISJSON, LUISObjNameEnum.UTTERANCE);
            mergeResults(blob, FinalLUISJSON, LUISObjNameEnum.PATTERNS);
            mergeResults(blob, FinalLUISJSON, LUISObjNameEnum.PATTERNANYENTITY);

            // do we have regex entities here?
            if (blob.regex_entities.length > 0) {
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

            // do we have prebuiltEntities here?
            if (blob.prebuiltEntities.length > 0) {
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
            // do we have model_features?
            if (blob.model_features.length > 0) {
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
        });
        return FinalLUISJSON;
    }
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
    if (blob[type].length > 0) {
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
                } else {
                    // if item name matches, merge roles if available for everything other than intent
                    if (type === LUISObjNameEnum.INTENT || type === LUISObjNameEnum.PATTERNS || type === LUISObjNameEnum.UTTERANCE) continue;
                    if (finalCollection[type][fIndex].name === blobItem.name) {
                        itemExists = true;
                        (blobItem.roles || []).forEach(blobRole => {
                            if (finalCollection[type][fIndex].roles !== undefined) {
                                if (!finalCollection[type][fIndex].roles.includes(blobRole)) {
                                    finalCollection[type][fIndex].roles.push(blobRole);
                                }
                            }
                        });
                    }
                }
            }
            if (!itemExists) {
                finalCollection[type].push(blobItem);
            }
        });
    }
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
    if (blob[type].length > 0) {
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
}
/**
 * Helper to detect luis schema version based on content and update the final payload as needed.
 * @param {LUIS} finalLUISJSON 
 */
const checkAndUpdateVersion = function(finalLUISJSON) {
    // Detect if there is content specific to 5.0.0 schema
    // any entity with children
    if (!finalLUISJSON) {
        return
    }
    let v5DefFound = false;
    v5DefFound = (finalLUISJSON.entities || []).find(i => i.children || i.features) ||
                 (finalLUISJSON.intents || []).find(i => i.features) || 
                 (finalLUISJSON.composites || []).find(i => i.features);
    if (v5DefFound) {
        finalLUISJSON.luis_schema_version = "6.0.0";
        if (finalLUISJSON.model_features && finalLUISJSON.model_features.length !== 0) {
            finalLUISJSON.phraselists = [];
            finalLUISJSON.model_features.forEach(item => finalLUISJSON.phraselists.push(Object.assign({}, item)));
            delete finalLUISJSON.model_features;
        }
        (finalLUISJSON.composites || []).forEach(composite => {
            let children = composite.children;
            composite.children = [];
            children.forEach(c => composite.children.push({name : c}));
        })
    }
}
/**
 * Helper function to see if we have any luis content in the blob
 * @param {object} blob Contents of parsed luis blob
 * @returns {boolean} true if there is any luis content in the blob
 */
const haveLUISContent = function(blob) {
    if(!blob) return false;
    return ((blob[LUISObjNameEnum.INTENT].length > 0) ||
    (blob[LUISObjNameEnum.ENTITIES].length > 0) || 
    (blob[LUISObjNameEnum.CLOSEDLISTS].length > 0) ||
    (blob[LUISObjNameEnum.PATTERNANYENTITY].length > 0) ||
    (blob.patterns.length > 0) ||
    (blob[LUISObjNameEnum.UTTERANCE].length > 0) ||
    (blob.prebuiltEntities.length > 0) ||
    (blob[LUISObjNameEnum.REGEX].length > 0) ||
    (blob.model_features.length > 0) ||
    (blob.composites.length > 0));
};

