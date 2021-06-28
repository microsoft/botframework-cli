import ModelInfoSectionContext from './generated/LUFileParser.js';
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

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
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
    }
}

module.exports = LUModelInfo;