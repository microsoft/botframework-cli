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
}

const buildVersion6 = function(luisApp) {
    let result = new LuisGen()
    try {
        result.intents = processIntents(luisApp.intents);
        result.entities = extractEntities(luisApp.entities);
        result.prebuiltEntities = extractEntities(luisApp.prebuiltEntities, true);
        result.closedLists = extractEntities(luisApp.closedLists);
        result.regex_entities = extractEntities(luisApp.regex_entities);
        result.patternAnyEntities = extractEntities(luisApp.patternAnyEntities);
        result.composites = [];
    } catch (err) {
        throw new CLIError("Invalid LUIS JSON file content.")
    }
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
    const simple_entities_result = [];
    const composite_entities_result = [];

    entities.forEach(entity => {
        if (Array.isArray(entity.children) && entity.children.length) {
            // is composite
            
        } else {
            // is simple entity
            if (entity.instanceOf) {
                simple_entities_result.push(
                    { entityName: entity.name, instanceOf: entity.instanceOf }
                )
            } else {
                simple_entities_result.push(entity.name)
            }
        }
    });
    return result;
}