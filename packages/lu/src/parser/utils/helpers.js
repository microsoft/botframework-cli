/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const fs = require('fs');
const path = require('path');
const retCode = require('./enums/CLI-errors');
const exception = require('./exception');
const NEWLINE = require('os').EOL;
const ANY_NEWLINE = /\r\n|\r|\n/g;
const url = require('url');
const hClasses = require('../lufile/classes/hclasses');
const helpers = {

    /**
     * 
     * @param {string} fileContent string content of file may contain any new line chars.
     * @returns {string} string content of file using current OS new line char
     */
    sanitizeNewLines(fileContent) {
        return fileContent.replace(ANY_NEWLINE, NEWLINE);
    },
    /**
     * Enumeration of supported file extension types
     */
    FileExtTypeEnum: {
        LUFile : '.lu',
        QnAFile : '.qna'
    },
    /**
     * Helper function to recursively get all .lu files
     * @param {string} inputfolder input folder name
     * @param {boolean} getSubFolder indicates if we should recursively look in sub-folders as well
     * @param {FileExtTypeEnum} extType indicates if we should look for LUFile or QnAFile
     * @returns {Array} Array of .lu files found
    */
    findLUFiles: function (inputFolder, getSubFolders, extType = this.FileExtTypeEnum.LUFile) {
        let results = [];
        fs.readdirSync(inputFolder).forEach(function (dirContent) {
            dirContent = path.resolve(inputFolder, dirContent);
            if (getSubFolders && fs.statSync(dirContent).isDirectory()) {
                results = results.concat(helpers.findLUFiles(dirContent, getSubFolders, extType));
            }
            if (fs.statSync(dirContent).isFile()) {
                if (dirContent.endsWith(extType)) {
                    results.push(dirContent);
                }
            }
        });
        return results;
    },
    /**
     * Helper function to get config.json files
     * @param {string} inputfolder input folder name
     * @returns {string} config.json file path found
    */
    findConfigFile: function (inputFolder) {
        const dirContent = path.resolve(inputFolder, 'config.json')
        try{
            if (fs.statSync(dirContent).isFile()) {
                return dirContent
            }
        } catch {
            throw new Error(`No config.json file found under folder ${path.resolve(inputFolder)}`)
        }        
    },
    /**
     * Helper function to parse link URIs in utterances
     * @param {String} utterance
     * @param {String} srcId
     * @param {Object} luSearchFn
     * @returns {Object} Object that contains luFile and ref. ref can be Intent-Name or ? or * or **
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    parseLinkURI: async function (utterance, srcId = null, luSearchFn = null) {
        let linkValueList = utterance.trim().match(new RegExp(/\(.*?\)/g));
        let linkValue = linkValueList[0].replace('(', '').replace(')', '');
        if (linkValue === '') throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}"`));
        // reference can either be #<Intent-Name> or #? or /*#? or /**#? or #*utterance* or #<Intent-Name>*patterns*
        let splitRegExp = new RegExp(/^(?<fileName>.*?)(?<segment>#|\*+)(?<path>.*?)$/gim);
        let splitReference = splitRegExp.exec(linkValue);
        if (!splitReference) throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}".\n Reference needs a qualifier - either a #Intent-Name or #? or *#? or **#? or #*utterances* etc.`));
        if (splitReference.groups.fileName && srcId && luSearchFn) {
            let luObjects = await luSearchFn(srcId, [{filePath: splitReference.groups.fileName, includeInCollate: false}])
            if (luObjects && luObjects.length > 0) splitReference.groups.fileName = luObjects[0].id
        }
        if (splitReference.groups.segment.includes('*')) {
            if (splitReference.groups.path === '') {
                throw (new exception(retCode.errorCode.INVALID_LU_FILE_REF, `[ERROR]: Invalid LU File Ref: "${utterance}".\n '*' and '**' can only be used with QnA qualitifier. e.g. *#? and **#?`));
            }
            splitReference.groups.fileName += '*';
        }
        return splitReference.groups;
    },
    /**
     * Helper function to do a filter operation based search over an Array
     * @param {Array} srcList Object to filter on
     * @param {string} property Property to evaluate
     * @param {string} searchValue Target value to compare
     * @returns {Array} Array of matching values
     */
    filterMatch: function (srcList, property, searchValue) {
        return srcList.filter(function (item) {
            return item[property] == searchValue;
        });
    },
    /**
     * Helper function to get roles if defined via the entity type definition
     * @param {String} entityType entity type definition passed in.
     * @returns {Object} roles and entityType parsed out. roles is always a list even if no role definitions are found
     */
    getRolesAndType: function (entityType) {
        let returnValue = {
            roles: [],
            entityType: ''
        };
        let RoleDetectionRegEx = new RegExp(/[Rr]ole[s]*[\s?]*=/g);
        let RolesSplitRegEx = new RegExp(/[;,]/g);
        let [parsedEntityType, parsedRoleDefinition] = entityType.split(RoleDetectionRegEx).map(item => item.trim());
        returnValue.entityType = parsedEntityType;
        if (parsedRoleDefinition !== undefined) {
            returnValue.roles = parsedRoleDefinition.replace('[', '').replace(']', '').split(RolesSplitRegEx).map(item => item.trim());
        }
        return returnValue;
    },
    /**
     * Helper function to detect if a given text is a link reference
     * @param {String} utterance utterance text to examine
     * @returns {Boolean} true if input is a link reference
     */
    isUtteranceLinkRef: function (utterance) {
        utterance = utterance || '';
        // Ensure only links are detected and passed on to be parsed.
        // Valid link: [bar](xyz), [bar][2]
        // Not a link: [bar](xyz|123), [bar[tar]](xyz), abc [foo](bar)
        let linkDetectRegex = /^\[[^\[]+\](\([^|]+\)|\[[^\[]+\])$/gi;
        return linkDetectRegex.test(utterance);
    },
    /**
     * Helper function to detect if a given text is a pattern.
     * @param {String} utterance
     * @returns {Boolean} true if utterance is a pattern 
     */
    isUtterancePattern: function (utterance) {
        utterance = utterance || '';
        // link references cannot be a pattern
        if (this.isUtteranceLinkRef(utterance)) return false;

        // patterns must have at least one [optional] and or one (group | text)
        let detectPatternRegex = /(\[.*?\])|(\(.*?(\|.*?)+\))/gi;
        return detectPatternRegex.test(utterance);
    },
    hashCode : function(s) {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    },
    /**
     * Helper to detect luis schema version based on content and update the final payload as needed.
     * @param {LUIS} finalLUISJSON 
     */
    checkAndUpdateVersion : function(finalLUISJSON) {
        if (!finalLUISJSON) return;
        // clean up house keeping
        if (finalLUISJSON.flatListOfEntityAndRoles)  delete finalLUISJSON.flatListOfEntityAndRoles
        if (finalLUISJSON.utteranceHash) delete finalLUISJSON.utteranceHash
        // Detect if there is content specific to 5.0.0 schema
        // any entity with children
        if (!finalLUISJSON) {
            return
        }
        updateToV7(finalLUISJSON);
    },
    cleanUpExplicitEntityProperty : function(finalLUISJSON) {
        (finalLUISJSON.entities || []).forEach(e => {
            if (e.explicitlyAdded !== undefined) delete e.explicitlyAdded;
        })
    },
    fixBuffer : function(fileBuffer) {
        if (fileBuffer) {
          // If the data starts with BOM, we know it is UTF
          if (fileBuffer[0] === 0xEF && fileBuffer[1] === 0xBB && fileBuffer[2] === 0xBF) {
            // EF BB BF  UTF-8 with BOM
            fileBuffer = fileBuffer.slice(3)
          } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
            // FF FE 00 00  UTF-32, little-endian BOM
            fileBuffer = fileBuffer.slice(4)
          } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFE && fileBuffer[3] === 0xFF) {
            // 00 00 FE FF  UTF-32, big-endian BOM
            fileBuffer = fileBuffer.slice(4)
          } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF && fileBuffer[2] === 0x00 && fileBuffer[3] === 0x00) {
            // FE FF 00 00  UCS-4, unusual octet order BOM (3412)
            fileBuffer = fileBuffer.slice(4)
          } else if (fileBuffer[0] === 0x00 && fileBuffer[1] === 0x00 && fileBuffer[2] === 0xFF && fileBuffer[3] === 0xFE) {
            // 00 00 FF FE  UCS-4, unusual octet order BOM (2143)
            fileBuffer = fileBuffer.slice(4)
          } else if (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xFE) {
            // FF FE  UTF-16, little endian BOM
            fileBuffer = fileBuffer.slice(2)
          } else if (fileBuffer[0] === 0xFE && fileBuffer[1] === 0xFF) {
            // FE FF  UTF-16, big endian BOM
            fileBuffer = fileBuffer.slice(2)
          }
        }
        return fileBuffer.toString('utf8').replace(/\0/g, '');
      }
      
};

