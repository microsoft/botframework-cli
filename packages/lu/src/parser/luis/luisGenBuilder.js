const LuisGen = require('./luisGen')
const propertyHelper = require('./propertyHelper')
const error = require('./../utils/exception')
const retCode = require('./../utils/enums/CLI-errors')

class LuisGenBuilder {
    static build(luisApp) {
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
            throw (new error(retCode.errorCode.INVALID_INPUT_FILE, "Invalid LUIS JSON file content."))
        }
        return result
    }
}

module.exports = LuisGenBuilder

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