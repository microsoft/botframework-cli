const NewEntitySectionContext = require('./generated/LUFileParser').LUFileParser.NewEntitySectionContext;
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./enums/lusectiontypes');
const uuidv4 = require('uuid/v4');

class NewEntitySection {
    /**
     * 
     * @param {NewEntitySectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.NEWENTITYSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        this.Roles = this.ExtractRoles(parseTree);
        this.Features = this.ExtractFeatures(parseTree);
        this.CompositeDefinition = this.ExtractCompositeDefinition(parseTree);
        this.RegexDefinition = this.ExtractRegexDefinition(parseTree);
        const result = this.ExtractSynonymsOrPhraseList(parseTree);
        this.ListBody = result.synonymsOrPhraseList;
        this.Errors = result.errors;
        this.Id = uuidv4();
    }

    ExtractName(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newEntityName()) {
            return parseTree.newEntityDefinition().newEntityLine().newEntityName().getText().trim();
        } else {
            return parseTree.newEntityDefinition().newEntityLine().newEntityNameWithWS().getText().trim();
        }
    }

    ExtractType(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newEntityType()) {
            return parseTree.newEntityDefinition().newEntityLine().newEntityType().getText().trim();
        } 
    }

    ExtractRoles(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newEntityRoles()) {            
            return parseTree.newEntityDefinition().newEntityLine().newEntityRoles().newEntityRoleOrFeatures().getText().trim();
        }
    }

    ExtractFeatures(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newEntityUsesFeatures()) {
            return parseTree.newEntityDefinition().newEntityLine().newEntityUsesFeatures().newEntityRoleOrFeatures().getText().trim();
        }
    }

    ExtractCompositeDefinition(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newCompositeDefinition()) {
            return parseTree.newEntityDefinition().newEntityLine().newCompositeDefinition().getText().trim();
        }
    }

    ExtractRegexDefinition(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newRegexDefinition()) {
            return parseTree.newEntityDefinition().newEntityLine().newRegexDefinition().getText().trim();
        }
    }

    ExtractSynonymsOrPhraseList(parseTree) {
        let synonymsOrPhraseList = [];
        let errors = [];

        if (parseTree.newEntityDefinition().newEntityListbody()) {
            for (const normalItemStr of parseTree.newEntityDefinition().newEntityListbody().normalItemString()) {
                var itemStr = normalItemStr.getText().trim();
                synonymsOrPhraseList.push(itemStr.substr(1).trim());
            }
        }

        if (this.Type && this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
            let errorMsg = `no synonyms list found for list entity definition: "${parseTree.newEntityDefinition().entityLine().getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.newEntityDefinition().entityLine(),
                severity: DiagnosticSeverity.WARN
            })

            errors.push(error);
        }

        return { synonymsOrPhraseList, errors };
    }
}

module.exports = NewEntitySection;