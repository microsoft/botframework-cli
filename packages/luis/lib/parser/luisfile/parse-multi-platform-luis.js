"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParseMultiPlatformLuis;
(function (ParseMultiPlatformLuis) {
    class Composite {
        constructor() {
            this.compositeName = '';
            this.attributes = [];
        }
    }
    ParseMultiPlatformLuis.Composite = Composite;
    class MultiPlatformLuis {
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
            ].map(entity => jsonPropertyName(entity)).sort();
            let hi = [...new Set(entities)];
            return hi;
        }
    }
    ParseMultiPlatformLuis.MultiPlatformLuis = MultiPlatformLuis;
    function fromLuisApp(luisApp) {
        const classData = new MultiPlatformLuis();
        classData.intents = processIntents(luisApp.intents);
        classData.simpleEntities = extractEntities(luisApp.entities);
        classData.builtInEntities = extractEntities(luisApp.prebuiltEntities, true);
        classData.listEntities = extractEntities(luisApp.closedLists);
        classData.regexEntities = extractEntities(luisApp.regex_entities);
        classData.patternEntities = extractEntities(luisApp.patternAnyEntities);
        classData.composites = extractComposites(luisApp.composites);
        return classData;
    }
    ParseMultiPlatformLuis.fromLuisApp = fromLuisApp;
    function normalizeName(name) {
        return name.replace(/\./g, '_').replace(/ /g, '_');
    }
    ParseMultiPlatformLuis.normalizeName = normalizeName;
    function processIntents(intents) {
        const result = [];
        intents.forEach((intent) => {
            result.push(normalizeName(intent.name));
        });
        return result;
    }
    function jsonPropertyName(property) {
        let name = property.split(':').slice(-1)[0];
        if (!name.startsWith('geographyV2') &&
            !name.startsWith('ordinalV2') &&
            name.endsWith('V2')) {
            name = name.substring(0, name.length - 2);
        }
        return normalizeName(name);
    }
    ParseMultiPlatformLuis.jsonPropertyName = jsonPropertyName;
    function extractEntities(entities, builtIn = false) {
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
    function extractComposites(entities) {
        const result = [];
        entities.forEach(entity => {
            const composite = { compositeName: normalizeName(entity.name), attributes: [] };
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
})(ParseMultiPlatformLuis = exports.ParseMultiPlatformLuis || (exports.ParseMultiPlatformLuis = {}));