module.exports = helpers;

const updateToV7 = function(finalLUISJSON) {
    let v7DefFound = false;
    v7DefFound = (finalLUISJSON.entities || []).find(i => i.children || i.features) ||
        (finalLUISJSON.intents || []).find(i => i.features) ||
        (finalLUISJSON.composites || []).find(i => i.features) ||
        (finalLUISJSON.luis_schema_version === '6.0.0' || 
        (finalLUISJSON.luis_schema_version === '7.0.0'));
    if (v7DefFound) {
        finalLUISJSON.luis_schema_version = "7.0.0";
        if (finalLUISJSON.hasOwnProperty("model_features")) {
            if (finalLUISJSON.model_features !== undefined) {
                finalLUISJSON.phraselists = finalLUISJSON.phraselists || [];
                finalLUISJSON.model_features.forEach(item => {
                    if (item.enabledForAllModels === undefined)
                        item.enabledForAllModels = true;
                    finalLUISJSON.phraselists.push(Object.assign({}, item));
                });
            }
            delete finalLUISJSON.model_features;
        }
        (finalLUISJSON.composites || []).forEach(composite => {
            let children = composite.children;
            composite.children = [];
            children.forEach(c => {
                if (c.name === undefined) {
                    composite.children.push({ name: c });
                }
                else {
                    composite.children.push(c);
                }
            });
        });
        (finalLUISJSON.entities || []).forEach(entity => transformAllEntityConstraintsToFeatures(entity));
        (finalLUISJSON.intents || []).forEach(intent => addIsRequiredProperty(intent));
        // do we have nDepthEntities?
        let nDepthEntityExists = (finalLUISJSON.entities || []).find(x => x.children !== undefined && Array.isArray(x.children) && x.children.length !== 0);
        if (nDepthEntityExists !== undefined) {
            // Remove dead ML entity definitions. 
            removeDeadMLEntityDefinitions(finalLUISJSON);
            let entityParentTree = {};
            const curPath = ["$root$"];
            constructEntityParentTree(finalLUISJSON.entities, entityParentTree, curPath);
            updateEntityParentTreeWithAllEntityTypes(finalLUISJSON, entityParentTree);
            
            // Verify that all parents of a child entity are labelled.
            updateModelBasedOnNDepthEntities(finalLUISJSON.utterances, entityParentTree);
            
            transformUtterancesWithNDepthEntities(finalLUISJSON, entityParentTree)
            verifyPatternsDoNotHaveChildEntityReferences(finalLUISJSON, entityParentTree)    
        }
    }
}

