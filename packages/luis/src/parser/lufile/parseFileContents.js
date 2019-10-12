#!/usr/bin/env node
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const LUISObjNameEnum = require('./enums/luisobjenum');
const PARSERCONSTS = require('./enums/parserconsts');
const builtInTypes = require('./enums/luisbuiltintypes');
const SectionType = require('./enums/lusectiontypes');
const helpers = require('./helpers');
const chalk = require('chalk');
const url = require('url');
const retCode = require('./enums/CLI-errors');
const parserObj = require('./classes/parserObject');
const qnaListObj = require('./classes/qnaList');
const qnaMetaDataObj = require('./classes/qnaMetaData');
const helperClass = require('./classes/hclasses');
const deepEqual = require('deep-equal');
const qna = require('./classes/qna');
const exception = require('./classes/exception');
const qnaAlterations = require('./classes/qnaAlterations');
const fetch = require('node-fetch');
const qnaFile = require('./classes/qnaFiles');
const fileToParse = require('./classes/filesToParse');
const luParser = require('./luParser');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const EntityTypeEnum = require('./enums/luisEntityTypes');
const luisEntityTypeMap = require('./enums/luisEntityTypeNameMap');
const SimpleIntentSection = require('./simpleIntentSection');
const plAllowedTypes = ["composite", "ml"];
const featureTypeEnum = {
    featureToModel: 'modelName',
    modelToFeature: 'featureName'
};
const INTENTTYPE = 'intent';
const parseFileContentsModule = {
    /**
     * Main parser code to parse current file contents into LUIS and QNA sections.
     * @param {string} fileContent current file content
     * @param {boolean} log indicates if we need verbose logging.
     * @param {string} locale LUIS locale code
     * @returns {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    parseFile: async function (fileContent, log, locale) {
        fileContent = helpers.sanitizeNewLines(fileContent);
        let parsedContent = new parserObj();
        await parseLuAndQnaWithAntlr(parsedContent, fileContent.toString(), log, locale);

        return parsedContent;
    },
    /**
     * Helper function to add an item to collection if it does not exist
     * @param {object} collection contents of the current collection
     * @param {LUISObjNameEnum} type item type
     * @param {object} value value of the current item to examine and add
     * @returns {void} nothing
     */
    addItemIfNotPresent: function (collection, type, value) {
        let hasValue = false;
        for (let i in collection[type]) {
            if (collection[type][i].name === value) {
                hasValue = true;
                break;
            }
        }
        if (!hasValue) {
            let itemObj = {};
            itemObj.name = value;
            if (type == LUISObjNameEnum.PATTERNANYENTITY) {
                itemObj.explicitList = [];
            }
            if (type !== LUISObjNameEnum.INTENT) {
                itemObj.roles = [];
            }
            collection[type].push(itemObj);
        }
    },
    /**
     * Helper function to add an item to collection if it does not exist
     * @param {object} collection contents of the current collection
     * @param {LUISObjNameEnum} type item type
     * @param {object} value value of the current item to examine and add
     * @param {string []} roles possible roles to add to the item
     * @returns {void} nothing
     */
    addItemOrRoleIfNotPresent: function (collection, type, value, roles) {
        let existingItem = collection[type].filter(item => item.name == value);
        if (existingItem.length !== 0) {
            // see if the role exists and if so, merge
            mergeRoles(existingItem[0].roles, roles);
        } else {
            let itemObj = {};
            itemObj.name = value;
            if (type == LUISObjNameEnum.PATTERNANYENTITY) {
                itemObj.explicitList = [];
            }
            if (type == LUISObjNameEnum.COMPOSITES) {
                itemObj.children = [];
            }
            if (type !== LUISObjNameEnum.INTENT) {
                itemObj.roles = roles;
            }
            collection[type].push(itemObj);
        }
    }
};

/**
 * Main parser code to parse current file contents into LUIS and QNA sections.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {string} fileContent current file content
 * @param {boolean} log indicates if we need verbose logging.
 * @param {string} locale LUIS locale code
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseLuAndQnaWithAntlr = async function (parsedContent, fileContent, log, locale) {
    fileContent = helpers.sanitizeNewLines(fileContent);
    let luResource = luParser.parse(fileContent);

    if (luResource.Errors && luResource.Errors.length > 0) {
        if (log) {
            var warns = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.WARN));
            if (warns.length > 0) {
                process.stdout.write(warns.map(warn => warn.toString()).join('\n').concat('\n'));
            }
        }

        var errors = luResource.Errors.filter(error => (error && error.Severity && error.Severity === DiagnosticSeverity.ERROR));
        if (errors.length > 0) {
            throw (new exception(retCode.errorCode.INVALID_LINE, errors.map(error => error.toString()).join('\n')));
        }
    }

    // parse model info section
    let enableMergeIntents = parseAndHandleModelInfoSection(parsedContent, luResource, log);

    // parse reference section
    await parseAndHandleImportSection(parsedContent, luResource);

    // parse nested intent section
    parseAndHandleNestedIntentSection(luResource, enableMergeIntents);

    GetEntitySectionsFromSimpleIntentSections(luResource);

    // parse entity definition v2 section
    let featuresToProcess = parseAndHandleEntityV2(parsedContent, luResource, log, locale);
    
    // parse entity section
    parseAndHandleEntitySection(parsedContent, luResource, log, locale);

    // parse simple intent section
    parseAndHandleSimpleIntentSection(parsedContent, luResource);

    // parse qna section
    parseAndHandleQnaSection(parsedContent, luResource);

    if (featuresToProcess && featuresToProcess.length > 0) {
        parseFeatureSections(parsedContent, featuresToProcess);
    }

    validateNDepthEntities(parsedContent.LUISJsonStructure.entities, parsedContent.LUISJsonStructure.flatListOfEntityAndRoles, parsedContent.LUISJsonStructure.intents);
    if (parsedContent.LUISJsonStructure.flatListOfEntityAndRoles) delete parsedContent.LUISJsonStructure.flatListOfEntityAndRoles

}
/**
 * Helper function to validate and update nDepth entities
 * @param {Object[]} collection 
 * @param {Object[]} entitiesAndRoles 
 * @param {Object[]} intentsCollection 
 */
const validateNDepthEntities = function(collection, entitiesAndRoles, intentsCollection) {
    (collection || []).forEach(child => {
        if(child.instanceOf) {
            let baseEntityFound = entitiesAndRoles.find(i => i.name == child.instanceOf);
            if (!baseEntityFound) {
                let errorMsg = `[Error] line ${child.context.line}: Invalid child entity definition found. No definition for "${child.instanceOf}" in child entity definition "${child.context.definition}".`;
                throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
            }
            // base type can only be a list or regex or prebuilt.
            if (![EntityTypeEnum.LIST, EntityTypeEnum.REGEX, EntityTypeEnum.PREBUILT].includes(baseEntityFound.type)) {
                let errorMsg = `[Error] line ${child.context.line}: Invalid child entity definition found. "${child.instanceOf}" is of type "${baseEntityFound.type}" in child entity definition "${child.context.definition}". Child cannot be only be an instance of "${EntityTypeEnum.LIST}, ${EntityTypeEnum.REGEX} or ${EntityTypeEnum.PREBUILT}.`;
                throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
            }

        }

        if (child.features) {
            let featureHandled = false;
            (child.features || []).forEach((feature, idx) => {
                if (typeof feature === "object") return;
                featureHandled = false;
                let featureExists = entitiesAndRoles.find(i => (i.name == feature || i.name == `${feature}(interchangeable)`));
                if (featureExists) {
                    // is feature phrase list?
                    if (featureExists.type == EntityTypeEnum.PHRASELIST) {
                        child.features[idx] = new helperClass.featureToModel(feature);
                        featureHandled = true;
                    } else if (featureExists.type == EntityTypeEnum.PATTERNANY) {
                        let errorMsg = `[Error] line ${child.context.line}: Invalid child entity definition found. "${feature}" is of type "${EntityTypeEnum.PATTERNANY}" in child entity definition "${child.context.definition}". Child cannot include a usesFeature of type "${EntityTypeEnum.PATTERNANY}".`;
                        throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
                    } else {
                        child.features[idx] = new helperClass.modelToFeature(feature);
                        featureHandled = true;
                    }
                }
                if (!featureHandled) {
                    // find feature as intent
                    let intentFeatureExists = intentsCollection.find(i => i.name == feature);
                    if (intentFeatureExists) {
                        child.features[idx] = new helperClass.modelToFeature(feature);
                        featureHandled = true;
                    } else {
                        let errorMsg = `[Error] line ${child.context.line}: Invalid child entity definition found. No definition found for "${feature}" in child entity definition "${child.context.definition}". Features must be defined before they can be added to a child.`;
                        throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
                    }
                }
            })
        }

        if (child.children) {
            validateNDepthEntities(child.children, entitiesAndRoles, intentsCollection);
        }

        if (child.context) {
            delete child.context
        }
    })
};
/**
 * Helper function to validate if the requested feature addition is valid.
 * @param {String} srcItemType 
 * @param {String} srcItemName 
 * @param {String} tgtFeatureType 
 * @param {String} tgtFeatureName 
 * @param {String} line 
 */
const validateFeatureAssignment = function(srcItemType, srcItemName, tgtFeatureType, tgtFeatureName, line) {
    switch(srcItemType) {
        case INTENTTYPE:
        case EntityTypeEnum.SIMPLE:
        case EntityTypeEnum.ML:
        case EntityTypeEnum.COMPOSITE:
            // can use everything as a feature except pattern.any
            if (tgtFeatureType === EntityTypeEnum.PATTERNANY) {
                let errorMsg = `'patternany' entity cannot be added as a feature. Invalid definition found for "@ ${srcItemType} ${srcItemName} usesFeature ${tgtFeatureName}"`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: line
                })
                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }
            break;
        default:
            // cannot have any features assigned
            let errorMsg = `Invalid definition found for "@ ${srcItemType} ${srcItemName} usesFeature ${tgtFeatureName}". usesFeature is only available for intent, ${plAllowedTypes.join(', ')}`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: line
            })
            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            break;
    }
}
/**
 * Helper function to add features to the parsed content scope.
 * @param {Object} tgtItem 
 * @param {String} feature 
 * @param {String} featureType 
 * @param {Object} line 
 */
