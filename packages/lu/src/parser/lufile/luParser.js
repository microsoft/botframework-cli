const antlr4 = require('antlr4');
const LUFileLexer = require('./generated/LUFileLexer').LUFileLexer;
const LUFileParser = require('./generated/LUFileParser').LUFileParser;
const FileContext = require('./generated/LUFileParser').LUFileParser.FileContext;
const LUResource = require('./luResource');
const NestedIntentSection = require('./nestedIntentSection');
const SimpleIntentSection = require('./simpleIntentSection');
const EntitySection = require('./entitySection');
const NewEntitySection =  require('./newEntitySection');
const ImportSection = require('./importSection');
const QnaSection = require('./qnaSection');
const ModelInfoSection = require('./modelInfoSection');
const LUErrorListener = require('./luErrorListener');
const SectionType = require('./../utils/enums/lusectiontypes');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;

class LUParser {
    /**
     * @param {string} text
     */
    static parse(text) {
        if (text === undefined || text === '') {
            return new LUResource([], '', []);
        }

        let sections = [];
        let content = text;

        let { fileContent, errors } = this.getFileContent(text);
        if (errors.length > 0) {
            return new LUResource(sections, content, errors);
        }

        let modelInfoSections = this.extractModelInfoSections(fileContent);
        modelInfoSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(modelInfoSections);

        let isSectionEnabled = this.isSectionEnabled(sections);

        let nestedIntentSections = this.extractNestedIntentSections(fileContent);
        nestedIntentSections.forEach(section => errors = errors.concat(section.Errors));
        if (isSectionEnabled) {
            sections = sections.concat(nestedIntentSections);
        } else {
            nestedIntentSections.forEach(section => {
                let emptyIntentSection = new SimpleIntentSection();
                emptyIntentSection.ParseTree = section.ParseTree.nestedIntentNameLine();
                emptyIntentSection.Name = section.Name;
                let errorMsg = `no utterances found for intent definition: "# ${emptyIntentSection.Name}"`
                let error = BuildDiagnostic({
                    message: errorMsg,
                    context: emptyIntentSection.ParseTree,
                    severity: DiagnosticSeverity.WARN
                })

                errors.push(error);
                sections.push(emptyIntentSection);

                section.SimpleIntentSections.forEach(subSection => {
                    sections.push(subSection);
                    errors = errors.concat(subSection.Errors);
                })
            });
        }

        let simpleIntentSections = this.extractSimpleIntentSections(fileContent);
        simpleIntentSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(simpleIntentSections);

        let entitySections = this.extractEntitiesSections(fileContent);
        entitySections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(entitySections);

        let newEntitySections = this.extractNewEntitiesSections(fileContent);
        newEntitySections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(newEntitySections);

        let importSections = this.extractImportSections(fileContent);
        importSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(importSections);
        
        let qnaSections = this.extractQnaSections(fileContent);
        qnaSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(qnaSections);

        return new LUResource(sections, content, errors);
    }

    /**
     * @param {string} text
     */
    static getFileContent(text) {
        if (text === undefined
            || text === ''
            || text === null) {
            
            return undefined;
        }

        const chars = new antlr4.InputStream(text);
        const lexer = new LUFileLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new LUFileParser(tokens);
        let errors = [];
        const listener = new LUErrorListener(errors)
        parser.removeErrorListeners();
        parser.addErrorListener(listener);
        parser.buildParseTrees = true;
        const fileContent = parser.file();
        
        return { fileContent, errors };
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractNestedIntentSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let nestedIntentSections = fileContext.paragraph()
            .map(x => x.nestedIntentSection())
            .filter(x => x !== undefined && x !== null);

        let nestedIntentSectionList = nestedIntentSections.map(x => new NestedIntentSection(x));

        return nestedIntentSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractSimpleIntentSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let simpleIntentSections = fileContext.paragraph()
            .map(x => x.simpleIntentSection())
            .filter(x => x !== undefined && x !== null);

        let simpleIntentSectionList = simpleIntentSections.map(x => new SimpleIntentSection(x));

        return simpleIntentSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractEntitiesSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let entitySections = fileContext.paragraph()
            .map(x => x.entitySection())
            .filter(x => x !== undefined && x != null);

        let entitySectionList = entitySections.map(x => new EntitySection(x));

        return entitySectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractNewEntitiesSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let entitySections = fileContext.paragraph()
            .map(x => x.newEntitySection())
            .filter(x => x !== undefined && x != null);

        let entitySectionList = entitySections.map(x => new NewEntitySection(x));

        return entitySectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractImportSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let importSections = fileContext.paragraph()
            .map(x => x.importSection())
            .filter(x => x !== undefined && x != null);

        let importSectionList = importSections.map(x => new ImportSection(x));

        return importSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractQnaSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let qnaSections = fileContext.paragraph()
            .map(x => x.qnaSection())
            .filter(x => x !== undefined && x != null);

        let qnaSectionList = qnaSections.map(x => new QnaSection(x));

        return qnaSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractModelInfoSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let modelInfoSections = fileContext.paragraph()
            .map(x => x.modelInfoSection())
            .filter(x => x !== undefined && x != null);

        let modelInfoSectionList = modelInfoSections.map(x => new ModelInfoSection(x));

        return modelInfoSectionList;
    }

    static isSectionEnabled(sections) {
        let modelInfoSections = sections.filter(s => s.SectionType === SectionType.MODELINFOSECTION);
        let enableSections = false;
        if (modelInfoSections && modelInfoSections.length > 0) {
            for (const modelInfo of modelInfoSections) {
                let line = modelInfo.ModelInfo
                let kvPair = line.split(/@(enableSections).(.*)=/g).map(item => item.trim());
                if (kvPair.length === 4) {
                    if (kvPair[1] === 'enableSections' && kvPair[3] === 'true') {
                        enableSections = true;
                        break;
                    }
                }
            }
        }

        return enableSections;
    }
}

module.exports = LUParser;