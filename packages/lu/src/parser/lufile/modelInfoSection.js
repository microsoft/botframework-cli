const ModelInfoSectionContext = require('./generated/LUFileParser').LUFileParser.ModelInfoSectionContext;
const LUSectionTypes = require('../utils/enums/lusectiontypes'); 
const uuidv4 = require('uuid/v4');

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
        this.Id = uuidv4();
    }
}

module.exports = LUModelInfo;