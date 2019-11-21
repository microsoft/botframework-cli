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
    return true;
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

            throw (new exception(retCode.errorCode.DUPLICATE_ENTITIES, error.toString()));
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

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
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

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
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

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
        }
        if (childEntityRole != '' && 
            !compositeChildEntityFound.roles.includes(childEntityRole)) {
            let errorMsg = `Composite entity "${composite.name}" includes an undefined child entity role "${childEntityName}:${childEntityRole}".\r\n\tAll children of composite entities must be explicitly defined or implicitly defined via an utterance or a pattern`;
            let error = BuildDiagnostic({ message: errorMsg });

            throw (new exception(retCode.errorCode.INVALID_INPUT, error.toString()));
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