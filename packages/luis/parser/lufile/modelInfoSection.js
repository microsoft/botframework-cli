const ModelInfoSectionContext = require('./generated/LUFileParser').LUFileParser.ModelInfoSectionContext;
const LUSectionTypes = require('./enums/lusectiontypes'); 

class LUModelInfo {
    /**
     * 
     * @param {ModelInfoSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.MODELINFOSECTION;
        this.ModelInfo = parseTree.modelInfoSection().getText();
    }
}

module.exports = LUModelInfo;