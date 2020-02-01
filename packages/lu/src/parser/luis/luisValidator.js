const retCode = require('./../utils/enums/CLI-errors')
const helpers = require('./../utils/helpers')
const exception = require('./../utils/exception')
const BuildDiagnostic = require('./../lufile/diagnostic').BuildDiagnostic;
const validateLUIS = function(luisJSON) {
    // look for entity name collisions - list, simple, patternAny, phraselist
    // look for list entities labelled
    // look for prebuilt entity labels in utterances

    let entitiesList = [];
    let entityFound = '';
    // add entities to entities list
    addEntities(luisJSON, entitiesList)
    // add closed lists to entities list
    addClosedLists(luisJSON, entitiesList, entityFound)
    // add pattern any entities to entities list
    addPatternAnyEntities(luisJSON, entitiesList, entityFound)
    //add regex entities to entities list.
    addregexEntities(luisJSON, entitiesList, entityFound)
    // add any composite entities to entities list.
    addCompositeEntities(luisJSON, entitiesList, entityFound)
    // add any pre-built entities to the entities list.
    addPrebuiltEntities(luisJSON, entitiesList, entityFound)
    // for each entityFound, see if there are duplicate definitions
    validateEntities(entitiesList)
    // do we have utterances with phraselist entities? 
    validateUtterances(luisJSON, entitiesList)
    // validate composite entities
    validateComposites(luisJSON, entitiesList)
    // do boundary validation
    validateBoundaries(luisJSON);
    return true;
}
const validateBoundaries = function(luisJSON) {
    // boundaries documented here - https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-boundaries

    // intents: 500 per application: 499 custom intents, and the required None intent.
    if (luisJSON.intents.length > retCode.boundaryLimits.MAX_NUM_INTENTS) {
        validationError(retCode.errorCode.BOUNDARY_INTENTS, `${luisJSON.intents.length} intents found in application. At most ${retCode.boundaryLimits.MAX_NUM_INTENTS} is allowed.`)
    }

    // utterances: 15,000 per application - there is no limit on the number of utterances per intent
    if (luisJSON.utterances.length > retCode.boundaryLimits.MAX_NUM_UTTERANCES) {
        validationError(retCode.errorCode.BOUNDARY_UTTERANCES, `${luisJSON.utterances.length} utterances found in application. At most ${retCode.boundaryLimits.MAX_NUM_UTTERANCES} is allowed.`)
    }

    // pattern.any entities - 100 per application
    if (luisJSON.patternAnyEntities.length > retCode.boundaryLimits.MAX_NUM_PATTERNANY_ENTITIES) {
        validationError(retCode.errorCode.BOUNDARY_PATTERNANYENTITY, `${luisJSON.patternAnyEntities.length} pattern.any entities found in application. At most ${retCode.boundaryLimits.MAX_NUM_PATTERNANY_ENTITIES} is allowed.`)
    }

    // Utterances - 500 characters.
    luisJSON.utterances.forEach(utt => {
        if (utt.text.length > retCode.boundaryLimits.MAX_CHAR_IN_UTTERANCE) {
            validationError(retCode.errorCode.BOUNDARY_UTTERANCE_CHAR_LENGTH, `utterance '${utt.text}' under intent '${utt.intent}' has ${utt.text.length} characters. At most ${retCode.boundaryLimits.MAX_CHAR_IN_UTTERANCE} is allowed.`)
        }
    })

    // patterns - 500 patterns per application.
    if (luisJSON.patterns.length > retCode.boundaryLimits.MAX_NUM_PATTERNS) {
        validationError(retCode.errorCode.BOUNDARY_PATTERNS, `${luisJSON.patterns.length} patterns found in application. At most ${retCode.boundaryLimits.MAX_NUM_PATTERNS} is allowed.`)
    }

    // patterns - Maximum length of pattern is 400 characters.
    luisJSON.patterns.forEach(utt => {
        if (utt.pattern.length > retCode.boundaryLimits.MAX_CHAR_IN_PATTERNS) {
            validationError(retCode.errorCode.BOUNDARY_PATTERN_CHAR_LIMIT, `Pattern '${utt.pattern}' under intent '${utt.intent}' has ${utt.pattern.length} characters. At most ${retCode.boundaryLimits.MAX_CHAR_IN_PATTERNS} characters are allowed in any pattern.`)
        }
    })

    // regex entity - 20 entities.
    if (luisJSON.regex_entities.length > retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES) {
        validationError(retCode.errorCode.BOUNDARY_REGEX_ENTITY, `${luisJSON.regex_entities.length} regex entities found in application. At most ${retCode.boundaryLimits.MAX_NUM_REGEX_ENTITIES} is allowed.`)
    }

    // regex entity - 500 character max. per regular expression entity pattern
    luisJSON.regex_entities.forEach(utt => {
        if (utt.regexPattern.length > retCode.boundaryLimits.MAX_CHAR_REGEX_ENTITY_PATTERN) {
            validationError(retCode.errorCode.BOUNDARY_REGEX_CHAR_LIMIT, `Regex entity '${utt.name}' with pattern /${utt.regexPattern}/ has ${utt.regexPattern.length} characters. At most ${retCode.boundaryLimits.MAX_CHAR_REGEX_ENTITY_PATTERN} is allowed.`)
        }
    })

    // list entities: Parent: 50; max 20000 synonyms.
    luisJSON.closedLists.forEach(listEntity => {
        if (listEntity.subLists.length > retCode.boundaryLimits.MAX_LIST_ENTITY_CANONICAL_FORM) {
            validationError(retCode.errorCode.BOUNDARY_LIST_PARENT_LIMIT, `${listEntity.name} list entity has ${listEntity.subLists.length} parents (normalized value). At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_CANONICAL_FORM} is allowed.`)
        }
        listEntity.subLists.forEach(subList => {
            if (subList.list.length > retCode.boundaryLimits.MAX_LIST_ENTITY_SYNONYMS) {
                validationError(retCode.errorCode.BOUNDARY_SYNONYMS_LENGTH, `'${listEntity.name}' list entity for parent (normalized value) '${subList.canonicalForm}' has ${subList.list.length} synonyms. At most ${retCode.boundaryLimits.MAX_LIST_ENTITY_SYNONYMS} is allowed.`)
            }
        })
    })

    let phraseLists = luisJSON.model_features || luisJSON.phraseLists || [];
    // phrase list - 500 phrase lists. 
    if (phraseLists.length > retCode.boundaryLimits.MAX_NUM_PHRASE_LISTS) {
        validationError(retCode.errorCode.BOUNDARY_PHRASE_LIST_LIMIT, `${phraseLists.length} phrase lists found in application. At most ${retCode.boundaryLimits.MAX_NUM_PHRASE_LISTS} is allowed.`)
    }

    // phrase list - Maximum number of total phrases per application of 500,000 phrases.
    let totalPhrasesInApp = 0;
    phraseLists.forEach(item => totalPhrasesInApp += item.words.split(',').length);
    if (totalPhrasesInApp > retCode.boundaryLimits.MAX_NUM_PHRASES_IN_ALL_PHRASE_LIST) {
        validationError(retCode.errorCode.BOUNDARY_TOTAL_PHRASES, `${totalPhrasesInApp} phrases found across all phrase list definitions. At most ${retCode.boundaryLimits.MAX_NUM_PHRASES_IN_ALL_PHRASE_LIST} is allowed.`)
    }

    // phrase list - Interchangeable Phraselist has max of 50,000 phrases. 
    totalPhrasesInApp = 0;
    phraseLists.filter(item => item.mode).forEach(item => totalPhrasesInApp += item.words.split(',').length);
    if (totalPhrasesInApp > retCode.boundaryLimits.MAX_INTERCHANGEABLE_PHRASES) {
        validationError(retCode.errorCode.BOUNDARY_INTC_PHRASES_LIMIT, `${totalPhrasesInApp} phrases found across all interchangeable phrase list definitions. At most ${retCode.boundaryLimits.MAX_INTERCHANGEABLE_PHRASES} is allowed.`)
    }

    // phrase list - Non-interchangeable phraselist has max of 5,000 phrases. 
    totalPhrasesInApp = 0;
    phraseLists.filter(item => !item.mode).forEach(item => totalPhrasesInApp += item.words.split(',').length);
    if (totalPhrasesInApp > retCode.boundaryLimits.MAX_NON_INTERCHANGEABLE_PHRASES) {
        validationError(retCode.errorCode.BOUNDARY_NINTC_PHRASES_LIMIT, `${totalPhrasesInApp} phrases found across all non-interchangeable phrase list definitions. At most ${retCode.boundaryLimits.MAX_NON_INTERCHANGEABLE_PHRASES} is allowed.`)
    }

    // Roles - 10 roles per entity
    let totalRoles = 0;
    ["prebuiltEntities", "patternAnyEntities", "regex_entities", "closedLists", "composites", "entities"].forEach(scope => {
        luisJSON[scope].forEach(item => {
            if (item.roles.length > retCode.boundaryLimits.MAX_ROLES_PER_ENTITY) {
                validationError(retCode.errorCode.BOUNDARY_ROLES_PER_ENTITY, `${scope.substring(0, scope.length - 1)} ${item.name} has ${item.roles.length} roles. At most ${retCode.boundaryLimits.MAX_ROLES_PER_ENTITY} is allowed.`)
            } 
            totalRoles += item.roles.length; 
        })
    })

    // Roles - 300 roles per application 
    if (totalRoles > retCode.boundaryLimits.MAX_NUM_ROLES) {
        validationError(retCode.errorCode.BOUNDARY_TOTAL_ROLES, `${totalRoles} role definitions found across all entity types. At most ${retCode.boundaryLimits.MAX_NUM_ROLES} is allowed.`)
    }

    // features - Maximum number of models that can be used as a descriptor (feature) to a specific model to be 10 models.
    ["intents", "entities"].forEach(scope => {
        luisJSON[scope].forEach(item => {
            if (item.features && item.features.length > retCode.boundaryLimits.MAX_NUM_DESCRIPTORS_PER_MODEL) {
                validationError(retCode.errorCode.BOUNDARY_FEATURE_PER_MODEL, `${scope.substring(0, scope.length - 1)} ${item.name} has ${item.features.length} descriptors (feature). At most ${retCode.boundaryLimits.MAX_NUM_DESCRIPTORS_PER_MODEL} is allowed.`)
            }
        })
    })

    // ml entities + roles - A limit of either 100 parent entities or 330 entities, whichever limit the user hits first. A role counts as an entity for the purpose of this boundary. An example is a composite with a simple entity, which has 2 roles is: 1 composite + 1 simple + 2 roles = 4 of the 330 entities.
    let numberOfParentEntities = 0;
    luisJSON.entities.forEach(item => {
        if (item.children && item.children.length > 0) numberOfParentEntities += 1;
    })

    let totalNumberOfEntitiesAndRoles = 0;
    ["prebuiltEntities", "patternAnyEntities", "regex_entities", "closedLists", "composites", "entities"].forEach(item => {
        totalNumberOfEntitiesAndRoles += luisJSON[item].length;
    })
    totalNumberOfEntitiesAndRoles += totalRoles;

    if (numberOfParentEntities > retCode.boundaryLimits.MAX_NUM_PARENT_ENTITIES) {
        validationError(retCode.errorCode.BOUNDARY_PARENT_ENTITY_LIMIT, `${numberOfParentEntities} parent ml entities found in application. At most ${retCode.boundaryLimits.MAX_NUM_PARENT_ENTITIES} is allowed.`)
    }
    
    if (totalNumberOfEntitiesAndRoles > retCode.boundaryLimits.MAX_TOTAL_ENTITES_AND_ROLES) {
        validationError(retCode.errorCode.BOUNDARY_TOTAL_ENTITIES_AND_ROLES, `${totalNumberOfEntitiesAndRoles} combined roles and entity definitions found. At most ${retCode.boundaryLimits.MAX_TOTAL_ENTITES_AND_ROLES} is allowed.`)
    }
}
const validationError = function (code, errorMsg) {
    let error = BuildDiagnostic({ message: errorMsg });
    throw (new exception(code, error.toString(), [error]));
}
const addEntities = function(luisJSON, entitiesList){
    luisJSON.entities.forEach(function (entity) {
        entitiesList.push(new validateLUISBlobEntity(entity.name, ['simple'], entity.roles));
    });
}
const addClosedLists = function(luisJSON, entitiesList, entityFound){
    luisJSON.closedLists.forEach(function (entity) {
        entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
        if (entityFound.length === 0) {
            entitiesList.push(new validateLUISBlobEntity(entity.name, ['list'], entity.roles));
        } else {
            entityFound[0].type.push('list');
        }
    });
}
const addPatternAnyEntities = function(luisJSON, entitiesList, entityFound){
    luisJSON.patternAnyEntities.forEach(function (entity) {
        entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
        if (entityFound.length === 0) {
            entitiesList.push(new validateLUISBlobEntity(entity.name, ['patternAny'], entity.roles));
        } else {
            entityFound[0].type.push('patternAny');
        }
    });
}

