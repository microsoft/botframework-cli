const ModelInfoSectionContext = require('./generated/LUFileParser').LUFileParser.ModelInfoSectionContext;
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const BaseSection = require('./baseSection');

class LUModelInfo  extends BaseSection {
    /**
     * 
     * @param {ModelInfoSectionContext} parseTree 
     */
    constructor(parseTree) {
        super();
        this.SectionType = LUSectionTypes.MODELINFOSECTION;
        this.ModelInfo = parseTree.modelInfoDefinition().getText();
        this.Errors = [];
        this.Id = `${this.SectionType}_${this.ModelInfo}`;
        this.StartLine = parseTree.start.line - 1;
        this.StopLine = parseTree.stop.line - 1;
    }
}

module.exports = LUModelInfo;