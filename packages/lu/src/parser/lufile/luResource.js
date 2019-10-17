const LUIntent = require('./luIntent');

class LUResource {
    /**
     * 
     * @param {LUIntent[]} intents 
     * @param {any[]} entities 
     * @param {any[]} newEntities
     * @param {any[]} imports
     * @param {any[]} qnas
     * @param {any[]} errors
     * @param {any[]} modelInfos
     */
    constructor(intents, entities, newEntities, imports, qnas, modelInfos, errors) {
      this.Intents = intents;
      this.Entities = entities;
      this.NewEntities = newEntities;
      this.Imports = imports;
      this.Qnas = qnas;
      this.Errors = errors;
      this.ModelInfos = modelInfos;
    }
}

module.exports = LUResource;