const removeDeadMLEntityDefinitions = function(finalLUISJSON) {
    let idxToRemove = [];
    (finalLUISJSON.entities || []).forEach((entity, idx) => {
        if (entity.explicitlyAdded === undefined || entity.explicitlyAdded !== true) {
            // is this entity a child to a composite?
            let compositeChild = (finalLUISJSON.composites || []).find(c => {
                let x = c.children.find(x => {
                    return x.name == entity.name
                })
                return x != undefined;
            });
            if (compositeChild !== undefined) return;
            // is not the same name as a phrase list
            let entityIsPL = (finalLUISJSON.phraselists || []).find(x => x.name == entity.name);
            if (entityIsPL !== undefined) return;
            idxToRemove.push(idx)
        }
    })
    if (idxToRemove.length !== 0) {
        idxToRemove.reverse().forEach(i => finalLUISJSON.entities.splice(i, 1))
    }
}

const updateModelBasedOnNDepthEntities = function(utterances, entityParentTree) 
{
    let utterancesWithLabels = utterances.filter(utterance => utterance.entities && utterance.entities.length !== 0);
    utterancesWithLabels.forEach(utterance => {
        utterance.entities.forEach(entityInUtterance => {
            let parentsForEntity = entityParentTree[entityInUtterance.entity];
            if (parentsForEntity === undefined) return;
            // do not proceed further if there isnt at least one non root parent
            let nonRootParents = parentsForEntity.filter(t => t[0] != "$root$");
            if (nonRootParents.length === 0) return;
            let parentIsLabelled = false;
            nonRootParents.forEach(tree => {
                if (tree.length === 1 && tree[0] === "$root$") return;
                if (parentIsLabelled) return;
                tree.forEach(parent => {
                    if (parent === "$root$") return;
                    if (parentIsLabelled) return;
                    let parentInUtterance = utterance.entities.find(x => x.entity == parent);
                    if (parentInUtterance !== undefined) {
                        parentIsLabelled = true;
                    }
                })
            })
            if (!parentIsLabelled) {
                // Is the entity a root entity? 
                let isRootEntity = parentsForEntity.find(t => t[0] == "$root$")
                if (isRootEntity === undefined) {
                    const errorMsg = `Every child entity labelled in an utterance must have its parent labelled in that utterance. Child entity "${entityInUtterance.entity}" does not have its parent labelled in utterance "${utterance.text}" for intent "${utterance.intent}".`;
                    throw (new exception(retCode.errorCode.INVALID_INPUT, errorMsg));
                }
            }
        })
    })
}

