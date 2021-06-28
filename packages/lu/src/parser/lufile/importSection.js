import ImportSectionContext from './generated/LUFileParser.js'
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class ImportSection extends BaseSection {
    /**
     * 
     * @param {ImportSectionContext} parseTree 
     */
    constructor(parseTree) {
        super();
        this.Errors = []
        this.SectionType = LUSectionTypes.IMPORTSECTION;
        let result = this.ExtractDescriptionAndPath(parseTree);
        this.Description = result.description;
        this.Path = result.path;
        this.Id = `${this.SectionType}_${this.Path}`;
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
    }

    ExtractDescriptionAndPath(parseTree) {
        let importPathRegex = new RegExp(/\[([^\]]*)\]\(([^\)]*)\)/);
        let importReferenceRegex = new RegExp(/\[([^\]]*)\]\[([^\]]*)\]/);
        let importStr = parseTree.importDefinition().IMPORT().getText().trim();
        let description;
        let path;
        let groups = importStr.match(importPathRegex);
        if (!groups || groups.length !== 3) {
            groups = importStr.match(importReferenceRegex);
        }

        if (groups && groups.length === 3) {
            description = groups[1].trim();
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

        return { description, path }
    }
}

module.exports = ImportSection;