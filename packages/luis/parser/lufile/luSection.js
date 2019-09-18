const SectionDefinitionContext = require('./generated/LUFileParser').LUFileParser.SectionDefinitionContext;
const LUIntent = require('./luIntent');
const LUEntity = require('./luEntity');

class LUSection {
    /**
     * 
     * @param {SectionDefinitionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.Name = this.ExtractName(parseTree);
        this.Body = this.ExtractBody(parseTree);
        this.SubSections = this.ExtractSubSections(parseTree);
    }

    ExtractName(parseTree) {
        return parseTree.sectionNameLine().sectionName().getText().trim();
    }

    ExtractBody(parseTree) {
        return parseTree.sectionBodyDefinition().getText().trim();
    }

    ExtractSubSections(parseTree) {
        let subSections = [];
        for(const subSectionDefinition of parseTree.sectionBodyDefinition().subSectionDefinition()) {
            let intent = new LUIntent(subSectionDefinition.subIntentDefinition());

            let entities;
            if (subSectionDefinition.entityDefinition() !== undefined) {
                entities = subSectionDefinition.entityDefinition().map(x => new LUEntity(x));
            }

            subSections.push({ Intent: intent, Entities: entities });
        }

        return subSections;
    }
}

module.exports = LUSection;