const SimpleIntentSectionContext = require('./generated/LUFileParser').LUFileParser.SimpleIntentSectionContext;
const EntitySection = require('./entitySection');
const NewEntitySection = require('./newEntitySection');
const visitor = require('./visitor');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const NEWLINE = require('os').EOL;
const BaseSection = require('./baseSection');
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;

class SimpleIntentSection  extends BaseSection {
    /**
     * 
     * @param {SimpleIntentSectionContext} parseTree 
     */
    constructor(parseTree, content) {
        super();
        this.SectionType = LUSectionTypes.SIMPLEINTENTSECTION;
        this.UtteranceAndEntitiesMap = [];
        this.Entities = [];
        this.Errors = [];
        this.Body = '';
        
        if (parseTree) {
            this.Name = this.ExtractName(parseTree);
            this.IntentNameLine = this.ExtractIntentNameLine(parseTree);
            let result = this.ExtractUtteranceAndEntitiesMap(parseTree);
            this.UtteranceAndEntitiesMap = result.utteranceAndEntitiesMap;
            this.Errors = result.errors;
            this.Id = `${this.SectionType}_${this.Name}`;
            const startPosition = new Position(parseTree.start.line, parseTree.start.column);
            const stopPosition = new Position(parseTree.stop.line, parseTree.stop.column + parseTree.stop.text.length);
            this.Range = new Range(startPosition, stopPosition);
        }
    }

    ExtractName(parseTree) {
        return parseTree.intentDefinition().intentNameLine().intentName().getText().trim();
    }

    ExtractIntentNameLine(parseTree) {
        return parseTree.intentDefinition().intentNameLine().getText().trim();
    }

    ExtractUtteranceAndEntitiesMap(parseTree) {
        let utteranceAndEntitiesMap = [];
        let errors = [];
        if (parseTree.intentDefinition().intentBody() && parseTree.intentDefinition().intentBody().normalIntentBody()) {
            for (const errorIntentStr of parseTree.intentDefinition().intentBody().normalIntentBody().errorString()) {
                if (errorIntentStr.getText().trim() !== '') {
                    errors.push(BuildDiagnostic({
                    message: "Invalid intent body line, did you miss '-' at line begin",
                    context: errorIntentStr
                }))}
            }

            for (const normalIntentStr of parseTree.intentDefinition().intentBody().normalIntentBody().normalIntentString()) {
                let utteranceAndEntities;
                try {
                    utteranceAndEntities = visitor.visitNormalIntentStringContext(normalIntentStr);
                }
                catch (err) {
                    errors.push(BuildDiagnostic({
                        message: "Invalid utterance definition found. Did you miss a '{' or '}'?",
                        context: normalIntentStr
                    }))
                };
                if (utteranceAndEntities !== undefined) {
                    utteranceAndEntities.contextText = normalIntentStr.getText();
                    const startPosition = new Position(normalIntentStr.start.line, normalIntentStr.start.column);
                    const stopPosition = new Position(normalIntentStr.stop.line, normalIntentStr.stop.column + normalIntentStr.stop.text.length);
                    utteranceAndEntities.range = new Range(startPosition, stopPosition);
                    
                    utteranceAndEntitiesMap.push(utteranceAndEntities);
                    utteranceAndEntities.errorMsgs.forEach(errorMsg => errors.push(BuildDiagnostic({
                        message: errorMsg,
                        context: normalIntentStr
                    })));
                }
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
}

module.exports = SimpleIntentSection;