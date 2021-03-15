const NewEntitySectionContext = require('./generated/LUFileParser').LUFileParser.NewEntitySectionContext;
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class NewEntitySection  extends BaseSection {
    /**
     * 
     * @param {NewEntitySectionContext} parseTree 
     */
    constructor(parseTree) {
        super();
        this.SectionType = LUSectionTypes.NEWENTITYSECTION;
        this.Errors = []
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        this.Roles = this.ExtractRoles(parseTree);
        this.Features = this.ExtractFeatures(parseTree);
        this.CompositeDefinition = this.ExtractCompositeDefinition(parseTree);
        this.RegexDefinition = this.ExtractRegexDefinition(parseTree);
        this.ListBody = this.ExtractSynonymsOrPhraseList(parseTree);
        this.Id = `${this.SectionType}_${this.Name}`;
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
    }

    ExtractName(parseTree) {
        let entityName
        if (parseTree.newEntityDefinition().newEntityLine().newEntityName()) {
            entityName = parseTree.newEntityDefinition().newEntityLine().newEntityName().getText().trim();
        } else if (parseTree.newEntityDefinition().newEntityLine().newEntityNameWithWS()) {
            entityName = parseTree.newEntityDefinition().newEntityLine().newEntityNameWithWS().getText().trim();
        } else {
            this.Errors.push(BuildDiagnostic({
                message: "Invalid entity line, did you miss entity name after @",
                context: parseTree.newEntityDefinition().newEntityLine()
            }))
        }

        return entityName;
    }

    ExtractType(parseTree) {
        if (parseTree.newEntityDefinition().newEntityLine().newEntityType()) {
            return parseTree.newEntityDefinition().newEntityLine().newEntityType().getText().trim().toLowerCase();
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

        if (parseTree.newEntityDefinition().newEntityListbody()) {
            for (const errorItemStr of parseTree.newEntityDefinition().newEntityListbody().errorString()) {
                if (errorItemStr.getText().trim() !== '') {
                    this.Errors.push(BuildDiagnostic({
                    message: "Invalid list entity line, did you miss '-' at line begin",
                    context: errorItemStr
                }))}
            }

            for (const normalItemStr of parseTree.newEntityDefinition().newEntityListbody().normalItemString()) {
                synonymsOrPhraseList.push(normalItemStr.getText());
            }
        }

        if (this.Type && this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
            let errorMsg = `no synonyms list found for list entity definition: "${parseTree.newEntityDefinition().entityLine().getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.newEntityDefinition().entityLine(),
                severity: DiagnosticSeverity.WARN
            })

            this.Errors.push(error);
        }

        return synonymsOrPhraseList;
    }
}

module.exports = NewEntitySection;