const addFeatures = function(tgtItem, feature, featureType, line) {
    // target item cannot have the same name as the feature name
    if (tgtItem.name === feature) {
        // Item must be defined before being added as a feature.
        let errorMsg = `Source and target cannot be the same for usesFeature. e.g. x usesFeature x  is invalid. "${tgtItem.name}" usesFeature "${feature}" is invalid.`;
        let error = BuildDiagnostic({
            message: errorMsg,
            context: line
        })
        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
    let featureAlreadyDefined = (tgtItem.features || []).find(item => item.modelName == feature || item.featureName == feature);
    switch (featureType) {
        case featureTypeEnum.featureToModel: {
            if (tgtItem.features) {
                if (!featureAlreadyDefined) tgtItem.features.push(new helperClass.featureToModel(feature));
            } else {
                tgtItem.features = new Array(new helperClass.featureToModel(feature));
            }
            break;
        }
        case featureTypeEnum.modelToFeature: {
            if (tgtItem.features) {
                if (!featureAlreadyDefined) tgtItem.features.push(new helperClass.modelToFeature(feature));
            } else {
                tgtItem.features = new Array(new helperClass.modelToFeature(feature));
            }
            break;
        }
        default: 
            break;
    }
}
/**
 * Helper function to handle usesFeature definitions
 * @param {Object} parsedContent 
 * @param {Object} featuresToProcess 
 */
const parseFeatureSections = function(parsedContent, featuresToProcess) {
    // We are only interested in extracting features and setting things up here.
    (featuresToProcess || []).forEach(section => {
        if (section.Type === INTENTTYPE) {
            // verify intent exists
            if (!section.Features || section.Roles) {
                // Intents can only have features and nothing else.
                let errorMsg = `Intents can only have usesFeature and nothing else. Invalid definition for "${section.Name}".`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: section.ParseTree.newEntityDefinition().newEntityLine()
                })
                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }
            
            let intentExists = parsedContent.LUISJsonStructure.intents.find(item => item.name === section.Name);
            if (intentExists !== undefined) {
                // verify the list of features requested have all been defined.
                let featuresList = section.Features.split(/[,;]/g).map(item => item.trim());
                (featuresList || []).forEach(feature => {
                    let entityExists = (parsedContent.LUISJsonStructure.flatListOfEntityAndRoles || []).find(item => item.name == feature || item.name == `${feature}(interchangeable)`);
                    let featureIntentExists = (parsedContent.LUISJsonStructure.intents || []).find(item => item.name == feature);
                    if (entityExists) {
                        if (entityExists.type === EntityTypeEnum.PHRASELIST) {
                            // de-dupe and add features to intent.
                            validateFeatureAssignment(section.Type, section.Name, entityExists.type, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                            addFeatures(intentExists, feature, featureTypeEnum.featureToModel, section.ParseTree.newEntityDefinition().newEntityLine());
                            // set enabledForAllModels on this phrase list
                            let plEnity = parsedContent.LUISJsonStructure.model_features.find(item => item.name == feature);
                            plEnity.enabledForAllModels = false;
                        } else {
                            // de-dupe and add model to intent.
                            validateFeatureAssignment(section.Type, section.Name, entityExists.type, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                            addFeatures(intentExists, feature, featureTypeEnum.modelToFeature, section.ParseTree.newEntityDefinition().newEntityLine());
                        }
                    } else if (featureIntentExists) {
                        // Add intent as a feature to another intent
                        validateFeatureAssignment(section.Type, section.Name, INTENTTYPE, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                        addFeatures(intentExists, feature, featureTypeEnum.modelToFeature, section.ParseTree.newEntityDefinition().newEntityLine());
                    } else {
                        // Item must be defined before being added as a feature.
                        let errorMsg = `Features must be defined before assigned to an intent. No definition found for feature "${feature}" in usesFeature definition for intent "${section.Name}"`;
                        let error = BuildDiagnostic({
                            message: errorMsg,
                            context: section.ParseTree.newEntityDefinition().newEntityLine()
                        })
                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                    }
                })
            } else {
                let errorMsg = `Features can only be added to intents that have a definition. Invalid feature definition found for intent "${section.Name}".`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: section.ParseTree.newEntityDefinition().newEntityLine()
                })
                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }
        } else {
            // handle as entity
            if (section.Features) {
                let featuresList = section.Features.split(/[,;]/g).map(item => item.trim());
                // Find the source entity from the collection and get its type
                let srcEntityInFlatList = (parsedContent.LUISJsonStructure.flatListOfEntityAndRoles || []).find(item => item.name == section.Name);
                let entityType = srcEntityInFlatList ? srcEntityInFlatList.type : undefined;
                (featuresList || []).forEach(feature => {
                    let featureExists = (parsedContent.LUISJsonStructure.flatListOfEntityAndRoles || []).find(item => item.name == feature || item.name == `${feature}(interchangeable)`);
                    let featureIntentExists = (parsedContent.LUISJsonStructure.intents || []).find(item => item.name == feature);
                    // find the entity based on its type.
                    let srcEntity = (parsedContent.LUISJsonStructure[luisEntityTypeMap[entityType]] || []).find(item => item.name == section.Name);
                    if (featureExists) {
                        if (featureExists.type === EntityTypeEnum.PHRASELIST) {
                            // de-dupe and add features to intent.
                            validateFeatureAssignment(entityType, section.Name, featureExists.type, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                            addFeatures(srcEntity, feature, featureTypeEnum.featureToModel, section.ParseTree.newEntityDefinition().newEntityLine());
                            // set enabledForAllModels on this phrase list
                            let plEnity = parsedContent.LUISJsonStructure.model_features.find(item => item.name == feature);
                            plEnity.enabledForAllModels = false;
                        } else {
                            // de-dupe and add model to intent.
                            validateFeatureAssignment(entityType, section.Name, featureExists.type, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                            addFeatures(srcEntity, feature, featureTypeEnum.modelToFeature, section.ParseTree.newEntityDefinition().newEntityLine());
                        }
                    } else if (featureIntentExists) {
                        // Add intent as a feature to another intent
                        validateFeatureAssignment(entityType, section.Name, INTENTTYPE, feature, section.ParseTree.newEntityDefinition().newEntityLine());
                        addFeatures(srcEntity, feature, featureTypeEnum.modelToFeature, section.ParseTree.newEntityDefinition().newEntityLine());
                    } else {
                        // Item must be defined before being added as a feature.
                        let errorMsg = `Features must be defined before assigned to an entity. No definition found for feature "${feature}" in usesFeature definition for entity "${section.Name}"`;
                        let error = BuildDiagnostic({
                            message: errorMsg,
                            context: section.ParseTree.newEntityDefinition().newEntityLine()
                        })
                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                    }
                });
            }
        }
    });

    // Circular dependency for features is not allowed. E.g. A usesFeature B usesFeature A is not valid. 
    verifyNoCircularDependencyForFeatures(parsedContent);
}

/**
 * Helper function to update a list of dependencies for usesFeature
 * @param {String} type 
 * @param {Object} parsedContent 
 * @param {Object} dependencyList 
 */
const updateDependencyList = function(type, parsedContent, dependencyList) {
    // go through intents and capture dependency list
    (parsedContent.LUISJsonStructure[type] || []).forEach(itemOfType => {
        let srcName = itemOfType.name;
        let copySrc, copyValue;
        if (itemOfType.features) {
            (itemOfType.features || []).forEach(feature => {
                if (feature.modelName) feature = feature.modelName;
                if (feature.featureName) feature = feature.featureName;
                // find any items where this feature is the target
                let featureDependencyEx = dependencyList.filter(item => srcName == (item.value ? item.value.slice(-1)[0] : undefined));
                (featureDependencyEx || []).forEach(item => {
                    item.key = `${item.key.split('::')[0]}::${feature}`;
                    item.value.push(feature);
                })
                // find any items where this feature is the source
                featureDependencyEx = dependencyList.find(item => feature == (item.value ? item.value.slice(0)[0] : undefined));
                if (featureDependencyEx) {
                    copySrc = featureDependencyEx.key.split('::')[1];
                    copyValue = featureDependencyEx.value.slice(1);
                }
                let dependencyExists = dependencyList.find(item => item.key == `${srcName}::${feature}`);
                if (!dependencyExists) {
                    let lKey = copySrc ? `${srcName}::${copySrc}` : `${srcName}::${feature}`;
                    let lValue = [srcName, feature];
                    if (copyValue) copyValue.forEach(item => lValue.push(item));
                    dependencyList.push({
                        key : lKey,
                        value : lValue
                    })
                } else {
                    dependencyExists.key = `${dependencyExists.key.split('::')[0]}::${feature}`;
                    dependencyExists.value.push(feature);
                }
                let circularItemFound = dependencyList.find(item => item.value && item.value.slice(0)[0] == item.value.slice(-1)[0]);
                if (circularItemFound) {
                    throw (new exception(retCode.errorCode.INVALID_INPUT, `Circular dependency found for usesFeature. ${circularItemFound.value.join(' -> ')}`));
                }
                
            })
        }
    });
}
/**
 * Helper function to verify there are no circular dependencies in the parsed content.
 * @param {Object} parsedContent 
 */
const verifyNoCircularDependencyForFeatures = function(parsedContent) {
    let dependencyList = [];
    updateDependencyList(LUISObjNameEnum.INTENT, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.ENTITIES, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.CLOSEDLISTS, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.COMPOSITES, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.PATTERNANYENTITY, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.PREBUILT, parsedContent, dependencyList);
    updateDependencyList(LUISObjNameEnum.REGEX, parsedContent, dependencyList);
}

/**
 * Reference parser code to parse reference section.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleImportSection = async function (parsedContent, luResource) {
    // handle reference
    let luImports = luResource.Sections.filter(s => s.SectionType === SectionType.IMPORTSECTION);
    if (luImports && luImports.length > 0) {
        for (const luImport of luImports) {
            let linkValueText = luImport.Description.replace('[', '').replace(']', '');
            let linkValue = luImport.Path.replace('(', '').replace(')', '');
            let parseUrl = url.parse(linkValue);
            if (parseUrl.host || parseUrl.hostname) {
                let options = { method: 'HEAD' };
                let response;
                try {
                    response = await fetch(linkValue, options);
                } catch (err) {
                    // throw, invalid URI
                    let errorMsg = `URI: "${linkValue}" appears to be invalid. Please double check the URI or re-try this parse when you are connected to the internet.`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: luImport.ParseTree
                    })

                    throw (new exception(retCode.errorCode.INVALID_URI, error.toString()));
                }

                if (!response.ok) {
                    let errorMsg = `URI: "${linkValue}" appears to be invalid. Please double check the URI or re-try this parse when you are connected to the internet.`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: luImport.ParseTree
                    })

                    throw (new exception(retCode.errorCode.INVALID_URI, error.toString()));
                }

                let contentType = response.headers.get('content-type');
                if (!contentType.includes('text/html')) {
                    parsedContent.qnaJsonStructure.files.push(new qnaFile(linkValue, linkValueText));
                } else {
                    parsedContent.qnaJsonStructure.urls.push(linkValue);
                }

            } else {
                parsedContent.additionalFilesToParse.push(new fileToParse(linkValue));
            }
        }
    }
}
/**
 * Helper function to handle @ reference in patterns
 * @param {String} utterance 
 * @param {String []} entitiesFound 
 * @param {Object []} flatEntityAndRoles 
 */
const handleAtForPattern = function(utterance, entitiesFound, flatEntityAndRoles) {
    if (utterance.match(/{@/g)) {
        utterance = utterance.replace(/{@/g, '{');
        entitiesFound.forEach(entity => {
            if (entity.entity.match(/^@/g)) {
                entity = handleAtPrefix(entity, flatEntityAndRoles);
                if (entity.entity && entity.role) {
                    utterance = utterance.replace(`{${entity.role}}`, `{${entity.entity}:${entity.role}}`);
                }
            }
        });
    }
    return utterance;
}

/**
 * Helper function to handle @ entity or @ role reference in utterances.
 * @param {Object} entity 
 * @param {Object []} flatEntityAndRoles 
 */
const handleAtPrefix = function(entity, flatEntityAndRoles) {
    if (entity.entity.match(/^@/g)) {
        entity.entity = entity.entity.replace(/^@/g, '').trim();
        if (flatEntityAndRoles) {
            // find the entity as a match by name
            let entityMatch = flatEntityAndRoles.find(item => item.entityName == entity.entity);
            if (entityMatch !== undefined) {
                return entity;
            }
            // find the entity as a match by role
            let roleMatch = flatEntityAndRoles.find(item => item.roles.includes(entity.entity));
            if (roleMatch !== undefined) {
                // we have a role match. 
                entity.role = entity.entity;
                entity.entity = roleMatch.name;
                return entity;
            }
        }
    }
    
    return entity;
}
/**
 * Intent parser code to parse intent section.
 * @param {LUResouce} luResource resources extracted from lu file content
 * @param {boolean} enableMergeIntents enable functionality to merge intents in nested intent section or not
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleNestedIntentSection = function (luResource, enableMergeIntents) {
    // handle nested intent section
    let sections = luResource.Sections.filter(s => s.SectionType === SectionType.NESTEDINTENTSECTION);
    if (sections && sections.length > 0) {
        sections.forEach(section => {
            if (enableMergeIntents) {
                let mergedIntentSection = section.SimpleIntentSections[0];
                mergedIntentSection.ParseTree = section.ParseTree;
                mergedIntentSection.Name = section.Name;
                for (let idx = 1; idx < section.SimpleIntentSections.length; idx++) {
                    mergedIntentSection.UtteranceAndEntitiesMap = mergedIntentSection.UtteranceAndEntitiesMap.concat(section.SimpleIntentSections[idx].UtteranceAndEntitiesMap);
                    mergedIntentSection.Entities = mergedIntentSection.Entities.concat(section.SimpleIntentSections[idx].Entities);
                }

                luResource.Sections.push(mergedIntentSection);
            } else {
                section.SimpleIntentSections.forEach(subSection => {
                    subSection.Name = section.Name + '.' + subSection.Name;
                    luResource.Sections.push(subSection);
                })
            }
        })
    }
}

/**
 * Intent parser code to parse intent section.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleSimpleIntentSection = function (parsedContent, luResource) {
    // handle intent
    let intents = luResource.Sections.filter(s => s.SectionType === SectionType.SIMPLEINTENTSECTION);
    if (intents && intents.length > 0) {
        for (const intent of intents) {
            let intentName = intent.Name;
            // insert only if the intent is not already present.
            addItemIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.INTENT, intentName);
            for (const utteranceAndEntities of intent.UtteranceAndEntitiesMap) {
                // add utterance
                let utterance = utteranceAndEntities.utterance.trim();
                // Fix for BF-CLI #122. 
                // Ensure only links are detected and passed on to be parsed.
                if (helpers.isUtteranceLinkRef(utterance || '')) {
                    let parsedLinkUriInUtterance = helpers.parseLinkURI(utterance);
                    // examine and add these to filestoparse list.
                    parsedContent.additionalFilesToParse.push(new fileToParse(parsedLinkUriInUtterance.luFile, false));
                }

                if (utteranceAndEntities.entities.length > 0) {
                    let entitiesFound = utteranceAndEntities.entities;
                    let havePatternAnyEntity = entitiesFound.find(item => item.type == LUISObjNameEnum.PATTERNANYENTITY);
                    if (havePatternAnyEntity !== undefined) {
                        utterance = handleAtForPattern(utterance, entitiesFound, parsedContent.LUISJsonStructure.flatListOfEntityAndRoles);
                        let mixedEntity = entitiesFound.filter(item => item.type != LUISObjNameEnum.PATTERNANYENTITY);
                        if (mixedEntity.length !== 0) {
                            let errorMsg = `Utterance "${utteranceAndEntities.context.getText()}" has mix of entites with labelled values and ones without. Please update utterance to either include labelled values for all entities or remove labelled values from all entities.`;
                            let error = BuildDiagnostic({
                                message: errorMsg,
                                context: utteranceAndEntities.context
                            })

                            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                        }

                        let newPattern = new helperClass.pattern(utterance, intentName);
                        if (!parsedContent.LUISJsonStructure.patterns.find(item => deepEqual(item, newPattern))) {
                            parsedContent.LUISJsonStructure.patterns.push(newPattern);
                        }

                        // add all entities to pattern.Any only if they do not have another type.
                        entitiesFound.forEach(entity => {
                            let simpleEntityInMaster = parsedContent.LUISJsonStructure.entities.find(item => item.name == entity.entity);
                            if (simpleEntityInMaster && entity.role) {
                                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entity.entity, [entity.role.trim()]);
                            }
                            let compositeInMaster = parsedContent.LUISJsonStructure.composites.find(item => item.name == entity.entity);
                            if (compositeInMaster && entity.role) {
                                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.COMPOSITES, entity.entity, [entity.role.trim()]);
                            }
                            let listEntityInMaster = parsedContent.LUISJsonStructure.closedLists.find(item => item.name == entity.entity);
                            if (listEntityInMaster && entity.role) {
                                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.CLOSEDLISTS, entity.entity, [entity.role.trim()]);
                            }
                            let regexEntityInMaster = parsedContent.LUISJsonStructure.regex_entities.find(item => item.name == entity.entity);
                            if (regexEntityInMaster && entity.role) {
                                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.REGEX, entity.entity, [entity.role.trim()]);
                            }
                            let prebuiltInMaster = parsedContent.LUISJsonStructure.prebuiltEntities.find(item => item.name == entity.entity);
                            if (prebuiltInMaster && entity.role) {
                                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PREBUILT, entity.entity, [entity.role.trim()]);
                            }
                            if (!simpleEntityInMaster &&
                                !compositeInMaster &&
                                !listEntityInMaster &&
                                !regexEntityInMaster &&
                                !prebuiltInMaster) {
                                if (entity.role && entity.role !== '') {
                                    addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PATTERNANYENTITY, entity.entity, [entity.role.trim()])
                                } else {
                                    addItemIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PATTERNANYENTITY, entity.entity);
                                }
                            }                             
                        });
                    } else {
                        entitiesFound.forEach(entity => {
                            // handle at prefix
                            entity = handleAtPrefix(entity, parsedContent.LUISJsonStructure.flatListOfEntityAndRoles);
                            // throw an error if phraselist entity is explicitly labelled in an utterance
                            let nonAllowedPhrseListEntityInUtterance = (parsedContent.LUISJsonStructure.model_features || []).find(item => item.name == entity.entity);
                            if (nonAllowedPhrseListEntityInUtterance !== undefined) {
                                // Fix for #1137
                                // Phrase list entity can have the same name as other entity types. Only throw if the phrase list has no other type definition and is labelled in an utterance.
                                let otherEntities = (parsedContent.LUISJsonStructure.entities || []).concat(
                                    (parsedContent.LUISJsonStructure.prebuiltEntities || []),
                                    (parsedContent.LUISJsonStructure.closedLists || []),
                                    (parsedContent.LUISJsonStructure.regex_entities || []),
                                    (parsedContent.LUISJsonStructure.model_features || []),
                                    (parsedContent.LUISJsonStructure.composites || [])
                                );
                                if ((otherEntities || []).find(item => item.name == entity.entity) === undefined) {
                                    let errorMsg = `Utterance "${utterance}" has invalid reference to Phrase List entity "${nonAllowedPhrseListEntityInUtterance.name}". Phrase list entities cannot be given an explicit labelled value.`;
                                    let error = BuildDiagnostic({
                                        message: errorMsg,
                                        context: utteranceAndEntities.context
                                    });

                                    throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                                }
                            }

                            // only add this entity if it has not already been defined as composite, list, prebuilt, regex
                            let compositeExists = (parsedContent.LUISJsonStructure.composites || []).find(item => item.name == entity.entity);
                            let listExists = (parsedContent.LUISJsonStructure.closedLists || []).find(item => item.name == entity.entity);
                            let prebuiltExists = (parsedContent.LUISJsonStructure.prebuiltEntities || []).find(item => item.name == entity.entity);
                            let regexExists = (parsedContent.LUISJsonStructure.regex_entities || []).find(item => item.name == entity.entity);
                            let patternAnyExists = (parsedContent.LUISJsonStructure.patternAnyEntities || []).find(item => item.name == entity.entity);
                            if (compositeExists === undefined && listExists === undefined && prebuiltExists === undefined && regexExists === undefined && patternAnyExists === undefined) {
                                if (entity.role && entity.role !== '') {
                                    addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entity.entity, [entity.role.trim()]);
                                } else {
                                    addItemIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entity.entity)
                                }
                            } else {
                                if (compositeExists !== undefined) {
                                    if (entity.role) {
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.COMPOSITES, entity.entity, [entity.role.trim()]);
                                    }
                                } else if (listExists !== undefined) {
                                    if (entity.role) {
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.CLOSEDLISTS, entity.entity, [entity.role.trim()]);
                                    } else {
                                        let errorMsg = `${entity.entity} has been defined as a LIST entity type. It cannot be explicitly included in a labelled utterance unless the label includes a role.`;
                                        let error = BuildDiagnostic({
                                            message: errorMsg,
                                            context: utteranceAndEntities.context
                                        });

                                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                                    }
                                } else if (prebuiltExists !== undefined) {
                                    if (entity.role) {
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PREBUILT, entity.entity, [entity.role.trim()]);
                                    } else {
                                        let errorMsg = `${entity.entity} has been defined as a PREBUILT entity type. It cannot be explicitly included in a labelled utterance unless the label includes a role.`;
                                        let error = BuildDiagnostic({
                                            message: errorMsg,
                                            context: utteranceAndEntities.context
                                        });

                                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                                    }
                                } else if (regexExists !== undefined) {
                                    if (entity.role) {
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.REGEX, entity.entity, [entity.role.trim()]);
                                    } else {
                                        let errorMsg = `${entity.entity} has been defined as a Regex entity type. It cannot be explicitly included in a labelled utterance unless the label includes a role.`;
                                        let error = BuildDiagnostic({
                                            message: errorMsg,
                                            context: utteranceAndEntities.context
                                        });

                                        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                                    }
                                } else if (patternAnyExists !== undefined) {
                                    if (entity.value != '') {
                                        // Verify and add this as simple entity.
                                        let roles = (entity.role && entity.role.trim() !== "") ? [entity.role.trim()] : [];
                                        patternAnyExists.roles.forEach(role => roles.push(role));
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entity.entity, roles);
                                        let patternAnyIdx = -1;
                                        (parsedContent.LUISJsonStructure.patternAnyEntities || []).find((item, idx) => {
                                            if (item.name === entity.entity) {
                                                patternAnyIdx = idx;
                                                return true;
                                            }
                                            return false;
                                        });
                                        // delete pattern any entity
                                        if (patternAnyIdx > -1) parsedContent.LUISJsonStructure.patternAnyEntities.splice(patternAnyIdx, 1);

                                    } else if (entity.role) {
                                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PATTERNANYENTITY, entity.entity, [entity.role.trim()]);
                                    }
                                }
                            }
                        });

                        // add utterance
                        let utteranceExists = parsedContent.LUISJsonStructure.utterances.find(item => item.text == utterance && item.intent == intentName);
                        let utteranceObject = utteranceExists || new helperClass.uttereances(utterance, intentName, []);
                        entitiesFound.forEach(item => {
                            if (item.startPos > item.endPos) {
                                let errorMsg = `No labelled value found for entity: "${item.entity}" in utterance: "${utteranceAndEntities.context.getText()}"`;
                                let error = BuildDiagnostic({
                                    message: errorMsg,
                                    context: utteranceAndEntities.context
                                })

                                throw (new exception(retCode.errorCode.MISSING_LABELLED_VALUE, error.toString()));
                            }

                            let utteranceEntity = new helperClass.utteranceEntity(item.entity, item.startPos, item.endPos);
                            if (item.role && item.role !== '') {
                                utteranceEntity.role = item.role.trim();
                            }
                            utteranceObject.entities.push(utteranceEntity)
                        });
                        if (utteranceExists === undefined) parsedContent.LUISJsonStructure.utterances.push(utteranceObject);
                    }

                } else {
                    // detect if utterance is a pattern and if so add it as a pattern
                    if (helpers.isUtterancePattern(utterance)) {
                        let patternObject = new helperClass.pattern(utterance, intentName);
                        parsedContent.LUISJsonStructure.patterns.push(patternObject);
                    } else {
                        if(parsedContent.LUISJsonStructure.utterances.find(item => item.text == utterance && item.intent == intentName) === undefined) {
                            let utteranceObject = new helperClass.uttereances(utterance, intentName, []);
                            parsedContent.LUISJsonStructure.utterances.push(utteranceObject);    
                        }
                    }
                }
            }
        }
    }
}

/**
 * Helper function to get entity type based on a name match
 * @param {String} entityName name of entity to look up type for.
 * @param {Object[]} entities collection of entities in the current application
 */
const getEntityType = function(entityName, entities) {
    let entityFound = (entities || []).find(item => item.Name == entityName || item.Name == `${entityName}(interchangeable)`);
    return entityFound ? entityFound.Type : undefined;
};

/**
 * Helper function to validate that new roles being added are unique at the application level.
 * @param {Object} parsedContent with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {String[]} roles string array of new roles to be added
 * @param {String} line current line being parsed.
 * @param {String} entityName name of the entity being added.
 */
const validateAndGetRoles = function(parsedContent, roles, line, entityName, entityType) {
    let newRoles = roles ? roles.split(',').map(item => item.trim()) : [];
    // de-dupe roles
    newRoles = [...new Set(newRoles)];
    // entity roles need to unique within the application
    if(parsedContent.LUISJsonStructure.flatListOfEntityAndRoles) {
        // Duplicate entity names are not allowed
        // Entity name cannot be same as a role name
        verifyUniqueEntityName(parsedContent, entityName, entityType, line);

        newRoles.forEach(role => {
            let roleFound = parsedContent.LUISJsonStructure.flatListOfEntityAndRoles.find(item => item.roles.includes(role) || item.name === role);
            if (roleFound !== undefined) {
                let errorMsg = `Roles must be unique across entity types. Invalid role definition found "${entityName}". Prior definition - '@ ${roleFound.type} ${roleFound.name}${roleFound.roles.length > 0 ? ` hasRoles ${roleFound.roles.join(',')}` : ``}'`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: line
                })
                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            } 
        });

        let oldEntity = parsedContent.LUISJsonStructure.flatListOfEntityAndRoles.find(item => item.name === entityName && item.type === entityType);
        if (oldEntity !== undefined) {
            oldEntity.addRoles(newRoles);
        } else {
            parsedContent.LUISJsonStructure.flatListOfEntityAndRoles.push(new helperClass.entityAndRoles(entityName, entityType, newRoles))
        }

    } else {
        parsedContent.LUISJsonStructure.flatListOfEntityAndRoles = new Array();
        parsedContent.LUISJsonStructure.flatListOfEntityAndRoles.push(new helperClass.entityAndRoles(entityName, entityType, newRoles));
    }
    return newRoles;
};

/**
 * 
 * @param {LUResouce} luResource resources extracted from lu file content
 */
const GetEntitySectionsFromSimpleIntentSections = function(luResource) {
    let intents = luResource.Sections.filter(s => s.SectionType === SectionType.SIMPLEINTENTSECTION);
    if (intents && intents.length > 0) {
        intents.forEach(intent => luResource.Sections = luResource.Sections.concat(intent.Entities));
    }
}

/**
 * 
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @param {boolean} log indicates where verbose flag is set 
 * @param {String} locale current target locale
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 * @returns {NewEntitySection[]} collection of NewEntitySection to process after all other sections are processed.
 */
const parseAndHandleEntityV2 = function (parsedContent, luResource, log, locale) {
    let featuresToProcess = [];
    // handle new entity definitions.
    let entities = luResource.Sections.filter(s => s.SectionType === SectionType.NEWENTITYSECTION);
    if (entities && entities.length > 0) {
        for (const entity of entities) {
            if (entity.Type !== INTENTTYPE) {
                let entityName = entity.Name.replace(/^[\'\"]|[\'\"]$/g, "");
                let entityType = !entity.Type ? getEntityType(entity.Name, entities) : entity.Type;
                if (!entityType) {
                    let errorMsg = `No type definition found for entity "${entityName}". Supported types are ${Object.values(EntityTypeEnum).join(', ')}. Note: Type names are case sensitive.`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: entity.ParseTree.newEntityDefinition().newEntityLine()
                    })
                    throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                };

                if (entityType === entityName) {
                    let errorMsg = `Entity name "${entityName}" cannot be the same as entity type "${entityType}"`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: entity.ParseTree.newEntityDefinition().newEntityLine()
                    })
                    throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
                }
                let entityRoles = validateAndGetRoles(parsedContent, entity.Roles, entity.ParseTree.newEntityDefinition().newEntityLine(), entityName, entityType);
                let PAEntityRoles = RemoveDuplicatePatternAnyEntity(parsedContent, entityName, entityType, entity.ParseTree.newEntityDefinition().newEntityLine());
                if (PAEntityRoles.length > 0) {
                    PAEntityRoles.forEach(role => {
                        if (!entityRoles.includes(role)) entityRoles.push(role);
                    })
                }
                switch(entityType) {
                    case EntityTypeEnum.ML:
                        handleNDepthEntity(parsedContent, entityName, entityRoles, entity.ListBody, entity.ParseTree.newEntityDefinition().newEntityLine());
                        break;
                    case EntityTypeEnum.SIMPLE: 
                        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entityName, entityRoles);
                        break;
                    case EntityTypeEnum.COMPOSITE:
                        let candidateChildren = [];
                        if (entity.CompositeDefinition) {
                            entity.CompositeDefinition.replace(/[\[\]]/g, '').split(/[,;]/g).map(item => item.trim()).forEach(item => candidateChildren.push(item));
                        }
                        if (entity.ListBody) {
                            entity.ListBody.forEach(line => {
                                line.trim().substr(1).trim().replace(/[\[\]]/g, '').split(/[,;]/g).map(item => item.trim()).forEach(item => candidateChildren.push(item));
                            })
                        }
                        handleComposite(parsedContent, entityName,`[${candidateChildren.join(',')}]`, entityRoles, entity.ParseTree.newEntityDefinition().newEntityLine(), false, entity.Type !== undefined);
                        break;
                    case EntityTypeEnum.LIST:
                        handleClosedList(parsedContent, entityName, entity.ListBody.map(item => item.trim()), entityRoles, entity.ParseTree.newEntityDefinition().newEntityLine());
                        break;
                    case EntityTypeEnum.PATTERNANY:
                        handlePatternAny(parsedContent, entityName, entityRoles, entity.ParseTree.newEntityDefinition().newEntityLine());
                        break;
                    case EntityTypeEnum.PREBUILT:
                        handlePrebuiltEntity(parsedContent, 'prebuilt', entityName, entityRoles, locale, log, entity.ParseTree.newEntityDefinition().newEntityLine());
                        break;
                    case EntityTypeEnum.REGEX:
                        if (entity.ListBody[0]) {
                            handleRegExEntity(parsedContent, entityName, entity.ListBody[0].trim().substr(1).trim(), entityRoles, entity.ParseTree.newEntityDefinition().newEntityLine());
                        } else {
                            handleRegExEntity(parsedContent, entityName, entity.RegexDefinition, entityRoles, entity.ParseTree.newEntityDefinition().newEntityLine());
                        } 
                        break;
                    case EntityTypeEnum.ML:
                        break;
                    case EntityTypeEnum.PHRASELIST:
                        handlePhraseList(parsedContent, entityName, entity.Type, entityRoles, entity.ListBody.map(item => item.trim().substr(1).trim()), entity.ParseTree.newEntityDefinition().newEntityLine());
                    default:
                        //Unknown entity type
                        break;
                }
                if (entity.Features !== undefined) {
                    featuresToProcess.push(entity);
                }
            } else {
                featuresToProcess.push(entity);
            }
        }
    }

    return featuresToProcess;
};
/**
 * Helper to handle ndepth entity definition.
 * @param {Object} parsedContent 
 * @param {String} entityName 
 * @param {String[]} entityRoles 
 * @param {String[]} entityLines 
 * @param {Object} line 
 */
