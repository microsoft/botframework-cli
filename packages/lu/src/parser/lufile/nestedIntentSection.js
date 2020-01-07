const NestedIntentSectionContext = require('./generated/LUFileParser').LUFileParser.NestedIntentSectionContext
const SimpleIntentSection = require('./simpleIntentSection');
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 

class NestedIntentSection {
    /**
     * 
     * @param {NestedIntentSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.NESTEDINTENTSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Body = this.ExtractBody(parseTree);
        this.SimpleIntentSections = this.ExtractSimpleIntentSections(parseTree);
        this.Errors = [];
        if (this.SimpleIntentSections && this.SimpleIntentSections.length > 0) {
            this.SimpleIntentSections.forEach(section => {
                this.Errors = this.Errors.concat(section.Errors);
            });
        }
        
        this.Id = `${this.SectionType}_${this.Name}`;
    }

    ExtractName(parseTree) {
        return parseTree.nestedIntentNameLine().nestedIntentName().getText().trim();
    }

    ExtractBody(parseTree) {
        return parseTree.nestedIntentBodyDefinition().getText().trim();
    }

    ExtractSimpleIntentSections(parseTree) {
        let simpleIntentSections = [];
        for(const subIntentDefinition of parseTree.nestedIntentBodyDefinition().subIntentDefinition()) {
            let simpleIntentSection = new SimpleIntentSection(subIntentDefinition.simpleIntentSection());
            simpleIntentSections.push(simpleIntentSection);
        }

        return simpleIntentSections;
    }
}

module.exports = NestedIntentSection;