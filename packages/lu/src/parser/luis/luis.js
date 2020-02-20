const validator = require('./luisValidator')
const luConverter = require('./luConverter')
const helpers = require('./../utils/helpers')

class Luis {
    constructor(LuisJSON = null){
        if (LuisJSON) {
            initialize(this, LuisJSON)
        } else {
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
        }
    }

    hasContent(){
        for (let prop in this) {
            if (Array.isArray(this[prop]) && this[prop].length > 0 ) return true
        }   
        return false
    }

    parseToLuContent(){
        helpers.checkAndUpdateVersion(this)
        return luConverter(this)
    }

    sort() {
        let props = ['intents', 'composites', 'entities', 'closedLists', 'regex_entities', 'model_features', 'patternAnyEntities', 'prebuiltEntities']
        for (const key of props) {
            this[key].sort(sortComparers.compareNameFn)
        }
        this.utterances.sort(sortComparers.compareIntentFn);
    }

    validate() {
        return validator(this)
    }
}

module.exports = Luis

const initialize = function(instance, LuisJSON) {
    for (let prop in LuisJSON) {
        instance[prop] = LuisJSON[prop];
    }   
}

const sortComparers = { 
    compareNameFn : function(a, b) {
        return compareString(a.name.toUpperCase(), b.name.toUpperCase())
    },    
    compareIntentFn : function(a, b) {
        return compareString(a.intent.toUpperCase(), b.intent.toUpperCase())
    }
}

const compareString = function(a, b) {
    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;
}
