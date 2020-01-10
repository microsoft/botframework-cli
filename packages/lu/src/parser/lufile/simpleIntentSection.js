const SimpleIntentSectionContext = require('./generated/LUFileParser').LUFileParser.SimpleIntentSectionContext;
const EntitySection = require('./entitySection');
const NewEntitySection = require('./newEntitySection');
const visitor = require('./visitor');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const NEWLINE = require('os').EOL;

class SimpleIntentSection {
    /**
     * 
     * @param {SimpleIntentSectionContext} parseTree 
     */
    constructor(parseTree, content) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.SIMPLEINTENTSECTION;
        this.UtteranceAndEntitiesMap = [];
        this.Entities = [];
        this.Errors = [];
        this.Body = '';
        
        if (parseTree) {
            this.Name = this.ExtractName(parseTree);
            const result = this.ExtractUtteranceAndEntitiesMap(parseTree);
            this.UtteranceAndEntitiesMap = result.utteranceAndEntitiesMap;
            this.Entities = this.ExtractEntities(parseTree);
            this.Errors = result.errors;
            this.Id = `${this.SectionType}_${this.Name}`;
            this.Body = this.ExtractBody(parseTree, content)
        }
    }

    ExtractName(parseTree) {
        return parseTree.intentDefinition().intentNameLine().intentName().getText().trim();
    }

    ExtractUtteranceAndEntitiesMap(parseTree) {
        let utteranceAndEntitiesMap = [];
        let errors = [];
        if (parseTree.intentDefinition().intentBody() && parseTree.intentDefinition().intentBody().normalIntentBody()) {
            for (const normalIntentStr of parseTree.intentDefinition().intentBody().normalIntentBody().normalIntentString()) {
                let utteranceAndEntities = visitor.visitNormalIntentStringContext(normalIntentStr);
                utteranceAndEntities.context = normalIntentStr;
                utteranceAndEntitiesMap.push(utteranceAndEntities);
                utteranceAndEntities.errorMsgs.forEach(errorMsg => errors.push(BuildDiagnostic({
                    message: errorMsg,
                    context: normalIntentStr
                })))
            }
        }

        if (utteranceAndEntitiesMap.length === 0) {
            let errorMsg = `no utterances found for intent definition: "# ${this.Name}"`
            let error = BuildDiagnostic({
                message: errorMsg,
                context: parseTree.intentDefinition().intentNameLine(),
                severity: DiagnosticSeverity.WARN
            })

            errors.push(error);
        }

        return { utteranceAndEntitiesMap, errors };
    }

    ExtractEntities(parseTree) {
        let entitySections = [];
        if (parseTree.entitySection) {
            for (const entitySection of parseTree.entitySection()) {
                entitySections.push(new EntitySection(entitySection));
            }
        }

        if (parseTree.newEntitySection) {
            for (const entitySection of parseTree.newEntitySection()) {
                entitySections.push(new NewEntitySection(entitySection));
            }
        }

        return entitySections;
    }

    ExtractBody(parseTree, content) {
        const startLine = parseTree.start.line - 1
        const stopLine = parseTree.stop.line - 1
        const originList = content.split(/\r?\n/)
        if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine || originList.Length <= stopLine) {
            throw new Error("index out of range.")
        }

        if (startLine < stopLine) {
            const destList = originList.slice(startLine + 1, stopLine + 1)

            return destList.join(NEWLINE)
        } else {
            return ''
        }
    }
}

module.exports = SimpleIntentSection;