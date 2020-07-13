const NestedIntentSectionContext = require('./generated/LUFileParser').LUFileParser.NestedIntentSectionContext
const SimpleIntentSection = require('./simpleIntentSection');
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const NEWLINE = require('os').EOL;
const BaseSection = require('./baseSection');

class NestedIntentSection  extends BaseSection {
    /**
     * 
     * @param {NestedIntentSectionContext} parseTree 
     */
    constructor(parseTree, content) {
        super();
        this.SectionType = LUSectionTypes.NESTEDINTENTSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Body = this.ExtractBody(parseTree, content);
        this.SimpleIntentSections = this.ExtractSimpleIntentSections(parseTree, content);
        this.Errors = [];
        if (this.SimpleIntentSections && this.SimpleIntentSections.length > 0) {
            this.SimpleIntentSections.forEach(section => {
                this.Errors = this.Errors.concat(section.Errors);
            });
        }
        
        this.Id = `${this.SectionType}_${this.Name}`;
        this.StartLine = parseTree.start.line - 1;
        this.StopLine = parseTree.stop.line - 1;
    }

    ExtractName(parseTree) {
        return parseTree.nestedIntentNameLine().nestedIntentName().getText().trim();
    }

    ExtractBody(parseTree, content) {
        const startLine = parseTree.start.line - 1
        const stopLine = parseTree.stop.line - 1
        const originList = content.split(/\r?\n/)
        if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine || originList.Length <= stopLine) {
            throw new Error("index out of range.")
        }

        if (startLine < stopLine) {
            const destList = originList.slice(startLine + 1, stopLine + 1)
            
            return destList.join(NEWLINE)
        } else {
            return ''
        }
    }

    ExtractSimpleIntentSections(parseTree, content) {
        let simpleIntentSections = [];
        for(const subIntentDefinition of parseTree.nestedIntentBodyDefinition().subIntentDefinition()) {
            let simpleIntentSection = new SimpleIntentSection(subIntentDefinition.simpleIntentSection(), content);
            simpleIntentSections.push(simpleIntentSection);
        }

        return simpleIntentSections;
    }
}

module.exports = NestedIntentSection;