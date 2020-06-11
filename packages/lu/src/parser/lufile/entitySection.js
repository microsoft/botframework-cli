const EntitySectionContext = require('./generated/LUFileParser').LUFileParser.EntitySectionContext;
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const InvalidCharsInIntentOrEntityName = require('./../utils/enums/invalidchars').InvalidCharsInIntentOrEntityName;

class EntitySection {
    /**
     * 
     * @param {EntitySectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.ENTITYSECTION;
        this.Errors = []
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        this.SynonymsOrPhraseList = this.ExtractSynonymsOrPhraseList(parseTree);
        this.Id = `${this.SectionType}_${this.Name}`;
    }

    ExtractName(parseTree) {
        let entityName;
        if (parseTree.entityDefinition().entityLine().entityName()) {
            entityName = parseTree.entityDefinition().entityLine().entityName().getText().trim();
        } else {
            this.Errors.push(BuildDiagnostic({
                message: "Invalid entity line, did you miss entity name after $",
                context: parseTree.entityDefinition().entityLine()
            }));
        }

        if (entityName && InvalidCharsInIntentOrEntityName.some(x => entityName.includes(x))) {
            this.Errors.push(BuildDiagnostic({
                message: `Invalid entity line, entity name ${entityName} cannot contain any of the following characters: [<, >, *, %, &, :, \\, $]`,
                context: parseTree.newEntityDefinition().newEntityLine()
            }));
        } else {
            return entityName;
        }
    }

    ExtractType(parseTree) {
        if (parseTree.entityDefinition().entityLine().entityType()) {
            return parseTree.entityDefinition().entityLine().entityType().getText().trim();
        } else {
            this.Errors.push(BuildDiagnostic({
                message: "Invalid entity line, did you miss entity type after $",
                context: parseTree.entityDefinition().entityLine()
            }))   
        }
    }

    ExtractSynonymsOrPhraseList(parseTree) {
        let synonymsOrPhraseList = [];

        if (parseTree.entityDefinition().entityListBody()) {
            for (const errorItemStr of parseTree.entityDefinition().entityListBody().errorString()) {
                if (errorItemStr.getText().trim() !== '') {
                    this.Errors.push(BuildDiagnostic({
                    message: "Invalid list entity line, did you miss '-' at line begin",
                    context: errorItemStr
                }))}
            }

            for (const normalItemStr of parseTree.entityDefinition().entityListBody().normalItemString()) {
                var itemStr = normalItemStr.getText().trim();
                synonymsOrPhraseList.push(itemStr.substr(1).trim());
            }
        }

        if (this.Type && this.Type.indexOf('=') > -1 && synonymsOrPhraseList.length === 0) {
            let errorMsg = `no synonyms list found for list entity definition: "${parseTree.entityDefinition().entityLine().getText()}"`;
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.entityDefinition().entityLine(),
                severity: DiagnosticSeverity.WARN
            })

            this.Errors.push(error);
        }

        return synonymsOrPhraseList;
    }
}

module.exports = EntitySection;