const addregexEntities = function(luisJSON, entitiesList, entityFound){
    luisJSON.regex_entities.forEach(function (entity) {
        entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
        if (entityFound.length === 0) {
            entitiesList.push(new validateLUISBlobEntity(entity.name, [`regEx:/${entity.regexPattern}/`], entity.roles));
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

const addCompositeEntities = function(luisJSON, entitiesList, entityFound){
    (luisJSON.composites || []).forEach(entity => {
        entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
        if (entityFound.length === 0) {
            entitiesList.push(new validateLUISBlobEntity(entity.name, ['composite'], entity.roles));
        } else {
            entityFound[0].type.push('composite');
        }
    })
}
const addPrebuiltEntities = function(luisJSON, entitiesList, entityFound){
    (luisJSON.prebuiltEntities || []).forEach(entity => {
        entityFound = helpers.filterMatch(entitiesList, 'name', entity.name);
        if (entityFound.length === 0) {
            entitiesList.push(new validateLUISBlobEntity(entity.name, ['prebuilt'], entity.roles));
        } else {
            entityFound[0].type.push('prebuilt');
        }
    })
}
const validateEntities = function(entitiesList){
    entitiesList.forEach(function (entity) {
        if (entity.type.length > 1) {
            let errorMsg = `Entity ${entity.name} has duplicate definitions.\r\n\t` + JSON.stringify(entity.type, 2, null);
            let error = BuildDiagnostic({ message: errorMsg });

            throw (new exception(retCode.errorCode.DUPLICATE_ENTITIES, error.toString(), [error]));
        }
    });
}

const validateUtterances = function(luisJSON, entitiesList){
    if (luisJSON.utterances.length <= 0) {
        return
    }
    for (let entity in luisJSON.utterances.entities) {
        let entityInList = helpers.filterMatch(entitiesList, 'name', entity.entity);
        if (entityInList.length > 0) {
            continue
        }
        if (entityInList[0].type.includes('phraseList')) {
            let errorMsg = `Utterance "${utterance.text}" has reference to PhraseList. \r\n\tYou cannot have utterances with phraselist references in them`;
            let error = BuildDiagnostic({ message: errorMsg });

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString(), [error]));
        }
    }
}

const validateComposites = function(luisJSON, entitiesList){
    if (luisJSON.composites.length <= 0) {
        return
    }

    luisJSON.composites.forEach(composite => {
        // composites cannot include pattern.any entities as children
        let patternAnyEntityInComposite = (luisJSON.patternAnyEntities || []).find(patternAnyEntity => {
            return composite.children.includes(patternAnyEntity.name);
        });
        if (patternAnyEntityInComposite !== undefined) {
            let errorMsg = `Composite entity "${composite.name}" includes pattern.any entity "${patternAnyEntityInComposite.name}".\r\n\tComposites cannot include pattern.any entity as a child.`;
            let error = BuildDiagnostic({ message: errorMsg });

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString(), [error]));
        }
        // composite entity definitions must have valid child entity type definitions. 
        validateCompositeChildren(composite, entitiesList)
    })
}

const validateCompositeChildren = function(composite, entitiesList){
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

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString(), [error]));
        }
        if (childEntityRole != '' && 
            !compositeChildEntityFound.roles.includes(childEntityRole)) {
            let errorMsg = `Composite entity "${composite.name}" includes an undefined child entity role "${childEntityName}:${childEntityRole}".\r\n\tAll children of composite entities must be explicitly defined or implicitly defined via an utterance or a pattern`;
            let error = BuildDiagnostic({ message: errorMsg });

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString(), [error]));
        }
    })
}

class validateLUISBlobEntity{
    constructor(name, type, roles) {
        this.name = name?name:'';
        this.type = type?type:[];
        this.roles = roles?roles:[];
    }
}

module.exports = validateLUIS