const handleNDepthEntity = function(parsedContent, entityName, entityRoles, entityLines, line) {
    const SPACEASTABS = 4;
    addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entityName, entityRoles);
    let rootEntity = parsedContent.LUISJsonStructure.entities.find(item => item.name == entityName);
    let defLine = line.start.line;
    let baseTabLevel = 0;
    let entityIdxByLevel = [];
    let currentParentEntity = undefined;
    // process each entity line
    entityLines.forEach(child => {
        currentParentEntity = undefined;
        defLine++;
        let captureGroups = /^((?<leadingSpaces>[ ]*)|(?<leadingTabs>[\t]*))-\s*@\s*(?<instanceOf>[^\s]+) (?<entityName>(?:'[^']+')|(?:"[^"]+")|(?:[^ '"=]+))(?: uses?[fF]eatures? (?<features>[^=]+))?\s*=?\s*$/g;
        let groupsFound = captureGroups.exec(child);
        if (!groupsFound) {
            let errorMsg = `[ERROR] line ${defLine}: Invalid child entity definition found for "${child.trim()}". Child definitions must start with '- @' and only include a type, name and optionally one or more usesFeature(s) definition.`;
            throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
        }
        let childEntityName = groupsFound.groups.entityName.replace(/^['"]/g, '').replace(/['"]$/g, '');
        let childEntityType = groupsFound.groups.instanceOf.trim();
        let childFeatures = groupsFound.groups.features ? groupsFound.groups.features.trim().split(/[,;]/g).map(item => item.trim()) : undefined;
        // Verify that the entity name is unique
        verifyUniqueEntityName(parsedContent, childEntityName, childEntityType, line, true);
        
        // Get current tab level
        let tabLevel = Math.ceil(groupsFound.groups.leadingSpaces !== undefined ? groupsFound.groups.leadingSpaces.length / SPACEASTABS : 0) || (groupsFound.groups.leadingTabs !== undefined ? groupsFound.groups.leadingTabs.length : 0);
        if (defLine === line.start.line + 1) {
            // remember the tab level at the first line of child definition
            baseTabLevel = tabLevel;
            // Push the ID of the parent since we are proessing the first child entity
            entityIdxByLevel.push({level : 0, entity : rootEntity});
        } 
        
        currentParentEntity = entityIdxByLevel.reverse().find(item => item.level == tabLevel - baseTabLevel);
        entityIdxByLevel.reverse();
        if (!currentParentEntity) {
            let errorMsg = `[ERROR] line ${defLine}: Invalid definition found for child "${child.trim()}". Parent of each child entity must be of type "${EntityTypeEnum.ML}".`;
            throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
        }
        let context = {line : defLine, definition: child.trim()};
        if (groupsFound.groups.instanceOf.toLowerCase().trim() === EntityTypeEnum.SIMPLE) {
            pushNDepthChild(currentParentEntity.entity, childEntityName, context, childFeatures);
        } else if (groupsFound.groups.instanceOf.toLowerCase().trim() === EntityTypeEnum.ML) {
            pushNDepthChild(currentParentEntity.entity, childEntityName, context, childFeatures);
            let newParent = currentParentEntity.entity.children.find(item => item.name == childEntityName);
            // Push the ID of the parent since we are proessing the first child entity
            entityIdxByLevel.push({level : tabLevel - baseTabLevel + 1, entity : newParent});
        } else {
            pushNDepthChild(currentParentEntity.entity, childEntityName, context, childFeatures, childEntityType);
        }
    });
};
/**
 * Helper to add an nDepth child entity to the collection.
 * @param {Object} entity 
 * @param {String} childEntityName 
 * @param {Object} context 
 * @param {String []} childFeatures 
 * @param {String} childEntityType 
 * @param {Object []} children 
 */
const pushNDepthChild = function(entity, childEntityName, context, childFeatures, childEntityType = "", children = []) {
    if (!entity.children) {
        entity.children = new Array(new helperClass.childEntity(childEntityName,childEntityType, context, children, childFeatures));
    } else {
        // de-dupe and push this child entity    
        let childExists = (entity.children || []).find(item => item.name == childEntityName);
        if (!childExists) {
            entity.children.push(new helperClass.childEntity(childEntityName, childEntityType, context, children, childFeatures));
        } 
    }
}
/**
 * Helper function to verify that the requested entity is unique.
 * @param {Object} parsedContent 
 * @param {String} entityName 
 * @param {String} entityType 
 * @param {Object} line 
 * @param {Boolean} checkTypesAlignment
 */
const verifyUniqueEntityName = function(parsedContent, entityName, entityType, line, checkTypesAlignment) {
    // Duplicate entity names are not allowed
    // Entity name cannot be same as a role name
    let matchType = "";
    let entityFound = parsedContent.LUISJsonStructure.flatListOfEntityAndRoles.find(item => {
        if (item.name === entityName) {
            if (!checkTypesAlignment && item.type !== entityType) {
                matchType = `Entity names must be unique. Duplicate definition found for "${entityName}".`;
                return true;
            } else if (checkTypesAlignment) {
                matchType = `Child entity names must be unique. Duplicate definition found for child entity "${entityName}".`;
                return true;
            }
        } else if (item.roles.includes(entityName)) {
            matchType = `Entity name cannot be the same as a role name. Duplicate definition found for "${entityName}".`;
            return true;
        }
    });
    if (entityFound !== undefined) {
        let errorMsg = `${matchType} Prior definition - '@ ${entityFound.type} ${entityFound.name}${entityFound.roles.length > 0 ? ` hasRoles ${entityFound.roles.join(',')}` : ``}'`;
        let error = BuildDiagnostic({
            message: errorMsg,
            context: line
        })
        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
}
/**
 * Helper function to handle pattern.any entity
 * @param {Object} parsedContent parsed LUIS, QnA and QnA alteration object
 * @param {String} entityName entity name
 * @param {String} entityRoles collection of entity roles
 */
const handlePatternAny = function(parsedContent, entityName, entityRoles) {
     // check if this patternAny entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
     try {
        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityName, 'Pattern.Any');
        if (rolesImport.length !== 0) {
            rolesImport.forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        }
    } catch (err) {
        throw (err);
    }

    let PAExists = parsedContent.LUISJsonStructure.patternAnyEntities.find(item => item.name == entityName);
    if (PAExists === undefined) {
        parsedContent.LUISJsonStructure.patternAnyEntities.push(new helperClass.patternAnyEntity(entityName, [], entityRoles));
    } else {
        entityRoles.forEach(item => {
            if (!PAExists.roles.includes) PAExists.roles.push(item);
        })
    }
}
/**
 * Helper function to remove duplicate pattern any definitions.
 * @param {Object} parsedContent Object containing current parsed content - LUIS, QnA, QnA alterations.
 * @param {String} pEntityName name of entity
 * @param {String} entityType type of entity
 * @param {String} entityLine current line being parsed
 */
const RemoveDuplicatePatternAnyEntity = function(parsedContent, pEntityName, entityType, entityLine) {
    // see if we already have this as Pattern.Any entity
    // see if we already have this in patternAny entity collection; if so, remove it but remember the roles (if any)
    let PAIdx = -1;
    let entityRoles = [];
    let PAEntityFound = parsedContent.LUISJsonStructure.patternAnyEntities.find(function(item, idx) {
        if(item.name === pEntityName) {
            PAIdx = idx;
            return true
        } else {
            return false;
        }
    });
    if (PAEntityFound !== undefined && PAIdx !== -1) {
        if (entityType.toLowerCase().trim().includes('phraselist')) {
            let errorMsg = `Phrase lists cannot be used as an entity in a pattern "${pEntityName}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: entityLine
            })
            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
        } 
        entityRoles = (PAEntityFound.roles.length !== 0) ? PAEntityFound.roles : [];
        parsedContent.LUISJsonStructure.patternAnyEntities.splice(PAIdx, 1);
    }
    return entityRoles;
};

/**
 * 
 * @param {Object} parsedContent parsed content that includes LUIS, QnA, QnA alternations
 * @param {String} entityName entity name
 * @param {String} entityType entity type
 * @param {String []} entityRoles Array of roles
 * @param {String []} valuesList Array of individual lines to be processed and added to phrase list.
 */
const handlePhraseList = function(parsedContent, entityName, entityType, entityRoles, valuesList, currentLine) {
    if (entityRoles.length !== 0) {
        let errorMsg = `Phrase list entity ${entityName} has invalid role definition with roles = ${entityRoles.join(', ')}. Roles are not supported for Phrase Lists`;
        let error = BuildDiagnostic({
            message: errorMsg,
            context: currentLine
        })

        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
    // check if this phraselist entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
    try {
        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityName, 'Phrase List');
        if (rolesImport.length !== 0) {
            rolesImport.forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        }
    } catch (err) {
        throw (err);
    }
    // is this interchangeable? 
    let intc = false;
    if (entityType && entityName.toLowerCase().includes('interchangeable')) {
        intc = true;
        entityName = entityName.split(/\(.*\)/g)[0]   
    }
    // add this to phraseList if it doesnt exist
    let pLValues = [];
    for (const phraseListValues of valuesList) {
        phraseListValues.split(/[,;]/g).map(item => item.trim()).forEach(item => pLValues.push(item));
   }

    let pLEntityExists = parsedContent.LUISJsonStructure.model_features.find(item => item.name == entityName);
    if (pLEntityExists) {
        if (entityType) {
            if (pLEntityExists.mode !== intc) {
                let errorMsg = `Phrase list: "${entityName}" has conflicting definitions. One marked interchangeable and another not interchangeable`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: currentLine
                })

                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }
        }
        let wordsSplit = pLEntityExists.words.split(',');
        pLValues.forEach(function (plValueItem) {
            if (!wordsSplit.includes(plValueItem)) pLEntityExists.words += (pLEntityExists.words !== '' ? ',' : '') + plValueItem;
        })
    } else {
        parsedContent.LUISJsonStructure.model_features.push(new helperClass.modelObj(entityName, intc, pLValues.join(','), true));
    }
}

/**
 * 
 * @param {Object} parsedContent parsed LUIS, QnA and QnA alternations
 * @param {String} entityName entity name
 * @param {String} entityType entity type
 * @param {String []} entityRoles list of entity roles
 * @param {String} locale current locale
 * @param {Boolean} log boolean to indicate if errors should be sent to stdout
 * @param {String} currentLine current line being parsed.
 */
const handlePrebuiltEntity = function(parsedContent, entityName, entityType, entityRoles, locale, log, currentLine) {
    locale = locale ? locale.toLowerCase() : 'en-us';
    // check if this pre-built entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
    try {
        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityType, entityName);
        if (rolesImport.length !== 0) {
            rolesImport.forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        }
    } catch (err) {
        throw (err);
    }
    // verify if the requested entityType is available in the requested locale
    if (!builtInTypes.consolidatedList.includes(entityType)) {
        let errorMsg = `Unknown PREBUILT entity '${entityType}'. Available pre-built types are ${builtInTypes.consolidatedList.join(',')}`;
        let error = BuildDiagnostic({
            message: errorMsg,
            context: currentLine
        })

        throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
    }
    let prebuiltCheck = builtInTypes.perLocaleAvailability[locale][entityType];
    if (prebuiltCheck === null) {
        if (log) {
            process.stdout.write(chalk.default.yellowBright('[WARN]: Requested PREBUILT entity "' + entityType + ' is not available for the requested locale: ' + locale + '\n'));
            process.stdout.write(chalk.default.yellowBright('  Skipping this prebuilt entity..\n'));
        } else {
            let errorMsg = `PREBUILT entity '${entityType}' is not available for the requested locale '${locale}'`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: currentLine
            })

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
        }
    } else if (prebuiltCheck && prebuiltCheck.includes('datetime')) {
        if (log) {
            process.stdout.write(chalk.default.yellowBright('[WARN]: PREBUILT entity "' + entityType + ' is not available for the requested locale: ' + locale + '\n'));
            process.stdout.write(chalk.default.yellowBright('  Switching to ' + builtInTypes.perLocaleAvailability[locale][entityType] + ' instead.\n'));
        }
        entityType = builtInTypes.perLocaleAvailability[locale][entityType];
        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PREBUILT, entityType, entityRoles);
    } else {
        // add to prebuiltEntities if it does not exist there.
        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.PREBUILT, entityType, entityRoles);
    }
};
/**
 * Helper function to handle composite entity definition.
 * @param {Object} parsedContent Object representing parsed content
 * @param {String} entityName entity name
 * @param {String} entityType entity type
 * @param {String []} entityRoles collection of roles
 * @param {String} currentLine current line being parsed 
 * @param {Boolean} inlineChildRequired boolean to indicate if children definition must be defined inline.
 * @param {Boolean} isEntityTypeDefinition Type definition is included
 */
const handleComposite = function(parsedContent, entityName, entityType, entityRoles, currentLine, inlineChildRequired, isEntityTypeDefinition) {
    // remove simple entity definitions for composites but carry forward roles.
    // Find this entity if it exists in the simple entity collection
    let simpleEntityExists = (parsedContent.LUISJsonStructure.entities || []).find(item => item.name == entityName);
    if (simpleEntityExists !== undefined) {
        // take and add any roles into the roles list
        (simpleEntityExists.roles || []).forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        // remove this simple entity definition
        for (var idx = 0; idx < parsedContent.LUISJsonStructure.entities.length; idx++) {
            if (parsedContent.LUISJsonStructure.entities[idx].name === simpleEntityExists.name) {
                parsedContent.LUISJsonStructure.entities.splice(idx, 1);
            }
        }
    }
    // handle composite entity definition
    // drop [] and trim
    let childDefinition = entityType.trim().replace('[', '').replace(']', '').trim();
    if (childDefinition.length === 0 && inlineChildRequired) {
        let errorMsg = `Composite entity: ${entityName} is missing child entity definitions. Child entities are denoted via [entity1, entity2] notation.`;
        let error = BuildDiagnostic({
            message: errorMsg,
            context: currentLine
        })

        throw (new exception(retCode.errorCode.INVALID_COMPOSITE_ENTITY, error.toString()));
    }
    // split the children based on ',' or ';' delimiter. Trim each child to remove white spaces.
    let compositeChildren = childDefinition !== "" ? childDefinition.split(new RegExp(/[,;]/g)).map(item => item.trim()) : [];
    // add this composite entity if it does not exist
    let compositeEntity = (parsedContent.LUISJsonStructure.composites || []).find(item => item.name == entityName);
    if (compositeEntity === undefined) {
        // add new composite entity
        parsedContent.LUISJsonStructure.composites.push(new helperClass.compositeEntity(entityName, compositeChildren, entityRoles));

        // remove composite that might have been tagged as a simple entity due to inline entity definition in an utterance
        parsedContent.LUISJsonStructure.entities = (parsedContent.LUISJsonStructure.entities || []).filter(entity => entity.name != entityName);
    } else {
        if (isEntityTypeDefinition) {
            if (compositeEntity.children.length !== 0 && JSON.stringify(compositeChildren.sort()) !== JSON.stringify(compositeEntity.children.sort())) {
                let errorMsg = `Composite entity: ${entityName} has multiple definition with different children. \n 1. ${compositeChildren.join(', ')}\n 2. ${compositeEntity.children.join(', ')}`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: currentLine
                })
    
                throw (new exception(retCode.errorCode.INVALID_COMPOSITE_ENTITY, error.toString()));
            }
        }

        // update roles
        // update children
        compositeChildren.forEach(item => compositeEntity.children.push(item));
        addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.COMPOSITES, compositeEntity.name, entityRoles);
    }
};

/**
 * Helper function to handle list entity definition
 * @param {Object} parsedContent parsed LUIS, QnA and QnA alternations content
 * @param {String} entityName entity name
 * @param {String []} listLines lines to parse for the list entity
 * @param {String []} entityRoles collection of roles found
 * @param {String} currentLine current line being parsed.
 */
const handleClosedList = function (parsedContent, entityName, listLines, entityRoles, currentLine) {
    // check if this list entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
    try {
        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityName, 'List');
        rolesImport.forEach(role => {
            if (!entityRoles.includes(role)) {
                entityRoles.push(role)
            }
        });
    } catch (err) {
        throw (err);
    }
    // Find closed list by this name if it exists
    let closedListExists = parsedContent.LUISJsonStructure.closedLists.find(item => item.name == entityName);
    let addCL = false;
    if (closedListExists === undefined) {
        closedListExists = new helperClass.closedLists(entityName);
        addCL = true;
    }
    let addNV = false;    
    let nvExists;
    listLines.forEach(line => {
        line = line.substr(1).trim();
        if (line.toLowerCase().endsWith(':')) {
            // close if we are in the middle of a sublist.
            if (addNV) {
                closedListExists.subLists.push(nvExists);
                addNV = false;
                nvExists = undefined;
            }
            // find the matching sublist and if none exists, create one. 
            let normalizedValue = line.replace(/:$/g, '').trim();
            nvExists = closedListExists.subLists.find(item => item.canonicalForm == normalizedValue);
            if (nvExists === undefined) {
                nvExists = new helperClass.subList(normalizedValue);
                addNV = true;
            }
        } else {
            line.split(/[,;]/g).map(item => item.trim()).forEach(item => {
                if (!nvExists || !nvExists.list) {
                    let errorMsg = `Closed list ${entityName} has synonyms list "${line}" without a normalized value.`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: currentLine
                    })

                    throw (new exception(retCode.errorCode.SYNONYMS_NOT_A_LIST, error.toString()));
                }
                if (!nvExists.list.includes(item)) nvExists.list.push(item);
            })
        }
    });

    if (addNV) {
        closedListExists.subLists.push(nvExists);
    }

    // merge roles
    entityRoles.forEach(item => {
        if(!closedListExists.roles.includes(item)) closedListExists.roles.push(item);
    });

    if (addCL) {
        parsedContent.LUISJsonStructure.closedLists.push(closedListExists);
    }
}
/**
 * Reference parser code to parse reference section.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @param {boolean} log indicates if we need verbose logging.
 * @param {string} locale LUIS locale code
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleEntitySection = function (parsedContent, luResource, log, locale) {
    // handle entity
    let entities = luResource.Sections.filter(s => s.SectionType === SectionType.ENTITYSECTION);
    if (entities && entities.length > 0) {
        for (const entity of entities) {
            let entityName = entity.Name;
            let entityType = entity.Type;
            let parsedRoleAndType = helpers.getRolesAndType(entityType);
            let entityRoles = parsedRoleAndType.roles;
            entityType = parsedRoleAndType.entityType;
            let pEntityName = (entityName.toLowerCase() === 'prebuilt') ? entityType : entityName;
            
            let PAEntityRoles = RemoveDuplicatePatternAnyEntity(parsedContent, pEntityName, entityType, entity.ParseTree.entityDefinition().entityLine());
            if (PAEntityRoles.length > 0) {
                PAEntityRoles.forEach(role => {
                    if (!entityRoles.includes(role)) entityRoles.push(role);
                })
            }

            // add this entity to appropriate place
            // is this a builtin type?
            if (builtInTypes.consolidatedList.includes(entityType)) {
                handlePrebuiltEntity(parsedContent, entityName, entityType, entityRoles, locale, log, entity.ParseTree.entityDefinition().entityLine());
            } else if (entityType.toLowerCase() === 'simple') {
                // add this to entities if it doesnt exist
                addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.ENTITIES, entityName, entityRoles);
            } else if (entityType.endsWith('=')) {
                // is this qna maker alterations list? 
                if (entityType.includes(PARSERCONSTS.QNAALTERATIONS)) {
                    let alterationlist = [entity.Name];
                    if (entity.SynonymsOrPhraseList && entity.SynonymsOrPhraseList.length > 0) {
                        alterationlist = alterationlist.concat(entity.SynonymsOrPhraseList);
                        parsedContent.qnaAlterations.wordAlterations.push(new qnaAlterations.alterations(alterationlist));
                    } else {
                        let errorMsg = `QnA alteration section: "${alterationlist}" does not have list decoration. Prefix line with "-" or "+" or "*"`;
                        let error = BuildDiagnostic({
                            message: errorMsg,
                            context: entity.ParseTree.entityDefinition().entityLine()
                        })

                        throw (new exception(retCode.errorCode.SYNONYMS_NOT_A_LIST, error.toString()));
                    }
                } else {
                    // treat this as a LUIS list entity type
                    let parsedEntityTypeAndRole = helpers.getRolesAndType(entityType);
                    entityType = parsedEntityTypeAndRole.entityType;
                    (parsedEntityTypeAndRole.roles || []).forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);

                    // check if this list entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
                    try {
                        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityName, 'List');
                        if (rolesImport.length !== 0) {
                            rolesImport.forEach(role => {
                                if (!entityRoles.includes(role)) {
                                    entityRoles.push(role)
                                }
                            })
                        }
                    } catch (err) {
                        throw (err);
                    }
                    // get normalized value
                    let normalizedValue = entityType.substring(0, entityType.length - 1).trim();
                    let synonymsList = entity.SynonymsOrPhraseList;
                    let closedListExists = helpers.filterMatch(parsedContent.LUISJsonStructure.closedLists, 'name', entityName);
                    if (closedListExists.length === 0) {
                        parsedContent.LUISJsonStructure.closedLists.push(new helperClass.closedLists(entityName, [new helperClass.subList(normalizedValue, synonymsList)], entityRoles));
                    } else {
                        // closed list with this name already exists
                        let subListExists = helpers.filterMatch(closedListExists[0].subLists, 'canonicalForm', normalizedValue);
                        if (subListExists.length === 0) {
                            closedListExists[0].subLists.push(new helperClass.subList(normalizedValue, synonymsList));
                        } else {
                            synonymsList.forEach(function (listItem) {
                                if (!subListExists[0].list.includes(listItem)) subListExists[0].list.push(listItem);
                            })
                        }
                        // see if the roles all exist and if not, add them
                        mergeRoles(closedListExists[0].roles, entityRoles);
                    }
                }
            } else if (entityType.toLowerCase().trim().indexOf('phraselist') === 0) {
                if (entityType.toLowerCase().includes('interchangeable')) {
                    entityName += '(interchangeable)';
                }
                handlePhraseList(parsedContent, entityName, entityType, entityRoles, entity.SynonymsOrPhraseList, entity.ParseTree.entityDefinition().entityLine());
            } else if (entityType.startsWith('[')) {
                handleComposite(parsedContent, entityName, entityType, entityRoles, entity.ParseTree.entityDefinition().entityLine(), true, true);
            } else if (entityType.startsWith('/')) {
                if (entityType.endsWith('/')) {
                    handleRegExEntity(parsedContent, entityName, entityType, entityRoles, entity.ParseTree.entityDefinition().entityLine());
                } else {
                    let errorMsg = `RegEx entity: ${regExEntity.name} is missing trailing '/'. Regex patterns need to be enclosed in forward slashes. e.g. /[0-9]/`;
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        context: entity.ParseTree.entityDefinition().entityLine()
                    })

                    throw (new exception(retCode.errorCode.INVALID_REGEX_ENTITY, error.toString()));
                }
            } else {
                // TODO: handle other entity types
            }
        }
    }
};
/**
 * 
 * @param {Object} parsedContent Object containing the parsed structure - LUIS, QnA, QnA alterations
 * @param {String} entityName name of entity
 * @param {String} entityType type of entity
 * @param {String []} entityRoles array of entity roles found
 * @param {String} entityLine current line being parsed/ handled.
 */
const handleRegExEntity = function(parsedContent, entityName, entityType, entityRoles, entityLine) {
    // check if this regex entity is already labelled in an utterance and or added as a simple entity. if so, throw an error.
    try {
        let rolesImport = VerifyAndUpdateSimpleEntityCollection(parsedContent, entityName, 'RegEx');
        if (rolesImport.length !== 0) {
            rolesImport.forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        }
    } catch (err) {
        throw (err);
    }
    let regex = '';
    // handle regex entity 
    if (entityType) {
        regex = entityType.slice(1, entityType.length - 1);
        if (regex === '') {
            let errorMsg = `RegEx entity: ${entityName} has empty regex pattern defined.`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: entityLine
            })

            throw (new exception(retCode.errorCode.INVALID_REGEX_ENTITY, error.toString()));
        }
    }
    
    // add this as a regex entity if it does not exist
    let regExEntity = (parsedContent.LUISJsonStructure.regex_entities || []).find(item => item.name == entityName);
    if (regExEntity === undefined) {
        parsedContent.LUISJsonStructure.regex_entities.push(new helperClass.regExEntity(entityName, regex, entityRoles))
    } else {
        // throw an error if the pattern is different for the same entity
        if (regExEntity.regexPattern !== '' && regex !== '' && regExEntity.regexPattern !== regex) {
            let errorMsg = `RegEx entity: ${regExEntity.name} has multiple regex patterns defined. \n 1. /${regex}/\n 2. /${regExEntity.regexPattern}/`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: entityLine
            })

            throw (new exception(retCode.errorCode.INVALID_REGEX_ENTITY, error.toString()));
        } else {
            // update roles
            addItemOrRoleIfNotPresent(parsedContent.LUISJsonStructure, LUISObjNameEnum.REGEX, regExEntity.name, entityRoles);
            // add regex pattern
            if (regExEntity.regexPattern === '') regExEntity.regexPattern = regex;
        }
    }
}

/**
 * Intent parser code to parse intent section.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleQnaSection = function (parsedContent, luResource) {
    // handle QNA
    let qnas = luResource.Sections.filter(s => s.SectionType === SectionType.QNASECTION);
    if (qnas && qnas.length > 0) {
        for (const qna of qnas) {
            let questions = qna.Questions;
            let filterPairs = qna.FilterPairs;
            let metadata = [];
            if (filterPairs && filterPairs.length > 0) {
                filterPairs.forEach(pair => metadata.push(new qnaMetaDataObj(pair.key, pair.value)));
            }

            let answer = qna.Answer;
            parsedContent.qnaJsonStructure.qnaList.push(new qnaListObj(0, answer.trim(), 'custom editorial', questions, metadata));
        }
    }
}

/**
 * Intent parser code to parse intent section.
 * @param {parserObj} Object with that contains list of additional files to parse, parsed LUIS object and parsed QnA object
 * @param {LUResouce} luResource resources extracted from lu file content
 * @param {boolean} log indicates if we need verbose logging.
 * @throws {exception} Throws on errors. exception object includes errCode and text.
 */
const parseAndHandleModelInfoSection = function (parsedContent, luResource, log) {
    // handle model info
    let enableMergeIntents = true;
    let modelInfos = luResource.Sections.filter(s => s.SectionType === SectionType.MODELINFOSECTION);
    if (modelInfos && modelInfos.length > 0) {
        for (const modelInfo of modelInfos) {
            let line = modelInfo.ModelInfo
            let kvPair = line.split(/@(app|kb|intent|entity|enableMergeIntents).(.*)=/g).map(item => item.trim());
            if (kvPair.length === 4) {
                if (kvPair[1] === 'enableMergeIntents' && kvPair[3] === 'false') {
                    enableMergeIntents = false;
                    continue;
                }

                let hasError = false;
                kvPair.forEach(item => {
                    if (item.trim() === '') {
                        if (log) {
                            process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid model info found. Skipping "' + line + '"\n'));
                        }

                        hasError = true;
                    }
                })

                if(hasError) {
                    continue;
                }

                if (kvPair[1].toLowerCase() === 'app') {
                    parsedContent.LUISJsonStructure[kvPair[2]] = kvPair[3];
                } else if (kvPair[1].toLowerCase() === 'kb') {
                    parsedContent.qnaJsonStructure[kvPair[2]] = kvPair[3];
                } else if (kvPair[1].toLowerCase() === 'intent') {
                    if (kvPair[2].toLowerCase() === 'inherits') {
                        let inheritsProperties = kvPair[3].split(/[:;]/g).map(item => item.trim());
                        if (inheritsProperties.length !== 6) {
                            process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid intent inherits information found. Skipping "' + line + '"\n'));
                        } else {
                            // find the intent
                            let intent = parsedContent.LUISJsonStructure.intents.find(item => item.name == inheritsProperties[1]);
                            if (intent === undefined) {
                                let newIntent = {
                                    "name": inheritsProperties[1],
                                    "inherits": {}
                                };
                                newIntent['inherits'][inheritsProperties[2]] = inheritsProperties[3];
                                newIntent['inherits'][inheritsProperties[4]] = inheritsProperties[5];
                                parsedContent.LUISJsonStructure.intents.push(newIntent);
                            } else {
                                if (intent['inherits'] === undefined) intent['inherits'] = {};
                                intent['inherits'][inheritsProperties[2]] = inheritsProperties[3];
                                intent['inherits'][inheritsProperties[4]] = inheritsProperties[5];
                            }
                        }
                    } else {
                        if (log) {
                            process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid intent inherits information found. Skipping "' + line + '"\n'));
                        }
                    }
                } else if (kvPair[1].toLowerCase() === 'entity') {
                    if (kvPair[2].toLowerCase() === 'inherits') {
                        let inheritsProperties = kvPair[3].split(/[:;]/g).map(item => item.trim());
                        if (inheritsProperties.length !== 6) {
                            process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid entity inherits information found. Skipping "' + line + '"\n'));
                        } else {
                            // find the intent
                            let entity = parsedContent.LUISJsonStructure.entities.find(item => item.name == inheritsProperties[1]);
                            if (entity === undefined) {
                                let newEntity = {
                                    "name": inheritsProperties[1],
                                    "inherits": {}
                                };
                                newEntity['inherits'][inheritsProperties[2]] = inheritsProperties[3];
                                newEntity['inherits'][inheritsProperties[4]] = inheritsProperties[5];
                                parsedContent.LUISJsonStructure.entities.push(newEntity);
                            } else {
                                if (entity['inherits'] === undefined) entity['inherits'] = {};
                                entity['inherits'][inheritsProperties[2]] = inheritsProperties[3];
                                entity['inherits'][inheritsProperties[4]] = inheritsProperties[5];
                            }
                        }
                    } else {
                        if (log) {
                            process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid entity inherits information found. Skipping "' + line + '"\n'));
                        }
                    }
                }
            } else {
                if (log) {
                    process.stdout.write(chalk.default.yellowBright('[WARN]: Invalid model info found. Skipping "' + line + '"\n'));
                }
            }
        }
    }

    return enableMergeIntents;
}


/**
 * Helper function to verify that the requested entity does not already exist
 * @param {parserObj} parsedContent parserObj containing current parsed content
 * @param {String} entityName 
 * @param {String} entityType 
 * @returns {String[]} Possible roles found to import into the explicitly defined entity type.
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const VerifyAndUpdateSimpleEntityCollection = function (parsedContent, entityName, entityType) {
    let entityRoles = [];
    // Find this entity if it exists in the simple entity collection
    let simpleEntityExists = (parsedContent.LUISJsonStructure.entities || []).find(item => item.name == entityName);
    if (simpleEntityExists !== undefined) {
        // take and add any roles into the roles list
        (simpleEntityExists.roles || []).forEach(role => !entityRoles.includes(role) ? entityRoles.push(role) : undefined);
        // remove this simple entity definition
        // Fix for #1137.
        // Current behavior does not allow for simple and phrase list entities to have the same name. 
        if (entityType != 'Phrase List') {
            for (var idx = 0; idx < parsedContent.LUISJsonStructure.entities.length; idx++) {
                if (parsedContent.LUISJsonStructure.entities[idx].name === simpleEntityExists.name) {
                    parsedContent.LUISJsonStructure.entities.splice(idx, 1);
                }
            }
        }
    }
    // Find if this entity is referred in a labelled utterance
    let entityExistsInUtteranceLabel = (parsedContent.LUISJsonStructure.utterances || []).find(item => {
        let entityMatch = (item.entities || []).find(entity => entity.entity == entityName)
        if (entityMatch !== undefined) return true;
        return false;
    });

    if (entityExistsInUtteranceLabel !== undefined) {
        let entityMatch = entityExistsInUtteranceLabel.entities.filter(item => item.entity == entityName);
        entityMatch.forEach(entity => {
            if (entity.role !== undefined) {
                if (!entityRoles.includes(entity.role)) {
                    entityRoles.push(entity.role);
                }
            } else if (entityType !== 'Phrase List') {              // Fix for # 1151. Phrase lists can have same name as other entities.
                let errorMsg = `'${entityType}' entity: "${entityName}" is added as a labelled entity in utterance "${entityExistsInUtteranceLabel.text}". ${entityType} cannot be added with explicit labelled values in utterances.`
                let error = BuildDiagnostic({
                    message: errorMsg
                });

                throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
            }
        });
    }
    return entityRoles;
}

/**
 * Helper function to recursively pull entities from parsed utterance text
 * @param {parserEntity} list
 * @param {Object} retObj {entitiesFound, utteranceWithoutEntityLabel}
 * @param {number} parentIdx index where this list occurs in the parent
 * @returns {string[]} resolved values to add to the parent list
 * @throws {exception} Throws on errors. exception object includes errCode and text.  
 */
const flattenLists = function (list, retObj, parentIdx) {
    let retValue = []
    if (list.entity !== undefined) list.entity = list.entity.trim();
    if (list.role !== undefined) list.role = list.role.trim();
    if (list.startPos !== undefined) list.startPos = parentIdx;
    let offset = 0;
    list.value.forEach((item, idx) => {
        if (item instanceof helperClass.parserEntity) {
            let valuesToInsert = flattenLists(item, retObj, offset + parentIdx);
            if (valuesToInsert.length > 0) {
                retValue = retValue.concat(valuesToInsert);
                offset += valuesToInsert.length;
            }
        } else {
            retValue.push(item);
            if (item === ' ') {
                if (idx !== 0 && idx !== (list.value.length - 1)) {
                    offset++;
                }
            } else {
                offset++;
            }
        }
    });
    if (list.value.length === 0) {
        list.type = LUISObjNameEnum.PATTERNANYENTITY;
        if (list.role != '') {
            retValue = `{${list.entity}:${list.role}}`.split('');
        } else {
            retValue = `{${list.entity}}`.split('');
        }
    } else {
        list.type = LUISObjNameEnum.ENTITIES;
    }
    retValue = retValue.join('').trim();
    if (list.endPos !== undefined) list.endPos = parentIdx + retValue.length - 1;
    retObj.entitiesFound.push(new helperClass.parserEntity(undefined, list.startPos, list.entity, retValue, list.endPos, list.type, list.role));
    return retValue.split('');
};

/**
 * Helper function to add an item to collection if it does not exist
 * @param {object} collection contents of the current collection
 * @param {LUISObjNameEnum} type item type
 * @param {object} value value of the current item to examine and add
 * @returns {void} nothing
 */
const addItemIfNotPresent = function (collection, type, value) {
    let hasValue = false;
    for (let i in collection[type]) {
        if (collection[type][i].name === value) {
            hasValue = true;
            break;
        }
    }
    if (!hasValue) {
        let itemObj = {};
        itemObj.name = value;
        if (type == LUISObjNameEnum.PATTERNANYENTITY) {
            itemObj.explicitList = [];
        }
        if (type !== LUISObjNameEnum.INTENT) {
            itemObj.roles = [];
        }
        collection[type].push(itemObj);
    }
};

/**
 * Helper function to add an item to collection if it does not exist
 * @param {object} collection contents of the current collection
 * @param {LUISObjNameEnum} type item type
 * @param {object} value value of the current item to examine and add
 * @param {string []} roles possible roles to add to the item
 * @returns {void} nothing
 */
const addItemOrRoleIfNotPresent = function (collection, type, value, roles) {
    let existingItem = collection[type].filter(item => item.name == value);
    if (existingItem.length !== 0) {
        // see if the role exists and if so, merge
        if (existingItem[0].roles === undefined) {
            existingItem[0].roles = [];
        }

        mergeRoles(existingItem[0].roles, roles);
    } else {
        let itemObj = {};
        itemObj.name = value;
        if (type == LUISObjNameEnum.PATTERNANYENTITY) {
            itemObj.explicitList = [];
        }
        if (type !== LUISObjNameEnum.INTENT) {
            itemObj.roles = roles;
        }
        collection[type].push(itemObj);
    }
}

/**
 * Helper function merge roles
 * @param {string []} srcEntityRoles contents of the current collection
 * @param {string []} tgtEntityRoles target entity roles collection to merge
 * @returns {void} nothing
 */
const mergeRoles = function (srcEntityRoles, tgtEntityRoles) {
    const rolesMap = srcEntityRoles.reduce((map, role) => (map[role] = true, map), {});
    tgtEntityRoles.forEach(role => {
        if (!rolesMap[role]) {
            srcEntityRoles.push(role);
        }
    });
}

/**
 * Helper function that returns true if the item exists. Merges roles before returning 
 * @param {Object} collection contents of the current collection
 * @param {string} entityName name of entity to look for in the current collection
 * @param {string []} entityRoles target entity roles collection to merge
 * @returns {void} nothing
 */
const itemExists = function (collection, entityName, entityRoles) {
    let matchInClosedLists = helpers.filterMatch(collection, 'name', entityName);
    if (matchInClosedLists.length !== 0) {
        // merge roles if there are any roles in the pattern entity
        if (entityRoles.length !== 0) {
            mergeRoles(matchInClosedLists[0].roles, entityRoles);
        }
        return true;
    }
    return false;
}

module.exports = parseFileContentsModule;
