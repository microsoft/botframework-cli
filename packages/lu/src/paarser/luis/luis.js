const deepEqual = require('deep-equal')
const retCode = require('./../../parser/lufile/enums/CLI-errors')
const helpers = require('./../../parser/lufile/helpers')
const exception = require('./../../parser/lufile/classes/exception')
const LUISObjNameEnum = require('./../../parser/lufile/enums/luisobjenum')
const NEWLINE = require('os').EOL;
const helperClasses = require('./../../parser/lufile/classes/hclasses')
const EntityTypeEnum = require('./../../parser/lufile/enums/luisEntityTypes');

class Luis {
    constructor(LuisJSON = null){
        this.intents = LuisJSON ? LuisJSON.intents : [];
        this.entities = LuisJSON ? LuisJSON.entities : [];
        this.composites = LuisJSON ? LuisJSON.composites : [];
        this.closedLists = LuisJSON ? LuisJSON.closedLists : [];
        this.regex_entities = LuisJSON ? LuisJSON.regex_entities : [];
        this.model_features = LuisJSON ? LuisJSON.model_features : [];
        this.regex_features = LuisJSON ? LuisJSON.regex_features : [];
        this.utterances = LuisJSON ? LuisJSON.utterances : [];
        this.patterns = LuisJSON ? LuisJSON.patterns : [];
        this.patternAnyEntities = LuisJSON ? LuisJSON.patternAnyEntities : [];
        this.prebuiltEntities = LuisJSON ? LuisJSON.prebuiltEntities : [];
    }

