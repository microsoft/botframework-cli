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
        this.ListBody = result.synonymsOrPhraseList;
        this.Errors = result.errors;
    }

    ExtractName(parseTree) {
        if (parseTree.newEntityLine().newEntityName()) {
            return parseTree.newEntityLine().newEntityName().getText().trim();
        } else {
            return parseTree.newEntityLine().newEntityNameWithWS().getText().trim();
        }
    }

    ExtractType(parseTree) {
        if (parseTree.newEntityLine().newEntityType()) {
            return parseTree.newEntityLine().newEntityType().getText().trim();
        } 
    }

    ExtractRoles(parseTree) {
        if (parseTree.newEntityLine().newEntityRoles()) {            
            return parseTree.newEntityLine().newEntityRoles().newEntityRoleOrFeatures().getText().trim();
        }
    }

    ExtractFeatures(parseTree) {
        if (parseTree.newEntityLine().newEntityUsesFeatures()) {
            return parseTree.newEntityLine().newEntityUsesFeatures().newEntityRoleOrFeatures().getText().trim();
        }
    }

    ExtractCompositeDefinition(parseTree) {
        if (parseTree.newEntityLine().newCompositeDefinition()) {
            return parseTree.newEntityLine().newCompositeDefinition().getText().trim();
        }
    }

    ExtractRegexDefinition(parseTree) {
        if (parseTree.newEntityLine().newRegexDefinition()) {
            return parseTree.newEntityLine().newRegexDefinition().getText().trim();
        }
    }

    ExtractSynonymsOrPhraseList(parseTree) {
        let synonymsOrPhraseList = [];
        let errors = [];

        if (parseTree.newEntityListbody()) {
            for (const normalItemStr of parseTree.newEntityListbody().normalItemString()) {
                synonymsOrPhraseList.push(normalItemStr.getText().trim());
            }
        }

        if (this.Type && this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
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