const verifyPatternsDoNotHaveChildEntityReferences = function(finalLUISJSON, entityParentTree)
{
    if (finalLUISJSON.patterns === undefined || !Array.isArray(finalLUISJSON.patterns) || finalLUISJSON.patterns.length === 0) return;
     (finalLUISJSON.patterns || []).forEach(pattern => {
        // detect if pattern has an entity definition
        let entitiesRegExp = /{(?<entity>[^{,}]+)}/gmi;
        let entitiesFound = pattern.pattern.match(entitiesRegExp);
        if (entitiesFound !== null) {
            // verify that each entity is not a child entity
            entitiesFound.forEach(entity => {
                entity = entity.replace(/[{}]/g, '');
                let entityInTree = entityParentTree[entity]
                if (entityInTree !== undefined) {
                    // at least one of these need to be a root entity.
                    let isEntityAlsoRoot = entityInTree.find(item => item[0] === "$root$");
                    if (isEntityAlsoRoot === undefined) {
                        throw (new exception(retCode.errorCode.INVALID_INPUT, `Patterns cannot contain references to child entities. Pattern: "${pattern.pattern}" has reference to "{${entity}}".`));
                    }                
                }
            })
        }
    })
}

const updateEntityParentTreeWithAllEntityTypes = function(finalLUISJSON, entityParentTree)
{
    let collection = ["prebuiltEntities", "patternAnyEntities" ,"model_features", "phraselists", "regex_entities", "closedLists", "composites"];
    collection.forEach(item => {
        (finalLUISJSON[item] || []).forEach(entity => addEntityToParentTree(entityParentTree, entity.name));
    })
}

const addEntityToParentTree = function(entityParentTree, entityName)
{
    if (entityParentTree[entityName] === undefined) {
        entityParentTree[entityName] = [["$root$"]];
    } else {
        entityParentTree[entityName].push(["$root$"]);
    }
}

const constructEntityParentTree = function(entityCollection, entityParentTree, curPath)
{
    entityCollection.forEach(entity => {
        if (entity.children !== undefined && Array.isArray(entity.children) && entity.children.length !== 0) {
            constructEntityParentTree(entity.children, entityParentTree, curPath.concat(entity.name));
        }
        updateTreeWithNode(curPath, entity.name, entityParentTree)
    })
}
const updateTreeWithNode = function(curPath, entityName, entityParentTree) {
    let revPath = JSON.parse(JSON.stringify(curPath.reverse()));
    if (entityParentTree[entityName] === undefined) {
        entityParentTree[entityName] = [revPath];
    }
    else {
        if (entityParentTree[entityName].find(item => item.join('->') == revPath.join('->')) === undefined)
            entityParentTree[entityName].push(revPath);
    }
    curPath.reverse();
}

