const ModelInfoSectionContext = require('./generated/LUFileParser').LUFileParser.ModelInfoSectionContext;
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 

class LUModelInfo {
    /**
     * 
     * @param {ModelInfoSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.MODELINFOSECTION;
        this.ModelInfo = parseTree.modelInfoDefinition().getText();
        this.Errors = [];
        this.Id = `${this.SectionType}_${this.ModelInfo}`;
    }
}

module.exports = LUModelInfo;