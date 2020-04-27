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