const transformUtterancesWithNDepthEntities = function (finalLUISJSON, entityParentTree) {
    (finalLUISJSON.utterances || []).forEach(utt => {
        if (utt.entities !== undefined && Array.isArray(utt.entities) && utt.entities.length !== 0) {
            // sort all entities by start and end position
            utt.entities = objectSortByStartPos(utt.entities)
            let entityIdsToRemove = [];
            utt.entities.forEach((item, idx) => {
                // find the immediate parents of this entity
                // if the enity has a role, find by that
                let entityToFind = item.role || item.entity;
                
                if (entityParentTree[entityToFind] === undefined) {
                    return;
                }
                let parentPathsForEntity = entityParentTree[entityToFind];
                let parentIdx = [];
                parentPathsForEntity.forEach(path => {
                    utt.entities.find((i, id) => {
                        if (i.entity === path[0] && i.startPos <= item.startPos && i.endPos >= item.endPos) {
                            parentIdx.push(id);
                        } 
                    })
                })
                if (parentIdx.length !== 0) {
                    parentIdx.forEach(id => {
                        if (item.role !== undefined) {
                            item.entity = item.role;
                            delete item.role;
                        }
                        if (utt.entities[id].children === undefined) {
                            utt.entities[id].children = [item]
                        } else {
                            utt.entities[id].children.push(item);
                        }
                    })
                    entityIdsToRemove.push(idx);
                }
            })
            if (entityIdsToRemove.length !== 0) {
                entityIdsToRemove.sort((a, b) => b - a).forEach(id => {
                    utt.entities.splice(id, 1);
                })
            }
            // remove any children that are not a root entity
            removeNonRootChildren(utt.entities, finalLUISJSON.entities)
        }
    })
}

const removeNonRootChildren = function(entitiesList, allEntitiesList) {
    let idxToRemove = [];
    entitiesList.forEach((entity, idx) => {
        if (!isRootEntity(entity.entity, allEntitiesList)) {
            idxToRemove.push(idx)
        }
    })
    if (idxToRemove.length !== 0) {
        idxToRemove.sort((a,b) => b-a).forEach(id => entitiesList.splice(id, 1));
        idxToRemove = [];
    }
    // de-dupe children
    deDupeChildren(entitiesList);
}

const deDupeChildren = function(collection) {
    collection.forEach(entity => {
        if (entity.children !== undefined && Array.isArray(entity.children) && entity.children.length !== 0) {
            let childAsStr = entity.children.map(item => JSON.stringify(item));
            var newList = [];
            childAsStr.forEach(item => {
                if (newList.indexOf(item) === -1) newList.push(item)
            })
            entity.children = newList.map(item => JSON.parse(item))
            deDupeChildren(entity.children)
        }
    })
}

const isRootEntity = function (entityName, entitiesCollection) {
    if ((entitiesCollection || []).find(ecEntity => ecEntity.name == entityName) !== undefined)
        return true
    return false
}

const findParent = function (entityInUtt, entityCollection, parentTree, curParent) {
    let numOfParentsFound = 0;
    entityCollection.forEach(childEntity => {
        if (childEntity.name == entityInUtt.entity) {
            parentTree[curParent] = childEntity.name;
            numOfParentsFound++;
        }
        if (childEntity.children !== undefined && Array.isArray(childEntity.children) && childEntity.children.length !== 0) {
            parentTree[childEntity.name] = {};
            numOfParentsFound += findParent(entityInUtt, childEntity.children, parentTree[childEntity.name], childEntity.name)
        }
    });
    return numOfParentsFound;
}

const objectSortByStartPos = function (objectArray) {
    let ObjectByStartPos = objectArray.slice(0);
    ObjectByStartPos.sort(function (a, b) {
        if (a.startPos === b.startPos)
            return a.endPos - b.endPos;
        return a.startPos - b.startPos;
    })
    return ObjectByStartPos
}

const transformAllEntityConstraintsToFeatures = function(entity) {
    addIsRequiredProperty(entity);
    if (entity.hasOwnProperty("instanceOf") && entity.instanceOf !== null) {
        if (entity.hasOwnProperty("features") && Array.isArray(entity.features)) {
            let featureFound = (entity.features || []).find(i => i.modelName == entity.instanceOf);
            if (featureFound !== undefined) {
                if (featureFound.featureType === undefined)
                    featureFound.isRequired = true;
            }
            else {
                entity.features.push(new hClasses.entityFeature(entity.instanceOf, true));
            }
        }
        else {
            if (entity.instanceOf !== "" && entity.instanceOf !== null)
            entity.features = [new hClasses.entityFeature(entity.instanceOf, true)];
        }
    }
    delete entity.instanceOf;
    if (!entity.children || entity.children.length === 0)
        return;
    entity.children.forEach(c => transformAllEntityConstraintsToFeatures(c));
};

const addIsRequiredProperty = function(item) {
    (item.features || []).forEach(feature => {
        if (feature.isRequired === undefined)
            feature.isRequired = false;
        delete feature.featureType;
        delete feature.modelType;
    });
}