    parseToLuContent(){
        let fileContent = '';
        let luisObj = new helperClasses.rLuisObj();
        (this.intents || []).forEach(function(intent) {
            luisObj.intents.push(new helperClasses.intent(intent, []));
        });
        // add utterances to luisObj
        updateUtterancesList(this.utterances, luisObj.intents, 'text');
        // add patterns to luisObj
        updateUtterancesList(this.patterns, luisObj.intents, 'pattern');
        if(luisObj.intents.length >= 0) {
            fileContent += NEWLINE;
            fileContent += addAppMetaData(this);
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
                fileContent += '## ' + intent.intent.name + NEWLINE;
                intent.utterances.forEach(function(utterance) {
                    let updatedText = utterance.text;
                    if(utterance.entities.length >= 0) {
                        // update utterance for each entity
                        let text = utterance.text;
                        let sortedEntitiesList = objectSortByStartPos(utterance.entities);
                        let tokenizedText = text.split('');
                        let nonCompositesInUtterance = sortedEntitiesList.filter(entity => this.composites.find(composite => composite.name == entity.entity) == undefined);
                        nonCompositesInUtterance.forEach(entity => {
                            if (entity.role !== undefined) {
                                tokenizedText[parseInt(entity.startPos)] = `{@${entity.role}=${tokenizedText[parseInt(entity.startPos)]}`;    
                            } else {
                                tokenizedText[parseInt(entity.startPos)] = `{@${entity.entity}=${tokenizedText[parseInt(entity.startPos)]}`;    
                            }
                            tokenizedText[parseInt(entity.endPos)] += `}`;
                        })
                        let compositeEntitiesInUtterance = sortedEntitiesList.filter(entity => this.composites.find(composite => composite.name == entity.entity) != undefined);
                        compositeEntitiesInUtterance.forEach(entity => {
                            if (entity.role !== undefined) {
                                tokenizedText[parseInt(entity.startPos)] = `{@${entity.role}=${tokenizedText[parseInt(entity.startPos)]}`;
                            } else {
                                tokenizedText[parseInt(entity.startPos)] = `{@${entity.entity}=${tokenizedText[parseInt(entity.startPos)]}`;
                            }
                            tokenizedText[parseInt(entity.endPos)] += `}`;
                        })
                        updatedText = tokenizedText.join(''); 
                    }
                    if(updatedText) fileContent += '- ' + updatedText + NEWLINE;
                });
                fileContent += NEWLINE + NEWLINE;
                if (intent.intent.features) {
                    fileContent += `@ intent ${intent.intent.name}`;
                    fileContent += addRolesAndFeatures(intent.intent);
                    fileContent += NEWLINE + NEWLINE;
                }
            });
        }
        parseEntitiesToLu(this, fileContent)
        parseToLuPrebuiltEntities(this, fileContent)
        
        if(this.model_features && this.model_features.length >= 0) {
            fileContent += handlePhraseLists(this.model_features);
        }

        if(this.phraselists && this.phraselists.length >= 0) {
            fileContent += handlePhraseLists(this.phraselists);
        }

        parseToLuClosedLists(this, fileContent)
        parseRegExEntitiesToLu(this, fileContent)
        parseCompositesToLu(this, fileContent)
        return fileContent

    }

    sort() {
        this.intents.sort(sortComparers.compareNameFn);
        this.composites.sort(sortComparers.compareNameFn);
        this.entities.sort(sortComparers.compareNameFn);
        this.closedLists.sort(sortComparers.compareNameFn);
        this.regex_entities.sort(sortComparers.compareNameFn);
        this.model_features.sort(sortComparers.compareNameFn);
        this.patternAnyEntities.sort(sortComparers.compareNameFn);
        this.prebuiltEntities.sort(sortComparers.compareNameFn);
        this.utterances.sort(sortComparers.compareIntentFn);
    }

    static build(parsedLUISList) {
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
            buildRegex(blob, FinalLUISJSON)
            buildPrebuiltEntities(blob, FinalLUISJSON)
            buildModelFeatures(blob, FinalLUISJSON)
            buildComposites(blob, FinalLUISJSON)
            buildPatternAny(blob, FinalLUISJSON)

        });
        let result = new Luis(FinalLUISJSON)
        checkAndUpdateVersion(result)
        return result
    }

    validateLUISBlob() {
        // look for entity name collisions - list, simple, patternAny, phraselist
        // look for list entities labelled
        // look for prebuilt entity labels in utterances

        let entitiesList = [];
        let entityFound = '';
        if (this.entities.length > 0) {
            this.entities.forEach(function (entity) {
                entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['simple'], entity.roles));
            });
        }
        if (this.closedLists.length > 0) {
            this.closedLists.forEach(function (entity) {
                entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
                if (entityFound.length === 0) {
                    entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['list'], entity.roles));
                } else {
                    entityFound[0].type.push('list');
                }
            });
        }
        if (this.patternAnyEntities.length > 0) {
            this.patternAnyEntities.forEach(function (entity) {
                entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
                if (entityFound.length === 0) {
                    entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['patternAny'], entity.roles));
                } else {
                    entityFound[0].type.push('patternAny');
                }
            });
        }

        if (this.regex_entities.length > 0) {
            this.regex_entities.forEach(function (entity) {
                entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
                if (entityFound.length === 0) {
                    entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, [`regEx:/${entity.regexPattern}/`], entity.roles));
                } else {
                    if (entityFound[0].regexPattern !== undefined) {
                        if (entityFound[0].regexPattern !== entity.regexPattern)
                            entityFound[0].type.push(`regEx:/${entity.regexPattern}/`);
                    } else {
                        entityFound[0].type.push(`regEx:/${entity.regexPattern}/`);
                    }
                }
            });
        }

        // add any composite entities to entities list.
        const compositesEnt = (this.composites || []);
        compositesEnt.forEach(entity => {
            entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
            if (entityFound.length === 0) {
                entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['composite'], entity.roles));
            } else {
                entityFound[0].type.push('composite');
            }
        })

        // add any pre-built entities to the entities list.
        const prebuiltEnt = (this.prebuiltEntities || []);
        prebuiltEnt.forEach(entity => {
            entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
            if (entityFound.length === 0) {
                entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['prebuilt'], entity.roles));
            } else {
                entityFound[0].type.push('prebuilt');
            }
        })

        // for each entityFound, see if there are duplicate definitions
        entitiesList.forEach(function (entity) {
            if (entity.type.length > 1) {
                let errorMsg = `Entity ${entity.name} has duplicate definitions.\r\n\t` + JSON.stringify(entity.type, 2, null);
                let error = BuildDiagnostic({ message: errorMsg });

                throw (new exception(retCode.errorCode.DUPLICATE_ENTITIES, error.toString()));
            }
        });

        // do we have utterances with phraselist entities? 
        if (this.utterances.length > 0) {
            this.utterances.forEach(function (utterance) {
                if (utterance.entities.length > 0) {
                    utterance.entities.forEach(function (entity) {
                        let entityInList = helpers.filterMatch(entitiesList, 'name', entity.entity);
                        if (entityInList.length > 0) {
                            if (entityInList[0].type.includes('phraseList')) {
                                let errorMsg = `Utterance "${utterance.text}" has reference to PhraseList. \r\n\tYou cannot have utterances with phraselist references in them`;
                                let error = BuildDiagnostic({ message: errorMsg });

                                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                            }
                        }
                    });
                }
            });
        }

        // validate composite entities
        if (this.composites.length > 0) {
            this.composites.forEach(composite => {
                // composites cannot include pattern.any entities as children
                if (this.patternAnyEntities.length > 0) {
                    let patternAnyEntityInComposite = (this.patternAnyEntities || []).find(patternAnyEntity => {
                        return composite.children.includes(patternAnyEntity.name);
                    });
                    if (patternAnyEntityInComposite !== undefined) {
                        let errorMsg = `Composite entity "${composite.name}" includes pattern.any entity "${patternAnyEntityInComposite.name}".\r\n\tComposites cannot include pattern.any entity as a child.`;
                        let error = BuildDiagnostic({ message: errorMsg });

                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                    }
                }

                // composite entity definitions must have valid child entity type definitions. 
                composite.children.forEach(child => {
                    if (child instanceof Object) child = child.name;
                    // Fix for #1165
                    // Current implementation does not account for explicit role included in a child
                    let childEntityName = child;
                    let childEntityRole = '';
                    if (child.includes(':')) {
                        let childSplit = child.split(':').map(item => item.trim());
                        childEntityName = childSplit[0];
                        childEntityRole = childSplit[1];
                    }
                    let compositeChildEntityFound = (entitiesList || []).find(entity => entity.name == childEntityName);
                    if (compositeChildEntityFound === undefined) {
                        let errorMsg = `Composite entity "${composite.name}" includes an undefined child entity "${childEntityName}".\r\n\tAll children of composite entities must be explicitly defined or implicitly defined via an utterance or a pattern`;
                        let error = BuildDiagnostic({ message: errorMsg });

                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                    }
                    if (childEntityRole != '') {
                        if (!compositeChildEntityFound.roles.includes(childEntityRole)) {
                            let errorMsg = `Composite entity "${composite.name}" includes an undefined child entity role "${childEntityName}:${childEntityRole}".\r\n\tAll children of composite entities must be explicitly defined or implicitly defined via an utterance or a pattern`;
                            let error = BuildDiagnostic({ message: errorMsg });

                            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                        }
                    }
                })

            })
        }
        return true;
    }
}

