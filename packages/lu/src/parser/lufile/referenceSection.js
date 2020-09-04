const ReferenceSectionContext = require('./generated/LUFileParser').LUFileParser.ReferenceSectionContext;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('../utils/enums/lusectiontypes'); 
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class ReferenceSection extends BaseSection {
    /**
     * 
     * @param {ReferenceSectionContext} parseTree 
     */
    constructor(parseTree) {
        super();
        this.Errors = []
        this.SectionType = LUSectionTypes.REFERENCESECTION;
        let result = this.ExtractIdAndPath(parseTree);
        this.ReferenceId = result.referenceId;
        this.Path = result.path;
        this.Id = `${this.SectionType}_${this.ReferenceId}_${this.Path}`;
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
    }

    ExtractIdAndPath(parseTree) {
        let referenceRegex = new RegExp(/\[([^\]]*)\]\s*:\s*([^\)]*)/);
        let referenceStr = parseTree.referenceDefinition().REFERENCE().getText();

        let referenceId
        let path

        let groups = referenceStr.match(referenceRegex);
        if (groups && groups.length === 3) {
            referenceId = groups[1].trim();
            path = groups[2].trim();
            if (path === undefined || path === '') {
                let errorMsg = `LU file reference path is empty: "${parseTree.getText()}"`;
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: parseTree
                })

                this.Errors.push(error);
            }
        }

        return { referenceId, path }
    }
}

module.exports = ReferenceSection;