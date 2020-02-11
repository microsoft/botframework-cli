const LuisGen = require('./luisGen')
const propertyHelper = require('./propertyHelper')
const {CLIError} = require('@microsoft/bf-cli-command')

class LuisGenBuilder {
    static build(luisApp) {
        let buildWithVersion;
        if (luisApp.luis_schema_version < "5") {
            buildWithVersion = buildUpToVersion4;
        } else if (luisApp.luis_schema_version >= "6.0.0") {
            buildWithVersion = buildVersion6;
        } else {
            throw new CLIError("Invalid LUIS JSON schema version.")
        }

        return buildWithVersion(luisApp);
    }
}

module.exports = LuisGenBuilder

const buildUpToVersion4 = function(luisApp) {
    let result = new LuisGen()
    try {
        result.intents = processIntents(luisApp.intents);
        result.entities = extractEntities(luisApp.entities);
        result.prebuiltEntities = extractEntities(luisApp.prebuiltEntities, true);
        result.closedLists = extractEntities(luisApp.closedLists);
        result.regex_entities = extractEntities(luisApp.regex_entities);
        result.patternAnyEntities = extractEntities(luisApp.patternAnyEntities);
        result.composites = extractComposites(luisApp.composites);
    } catch (err) {
        throw new CLIError("Invalid LUIS JSON file content.")
    }
    return result
}

const buildVersion6 = function(luisApp) {
    let result = new LuisGen()
    try {
        result.intents = processIntents(luisApp.intents);
        [result.entities, result.composites] = extractEntitiesV6(luisApp.entities);
        result.prebuiltEntities = extractEntities(luisApp.prebuiltEntities, true);
        result.closedLists = extractEntities(luisApp.closedLists);
        result.regex_entities = extractEntities(luisApp.regex_entities);
        result.patternAnyEntities = extractEntities(luisApp.patternAnyEntities);
    } catch (err) {
        throw new CLIError("Invalid LUIS JSON file content.")
    }
    return result
}

const processIntents = function(intents) {
    const result = [];
    intents.forEach((intent) => {
        result.push(propertyHelper.normalizeName(intent.name));
    });
    return result;
}

const extractComposites = function(entities) {
    const result = [];
    entities.forEach(entity => {
        const composite = { compositeName: propertyHelper.normalizeName(entity.name), attributes: [] };
        entity.roles.sort();
        entity.roles.forEach(role => {
            composite.attributes.push(role);
        });
        entity.children.forEach(child => {
            composite.attributes.push(child);
        });
        result.push(composite);
    });
    return result;
}

const extractEntities = function(entities, builtIn = false) {
    const result = [];
    entities.forEach(entity => {
        const aux = [];
        aux.push(entity.name);
        entity.roles.sort();
        entity.roles.forEach(role => {
            aux.push(role);
        });
        if (entity.children !== undefined) {
            entity.children.forEach(child => {
                aux.push(child);
            });
        }
        if (builtIn) {
            result.push(aux);
        }
        else {
            result.push(...aux);
        }
    });
    return result;
}

const extractEntitiesV6 = function(entities) {
    // This method provides a simplified topological sort to
    // solve potential instanceOf dependecies in the v6 entities

    const simpleEntitiesResult = [];
    const compositeEntitiesResult = [];
    const simpleEntitiesWithType = {};
    const resolveEntityType = function(entityName) {
        const entityStack = [];
        let entityType = simpleEntitiesWithType[entityName];

        while (simpleEntitiesWithType[entityType]){
            entityStack.push(entityName);
            entityName = entityType;
            entityType = simpleEntitiesWithType[entityName];
        }

        while (entityName) {
            simpleEntitiesWithType[entityName] = entityType;
            entityName = entityStack.pop();
        }
    }

    const firstPassStack = entities.slice();

    while(firstPassStack.length) {
        const entity = firstPassStack.pop();

        if (Array.isArray(entity.children) && entity.children.length) {
            firstPassStack.push(...entity.children);
        } else if (!entity.children || (Array.isArray(entity.children) && entity.children.length == 0)) {
            // is simple entity
            if (entity.instanceOf) {
                // If the entity order in the schema was not modified by hand,
                // this algorithm will solve instanceOf dependencies.
                const last_type = simpleEntitiesWithType[entity.instanceOf] || entity.instanceOf;
                simpleEntitiesWithType[entity.name] = last_type;
            }
        } else {
            throw CLIError("Malformed JSON: entity.children should be an array");
        }
    }

    // This is a second pass for simple entities.
    // If the JSON was modified by hand and there's a dependency
    // in the instanceOf field to an entity that appears later,
    // the type won't be resolved correctly with one pass.
    for (const entityName in simpleEntitiesWithType) {
        resolveEntityType(entityName);
    }

    const processSimpleEntity = function(entity, listToAppend) {
        listToAppend.push(
            entity.instanceOf ? {name: entity.name, instanceOf: simpleEntitiesWithType[entity.instanceOf] || entity.instanceOf} : entity.name
        )
    }

    const baseParseEntity = function(entityList, childList, topLevel=false) {
        entityList.forEach(entity => {
            if (Array.isArray(entity.children) && entity.children.length) {
                const compositeEntity = { compositeName: propertyHelper.normalizeName(entity.name), attributes: [] };
                baseParseEntity(entity.children, compositeEntity.attributes);
                compositeEntitiesResult.push(compositeEntity);
                if (!topLevel) {
                    childList.push({name: entity.name, compositeInstanceOf: true})
                }
            } else {
                processSimpleEntity(
                    entity, 
                    topLevel ? simpleEntitiesResult : childList
                )
            }
        });
    }

    baseParseEntity(entities, null, true);
    return [simpleEntitiesResult, compositeEntitiesResult];
}