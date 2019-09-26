const NewEntityDefinitionContext = require('./generated/LUFileParser').LUFileParser.NewEntityDefinitionContext;
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;

class LUNewEntity {
    /**
     * 
     * @param {NewEntityDefinitionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        this.Roles = this.ExtractRoles(parseTree);
        this.Features = this.ExtractFeatures(parseTree);
        this.CompositeDefinition = this.ExtractCompositeDefinition(parseTree);
        this.RegexDefinition = this.ExtractRegexDefinition(parseTree);
        const result = this.ExtractSynonymsOrPhraseList(parseTree);
        this.SynonymsOrPhraseList = result.synonymsOrPhraseList;
        this.Errors = result.errors;
    }

    ExtractName(parseTree) {
        if (parseTree.newEntityLine().newEntityName) {
            return parseTree.newEntityLine().newEntityName().getText().trim();
        } else {
            return parseTree.newEntityLine().newEntityNameWithWS().getText().trim();
        }
    }

    ExtractType(parseTree) {
        return parseTree.newEntityLine().newEntityType().getText().trim();
    }

    ExtractRoles(parseTree) {
        if (parseTree.newEntityLine().newEntityRoles()) {
            return parseTree.newEntityLine().newEntityRoles();
        }
    }

    ExtractFeatures(parseTree) {
        if (parseTree.newEntityLine().newEntityUsesFeatures()) {
            return parseTree.newEntityLine().newEntityUsesFeatures();
        }
    }

    ExtractCompositeDefinition(parseTree) {
        if (parseTree.newEntityLine().newCompositeDefinition()) {
            return parseTree.newEntityLine().newCompositeDefinition();
        }
    }

    ExtractRegexDefinition(parseTree) {
        if (parseTree.newEntityLine().newRegexDefinition()) {
            return parseTree.newEntityLine().newRegexDefinition();
        }
    }

    ExtractSynonymsOrPhraseList(parseTree) {
        let synonymsOrPhraseList = [];
        let errors = [];

        if (parseTree.entityListBody()) {
            for (const normalItemStr of parseTree.entityListBody().normalItemString()) {
                var itemStr = normalItemStr.getText().trim();
                synonymsOrPhraseList.push(itemStr.substr(1).trim());
            }
        }

        if (this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
            let errorMsg = `no synonyms list found for list entity definition: "${parseTree.entityLine().getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.entityLine(),
                severity: DiagnosticSeverity.WARN
            })

            errors.push(error);
        }

        return { synonymsOrPhraseList, errors };
    }
}

module.exports = LUNewEntity;