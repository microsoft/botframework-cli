module.exports = {
    Composite: class {
        constructor() {
            this.compositeName = '';
            this.attributes = [];
        }
    },
    MultiPlatformLuis: class{
        constructor() {
            this.intents = [];
            this.composites = [];
            this.simpleEntities = [];
            this.builtInEntities = [];
            this.listEntities = [];
            this.regexEntities = [];
            this.patternEntities = [];
        }
        getInstancesList() {
            const builtIns = [];
            const composites = [];
            this.builtInEntities.forEach(entityList => {
                builtIns.push(...entityList);
            });
            this.composites.forEach(composite => {
                composites.push(composite.compositeName);
                composites.push(...composite.attributes);
            });
            const entities = [
                ...this.simpleEntities,
                ...builtIns,
                ...this.listEntities,
                ...this.regexEntities,
                ...this.patternEntities,
                ...composites
            ].map(entity => module.exports.jsonPropertyName(entity)).sort();
            let hi = [...new Set(entities)];
            return hi;
        }
    },
    fromLuisApp: function(luisApp) {
        const classData = new this.MultiPlatformLuis();
        classData.intents = this.processIntents(luisApp.intents);
        classData.simpleEntities = this.extractEntities(luisApp.entities);
        classData.builtInEntities = this.extractEntities(luisApp.prebuiltEntities, true);
        classData.listEntities = this.extractEntities(luisApp.closedLists);
        classData.regexEntities = this.extractEntities(luisApp.regex_entities);
        classData.patternEntities = this.extractEntities(luisApp.patternAnyEntities);
        classData.composites = this.extractComposites(luisApp.composites);
        return classData;
    },
    normalizeName: function(name) {
        return name.replace(/\./g, '_').replace(/ /g, '_');
    },
    processIntents: function(intents) {
        const result = [];
        intents.forEach((intent) => {
            result.push(this.normalizeName(intent.name));
        });
        return result;
    },
    jsonPropertyName: function(property) {
        property+= ''
        let name = property.split(':').slice(-1)[0];
        if (!name.startsWith('geographyV2') &&
            !name.startsWith('ordinalV2') &&
            name.endsWith('V2')) {
            name = name.substring(0, name.length - 2);
        }
        return this.normalizeName(name);
    },
    extractEntities: function(entities, builtIn = false) {
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
    },
    extractComposites: function(entities) {
        const result = [];
        entities.forEach(entity => {
            const composite = { compositeName: this.normalizeName(entity.name), attributes: [] };
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
}