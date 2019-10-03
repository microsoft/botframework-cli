const EntitySectionContext = require('./generated/LUFileParser').LUFileParser.EntitySectionContext;
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./enums/lusectiontypes'); 

class EntitySection {
    /**
     * 
     * @param {EntitySectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.ENTITYSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        const result = this.ExtractSynonymsOrPhraseList(parseTree);
        this.SynonymsOrPhraseList = result.synonymsOrPhraseList;
        this.Errors = result.errors;
    }

    ExtractName(parseTree) {
        return parseTree.entityDefinition().entityLine().entityName().getText().trim();
    }

    ExtractType(parseTree) {
        return parseTree.entityDefinition().entityLine().entityType().getText().trim();
    }

    ExtractSynonymsOrPhraseList(parseTree) {
        let synonymsOrPhraseList = [];
        let errors = [];

        if (parseTree.entityDefinition().entityListBody()) {
            for (const normalItemStr of parseTree.entityDefinition().entityListBody().normalItemString()) {
                var itemStr = normalItemStr.getText().trim();
                synonymsOrPhraseList.push(itemStr.substr(1).trim());
            }
        }

        if (this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
            let errorMsg = `no synonyms list found for list entity definition: "${parseTree.entityDefinition().entityLine().getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.entityDefinition().entityLine(),
                severity: DiagnosticSeverity.WARN
            })

            errors.push(error);
        }

        return { synonymsOrPhraseList, errors };
    }
}

module.exports = EntitySection;