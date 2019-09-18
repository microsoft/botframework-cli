class LUResource {
    /**
     * 
     * @param {any[]} sections
     * @param {any[]} intents 
     * @param {any[]} entities 
     * @param {any[]} imports
     * @param {any[]} qnas
     * @param {any[]} errors
     * @param {any[]} modelInfos
     */
    constructor(sections, intents, entities, imports, qnas, modelInfos, errors) {
      this.Sections = sections;
      this.Intents = intents;
      this.Entities = entities;
      this.Imports = imports;
      this.Qnas = qnas;
      this.Errors = errors;
      this.ModelInfos = modelInfos;
    }
}

module.exports = LUResource;