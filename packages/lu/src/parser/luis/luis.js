const validator = require('./luisValidator')
const luConverter = require('./luConverter')
const helpers = require('./../utils/helpers')
const LU = require('./../lu/lu')

class Luis {
    constructor(LuisJSON = null){
        this.intents = [];
        this.entities = [];
        this.composites = [];
        this.closedLists = [];
        this.regex_entities = [];
        this.model_features = [];
        this.regex_features = [];
        this.utterances = [];
        this.patterns = [];
        this.patternAnyEntities = [];
        this.prebuiltEntities = [];
        // fix for #255
        this.luis_schema_version = "3.2.0";
        this.versionId = "0.1";
        this.name = "";
        this.desc = "";
        this.culture = "en-us";

        if (LuisJSON) {
            initialize(this, LuisJSON)
        }
    }

    parseToLuContent(){
        helpers.checkAndUpdateVersion(this)
        return luConverter(this)
    }

    parseToLU(){
        return new LU(this.parseToLuContent())
    }

    validate() {
        return validator(this)
    }

    sort() {
        // sort luis properties
        // to make parseToLuContent return same content
        // for luis jsons that have different property orders
        sortLuis(this)
    }
}

module.exports = Luis

const initialize = function(instance, LuisJSON) {
    for (let prop in instance) {
        instance[prop] = LuisJSON[prop];
    } 

    // add regexEntities property that returned from luis export api
    const regexEntities = 'regexEntities';
    if (Object.keys(LuisJSON).includes(regexEntities)) instance[regexEntities] = LuisJSON[regexEntities];

    settingsAndTokenizerCheck(instance, LuisJSON) 
}

const settingsAndTokenizerCheck = function(instance, LuisJSON) {
    const adds = ['tokenizerVersion', 'settings', 'phraselists']
    for (let i = 0 ; i < adds.length; i++) {
        if(!LuisJSON[adds[i]]) continue
        instance[adds[i]]= LuisJSON[adds[i]];
    }
}

const sortLuis = function (instance) {
    sortProperty(instance.intents, 'name')
    sortProperty(instance.closedLists, 'name')
    sortProperty(instance.composites, 'name')
    sortProperty(instance.entities, 'name')
    sortProperty(instance.model_features, 'name')
    sortProperty(instance.phraselists, 'name')
    sortProperty(instance.patternAnyEntities, 'name')
    sortProperty(instance.patterns, 'pattern')
    sortProperty(instance.prebuiltEntities, 'name')
    sortProperty(instance.regex_entities, 'name')
    sortProperty(instance.regexEntities, 'name')
    sortProperty(instance.utterances, 'text')
}

const sortProperty = function (arrayToSort, propertyToSort) {
    (arrayToSort || []).sort((a, b) => {
        const aValue = a[propertyToSort].toLowerCase()
        const bValue = b[propertyToSort].toLowerCase()

        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })
}
