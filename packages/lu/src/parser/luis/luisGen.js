const Luis = require('./luis')
const propertyHelper = require('./propertyHelper')

class LuisGen extends Luis{
    constructor(){
        super()
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
