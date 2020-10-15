const NestedIntentSectionContext = require('./generated/LUFileParser').LUFileParser.NestedIntentSectionContext
const SimpleIntentSection = require('./simpleIntentSection');
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const NEWLINE = require('os').EOL;
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class NestedIntentSection  extends BaseSection {
    /**
     * 
     * @param {NestedIntentSectionContext} parseTree 
     */
    constructor(parseTree, content) {
        super();
        this.SectionType = LUSectionTypes.NESTEDINTENTSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Body = '';
        this.SimpleIntentSections = this.ExtractSimpleIntentSections(parseTree, content);
        this.Errors = [];
        if (this.SimpleIntentSections && this.SimpleIntentSections.length > 0) {
            this.SimpleIntentSections.forEach(section => {
                this.Errors = this.Errors.concat(section.Errors);
            });
        }
        
        this.Id = `${this.SectionType}_${this.Name}`;
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
    }

    ExtractName(parseTree) {
        return parseTree.nestedIntentNameLine().nestedIntentName().getText().trim();
    }

    ExtractSimpleIntentSections(parseTree, content) {
        let simpleIntentSections = [];
        for(const subIntentDefinition of parseTree.nestedIntentBodyDefinition().subIntentDefinition()) {
            let simpleIntentSection = new SimpleIntentSection(subIntentDefinition.simpleIntentSection(), content);
            simpleIntentSection.Range.Start.Character = 0
            simpleIntentSections.push(simpleIntentSection);
        }

        return simpleIntentSections;
    }
}

module.exports = NestedIntentSection;