module.exports = Luis

/**
 * Helper to handle phrase lists both in the new and old property.
 * @param {Object[]} collection 
 */
const handlePhraseLists = function(collection) {
    let fileContent = '> # Phrase list definitions' + NEWLINE + NEWLINE;
    collection.forEach(function(entity) {
        fileContent += `@ phraselist ${entity.name}${(entity.mode ? `(interchangeable)` : ``)}`;
        if (entity.words && entity.words !== '') {
            fileContent += ` = ${NEWLINE}\t- ${entity.words}`;
        }
        fileContent += NEWLINE + NEWLINE;
    });
    fileContent += NEWLINE;

    return fileContent;
}
/**
 * Helper to add application inforamtion metadata
 * @param {Object} LUISJSON 
 */
const addAppMetaData = function(LUISJSON) {
    let fileContent = '';
    if (LUISJSON.name) fileContent += `> !# @app.name = ${LUISJSON.name}` + NEWLINE;
    if (LUISJSON.desc) fileContent += `> !# @app.desc = ${LUISJSON.desc}` + NEWLINE;
    if (LUISJSON.versionId) fileContent += `> !# @app.versionId = ${LUISJSON.versionId}` + NEWLINE;
    if (LUISJSON.culture) fileContent += `> !# @app.culture = ${LUISJSON.culture}` + NEWLINE;
    if (LUISJSON.luis_schema_version) fileContent += `> !# @app.luis_schema_version = ${LUISJSON.luis_schema_version}` + NEWLINE;
    return fileContent === '' ? fileContent : `> LUIS application information` + NEWLINE + fileContent + NEWLINE + NEWLINE;
}
/**
 * Helper function to handle nDepth entity definition
 * @param {Object} entity 
 */
const handleNDepthEntity = function(entity) {
    let fileContent = '';
    const BASE_TAB_STOP = 1;
    fileContent += `@ ${EntityTypeEnum.ML} ${entity.name}`;
    fileContent += addRolesAndFeatures(entity);
    fileContent += NEWLINE;
    fileContent += addNDepthChildDefinitions(entity.children, BASE_TAB_STOP, fileContent) + NEWLINE + NEWLINE
    return fileContent;
}
/**
 * Recursive helper function to add child definitions. 
 * @param {Object[]} childCollection 
 * @param {number} tabStop 
 * @param {string} fileContent 
 */
const addNDepthChildDefinitions = function(childCollection, tabStop, fileContent) {
    let myFileContent = '';
    (childCollection || []).forEach(child => {
        myFileContent += "".padStart(tabStop * 4, ' ');
        myFileContent += '- @ ';
        if (child.instanceOf) {
            myFileContent += child.instanceOf;
        } else {
            myFileContent += EntityTypeEnum.ML;
        }
        myFileContent += ` ${child.name}`;
        myFileContent += addRolesAndFeatures(child);
        myFileContent += NEWLINE;
        if (child.children && child.children.length !== 0) {
            myFileContent += addNDepthChildDefinitions(child.children, tabStop + 1, myFileContent);
        }
    });
    return myFileContent;
}
/**
 * Helper to construt role and features list for an entity
 * @param {Object} entity 
 * @returns {String} file content to include.
 */
