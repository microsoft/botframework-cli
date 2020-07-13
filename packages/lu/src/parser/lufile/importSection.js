const ImportSectionContext = require('./generated/LUFileParser').LUFileParser.ImportSectionContext;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 
const BaseSection = require('./baseSection');

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
        this.StartLine = parseTree.start.line - 1;
        this.StopLine = parseTree.stop.line - 1;
    }

    ExtractDescriptionAndPath(parseTree) {
        let importRegex = new RegExp(/\[([^\]]*)\]\(([^\)]*)\)/);
        let importStr = parseTree.importDefinition().IMPORT().getText();

        let description
        let path

        let groups = importStr.match(importRegex);
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