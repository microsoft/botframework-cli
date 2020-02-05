const ImportSectionContext = require('./generated/LUFileParser').LUFileParser.ImportSectionContext;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes'); 

class ImportSection {
    /**
     * 
     * @param {ImportSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.IMPORTSECTION;
        this.Description = this.ExtractDescription(parseTree);
        let result = this.ExtractPath(parseTree);
        this.Path = result.importPath;
        this.Errors = result.errors;
        this.Id = `${this.SectionType}_${this.Path}`;;
    }

    ExtractDescription(parseTree) {
        return parseTree.importDefinition().IMPORT_DESC().getText();
    }

    ExtractPath(parseTree) {
        let errors = [];
        let importPath = parseTree.importDefinition().IMPORT_PATH().getText().replace('(', '').replace(')', '');
        if (importPath === undefined || importPath === '') {
            let errorMsg = `LU file reference path is empty: "${parseTree.getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree
            })

            errors.push(error);
        }

        return { importPath, errors };
    }
}

module.exports = ImportSection;