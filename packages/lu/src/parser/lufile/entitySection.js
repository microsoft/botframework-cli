import EntitySectionContext from './generated/LUFileParser.js'
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class EntitySection extends BaseSection {
    /**
     * 
     * @param {EntitySectionContext} parseTree 
     */
    constructor(parseTree) {
        super();
        this.SectionType = LUSectionTypes.ENTITYSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Type = this.ExtractType(parseTree);
        this.SynonymsOrPhraseList = this.ExtractSynonymsOrPhraseList(parseTree);
        this.Id = `${this.SectionType}_${this.Name}`;
        const startPosition = new Position(parseTree.start.line, parseTree.start.column);
        const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
        this.Range = new Range(startPosition, stopPosition);
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

        return entityName;
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