const addRolesAndFeatures = function(entity) {
    let roleAndFeatureContent = ''
    if (entity.roles && entity.roles.length > 0) {
        roleAndFeatureContent += ` ${entity.roles.length > 1 ? `hasRoles` : `hasRole`} ${entity.roles.join(',')}`;
    }
    if (entity.features && entity.features.length > 0) {
        let featuresList = new Array();
        entity.features.forEach(item => {
            if (item.featureName) featuresList.push(item.featureName);
            if (item.modelName) featuresList.push(item.modelName);
        })
        roleAndFeatureContent += ` ${featuresList.length > 1 ? `usesFeatures` : `usesFeature`} ${featuresList.join(',')}`;
    }

    return roleAndFeatureContent
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
        matchInTarget.utterances.push(new helperClasses.uttereances(srcItem.pattern.replace('{', '{@'),srcItem.intent,[]));
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

const buildRegex = function(blob, FinalLUISJSON){
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
}

const buildPrebuiltEntities = function(blob, FinalLUISJSON){
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
}

const buildModelFeatures = function(blob, FinalLUISJSON){
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

const parseEntitiesToLu =  function(luisJson, fileContent){
    if(luisJson.entities && luisJson.entities.length >= 0) {
        fileContent += '> # Entity definitions' + NEWLINE + NEWLINE;
        luisJson.entities.forEach(function(entity) {
            if (!entity.children || entity.children.length === 0) {
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
                fileContent += `@ ml ${entity.name}`;
                fileContent += addRolesAndFeatures(entity);
                fileContent += NEWLINE + NEWLINE;
            } else {
                // handle n-depth entity
                fileContent += handleNDepthEntity(entity);
            }
        });
        fileContent += NEWLINE;
    }
}

const parseToLuPrebuiltEntities = function(luisJson, fileContent){
    if(luisJson.prebuiltEntities && luisJson.prebuiltEntities.length >= 0){
        fileContent += '> # PREBUILT Entity definitions' + NEWLINE + NEWLINE;
        luisJson.prebuiltEntities.forEach(function(entity) {
            fileContent += `@ prebuilt ${entity.name}`;
            fileContent += addRolesAndFeatures(entity);
            fileContent += NEWLINE + NEWLINE;
        });
        fileContent += NEWLINE;
    }
}

const parseToLuClosedLists = function(luisJson, fileContent){
    if(luisJson.closedLists && luisJson.closedLists.length >= 0){
        fileContent += '> # List entities' + NEWLINE + NEWLINE;
        luisJson.closedLists.forEach(function(ListItem) {
            fileContent += `@ list ${ListItem.name}`;
            fileContent += addRolesAndFeatures(ListItem);
            if (ListItem.subLists.length !== 0) {
                fileContent += ` = `;
                fileContent += NEWLINE;
            }
            ListItem.subLists.forEach(function(list) {
                fileContent += `\t- ${list.canonicalForm} :`;
                fileContent += NEWLINE;
                list.list.forEach(function(listItem) {
                    fileContent += '\t\t- ' + listItem + NEWLINE;
                });
            });
            fileContent += NEWLINE + NEWLINE;
        });
    }
}

const parseRegExEntitiesToLu = function(luisJson, fileContent){
    if(luisJson.regex_entities && luisJson.regex_entities.length >= 0) {
        fileContent += '> # RegEx entities' + NEWLINE + NEWLINE; 
        luisJson.regex_entities.forEach(function(regExEntity) {
            fileContent += `@ regex ${regExEntity.name}`;
            fileContent += addRolesAndFeatures(regExEntity);
            if (regExEntity.regexPattern !== '') {
                fileContent += ` = /${regExEntity.regexPattern}/`;
            }
            fileContent += NEWLINE;
        });
        fileContent += NEWLINE;
    }
}

const parseCompositesToLu = function(luisJson, fileContent){
    // add composite entities if found in source LUIS JSON
    if(luisJson.composites && luisJson.composites.length > 0) {
        fileContent += '> # Composite entities' + NEWLINE + NEWLINE; 
        luisJson.composites.forEach(composite => {
            fileContent += `@ composite ${composite.name}`;
            fileContent += addRolesAndFeatures(composite);
            if (composite.children.length > 0) {
                if (typeof composite.children[0] == "object") {
                    fileContent += ` = [${composite.children.map(item => item.name).join(', ')}]`;
                } else {
                    fileContent += ` = [${composite.children.join(', ')}]`;
                }
            }
            fileContent += NEWLINE;
        })
    }
}

const checkAndUpdateVersion = function(finalLUISJSON) {
    if (!finalLUISJSON) return;
    // clean up house keeping
    if (finalLUISJSON.flatListOfEntityAndRoles)  delete finalLUISJSON.flatListOfEntityAndRoles
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