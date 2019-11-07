const Luis = require('./luis')
const propertyHelper = require('./propertyHelper')
const {CLIError} = require('@microsoft/bf-cli-command')

class LuisGen extends Luis{
    constructor(luisApp){
        super()
        try {
            this.intents = processIntents(luisApp.intents);
            this.entities = extractEntities(luisApp.entities);
            this.prebuiltEntities = extractEntities(luisApp.prebuiltEntities, true);
            this.closedLists = extractEntities(luisApp.closedLists);
            this.regex_entities = extractEntities(luisApp.regex_entities);
            this.patternAnyEntities = extractEntities(luisApp.patternAnyEntities);
            this.composites = extractComposites(luisApp.composites);
        } catch (err) {
            throw new CLIError("Invalid LUIS JSON file content.")
        }
    }
    getInstancesList() {
        const prebuiltEntities = [];
        const composites = [];
        this.prebuiltEntities.forEach(entityList => {
            prebuiltEntities.push(...entityList);
        });
        this.composites.forEach(composite => {
            composites.push(composite.compositeName);
            composites.push(...composite.attributes);
        });
        const entities = [
            ...this.entities,
            ...prebuiltEntities,
            ...this.closedLists,
            ...this.regex_entities,
            ...this.patternAnyEntities,
            ...composites
        ].map(entity => propertyHelper.jsonPropertyName(entity)).sort();
        let hi = [...new Set(entities)];
        return hi;
    }
}

module.exports = LuisGen

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

