const exception = require('./../lufile/classes/exception')
const helpers = require('./../lufile/helpers');
const retCode = require('./../lufile/enums/CLI-errors');
const helperClass = require('./../lufile/classes/hclasses');
const BuildDiagnostic = require('./../lufile/diagnostic').BuildDiagnostic;

module.exports = {
    parseLuisJson: async function(LUISFileContent) {
        let LUISJSON;
        try {
            LUISJSON = await JSON.parse(LUISFileContent);
        } catch (err) {
            throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, error parsing content as LUIS JSON'));
        }
        await validateLUISJSON(LUISJSON)
        return LUISJSON;
    },
    /**
     * Helper function to validate parsed LUISJsonblob
     * @param {Object} LUISJSONBlob input LUIS Json blob
     * @returns {Boolean} True if validation succeeds.
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    validateLUISBlob: async function (LUISJSONBlob) {
        // look for entity name collisions - list, simple, patternAny, phraselist
        // look for list entities labelled
        // look for prebuilt entity labels in utterances

        let entitiesList = [];
        let entityFound = '';
        if (LUISJSONBlob.entities.length > 0) {
            LUISJSONBlob.entities.forEach(function (entity) {
                entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['simple'], entity.roles));
            });
        }
        if (LUISJSONBlob.closedLists.length > 0) {
            LUISJSONBlob.closedLists.forEach(function (entity) {
                entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
                if (entityFound.length === 0) {
                    entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['list'], entity.roles));
                } else {
                    entityFound[0].type.push('list');
                }
            });
        }
        if (LUISJSONBlob.patternAnyEntities.length > 0) {
            LUISJSONBlob.patternAnyEntities.forEach(function (entity) {
                entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
                if (entityFound.length === 0) {
                    entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['patternAny'], entity.roles));
                } else {
                    entityFound[0].type.push('patternAny');
                }
            });
        }

        if (LUISJSONBlob.regex_entities.length > 0) {
            LUISJSONBlob.regex_entities.forEach(function (entity) {
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
        const compositesEnt = (LUISJSONBlob.composites || []);
        compositesEnt.forEach(entity => {
            entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
            if (entityFound.length === 0) {
                entitiesList.push(new helperClass.validateLUISBlobEntity(entity.name, ['composite'], entity.roles));
            } else {
                entityFound[0].type.push('composite');
            }
        })

        // add any pre-built entities to the entities list.
        const prebuiltEnt = (LUISJSONBlob.prebuiltEntities || []);
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
        if (LUISJSONBlob.utterances.length > 0) {
            LUISJSONBlob.utterances.forEach(function (utterance) {
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
        if (LUISJSONBlob.composites.length > 0) {
            LUISJSONBlob.composites.forEach(composite => {
                // composites cannot include pattern.any entities as children
                if (LUISJSONBlob.patternAnyEntities.length > 0) {
                    let patternAnyEntityInComposite = (LUISJSONBlob.patternAnyEntities || []).find(patternAnyEntity => {
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

const validateLUISJSON = async function(LUISJSON) {
    if(!LUISJSON.intents && !LUISJSON.entities) {
        throw new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, input LUIS JSON file has no intents and entities');
    }
    if(LUISJSON.regex_features && LUISJSON.regex_features.length !== 0) {
        throw new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, input LUIS JSON file has references to regex_features. Cannot convert to .lu file.');
    }
}
