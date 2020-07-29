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
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;
const NEWLINE = require('os').EOL;

class LUParser {

    /**
     * 
     * @param {string} text 
     * @param {LUResource} luResource 
     */
    static parseWithRef(text, luResource) {
        if (text === undefined || text === '') {
            return new LUResource([], '', []);
        }

        const sectionEnabled = luResource ? this.isSectionEnabled(luResource.Sections) : undefined;

        return this.parse(text, sectionEnabled);
    }

    /**
     * @param {string} text
     */
    static parse(text, sectionEnabled) {
        if (text === undefined || text === '') {
            return new LUResource([], '', []);
        }

        let {fileContent, errors} = this.getFileContent(text);

        return this.extractFileContent(fileContent, text, errors, sectionEnabled);
    }

    static extractFileContent(fileContent, content, errors, sectionEnabled) {
        let sections = [];
        try {
            let modelInfoSections = this.extractModelInfoSections(fileContent);
            modelInfoSections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(modelInfoSections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing model information: ${err.message}`
            }))
        }

        try {
            let isSectionEnabled = sectionEnabled === undefined ?  this.isSectionEnabled(sections) : sectionEnabled;

            let nestedIntentSections = this.extractNestedIntentSections(fileContent, content);
            nestedIntentSections.forEach(section => errors = errors.concat(section.Errors));
            if (isSectionEnabled) {
                sections = sections.concat(nestedIntentSections);
            } else {
                nestedIntentSections.forEach(section => {
                    let emptyIntentSection = new SimpleIntentSection();
                    emptyIntentSection.Name = section.Name;
                    emptyIntentSection.Id = `${emptyIntentSection.SectionType}_${emptyIntentSection.Name}`
                    
                    // get the end character index
                    // this is default value
                    // it will be reset in function extractSectionBody()
                    let endCharacter = section.Name.length + 2;
                   
                    const range = new Range(section.Range.Start, new Position(section.Range.Start.Line, endCharacter))
                    emptyIntentSection.Range = range;
                    let errorMsg = `no utterances found for intent definition: "# ${emptyIntentSection.Name}"`
                    let error = BuildDiagnostic({
                        message: errorMsg,
                        range: emptyIntentSection.Range,
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
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing nested intent section: ${err.message}`
            }))
        }

        try {
            let simpleIntentSections = this.extractSimpleIntentSections(fileContent, content);
            simpleIntentSections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(simpleIntentSections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing simple intent section: ${err.message}`
            }))
        }

        try {
            let entitySections = this.extractEntitiesSections(fileContent);
            entitySections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(entitySections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing entities: ${err.message}`
            }))
        }

        try {
            let newEntitySections = this.extractNewEntitiesSections(fileContent);
            newEntitySections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(newEntitySections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing new entities: ${err.message}`
            }))
        }

        try {
            let importSections = this.extractImportSections(fileContent);
            importSections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(importSections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing import section: ${err.message}`
            }))
        }

        try {
            let qnaSections = this.extractQnaSections(fileContent);
            qnaSections.forEach(section => errors = errors.concat(section.Errors));
            sections = sections.concat(qnaSections);
        } catch (err) {
            errors.push(BuildDiagnostic({
                message: `Error happened when parsing qna section: ${err.message}`
            }))
        }

        sections = this.reconstractIntentSections(sections)

        this.extractSectionBody(sections, content)

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
     * @param {string} content 
     */
    static extractNestedIntentSections(fileContext, content) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let nestedIntentSections = fileContext.paragraph()
            .map(x => x.nestedIntentSection())
            .filter(x => x !== undefined && x !== null);

        let nestedIntentSectionList = nestedIntentSections.map(x => new NestedIntentSection(x, content));

        return nestedIntentSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     * @param {string} content 
     */
    static extractSimpleIntentSections(fileContext, content) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let simpleIntentSections = fileContext.paragraph()
            .map(x => x.simpleIntentSection())
            .filter(x => x && x.intentDefinition());

        let simpleIntentSectionList = simpleIntentSections.map(x => new SimpleIntentSection(x, content));

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
            .filter(x => x && x.entityDefinition());

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

        let newEntitySections = fileContext.paragraph()
            .map(x => x.newEntitySection())
            .filter(x => x && x.newEntityDefinition());
        
        let newEntitySectionList = newEntitySections.map(x => new NewEntitySection(x));

        return newEntitySectionList;
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
            .filter(x => x !== undefined && x !== null);

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
            .filter(x => x !== undefined && x !== null);

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
            .filter(x => x !== undefined && x !== null);

        let modelInfoSectionList = modelInfoSections.map(x => new ModelInfoSection(x));

        return modelInfoSectionList;
    }

    /**
     * @param {any[]} sections 
     */
    static reconstractIntentSections(sections) {
        let newSections = []
        sections.sort((a, b) => a.Range.Start.Line - b.Range.Start.Line)
        let index
        for (index = 0; index < sections.length; index++) {
            let section = sections[index]
            if (index + 1 === sections.length) {
                newSections.push(section)
                break
            }

            if (section.SectionType === SectionType.NESTEDINTENTSECTION) {
                if (sections[index + 1].SectionType === SectionType.ENTITYSECTION
                    || sections[index + 1].SectionType === SectionType.NEWENTITYSECTION) {
                    let simpleIntentSections = section.SimpleIntentSections
                    simpleIntentSections[simpleIntentSections.length - 1].Entities.push(sections[index + 1])
                    simpleIntentSections[simpleIntentSections.length - 1].Errors.push(...sections[index + 1].Errors)
                    index++

                    while (index + 1 < sections.length 
                        && (sections[index + 1].SectionType === SectionType.ENTITYSECTION
                        || sections[index + 1].SectionType === SectionType.NEWENTITYSECTION
                        || (sections[index + 1].SectionType === SectionType.SIMPLEINTENTSECTION && sections[index + 1].IntentNameLine.includes('##')))) {
                        if (sections[index + 1].SectionType === SectionType.ENTITYSECTION
                            || sections[index + 1].SectionType === SectionType.NEWENTITYSECTION) {
                            simpleIntentSections[simpleIntentSections.length - 1].Entities.push(sections[index + 1])
                            simpleIntentSections[simpleIntentSections.length - 1].Errors.push(...sections[index + 1].Errors)
                        } else {
                            simpleIntentSections.push(sections[index + 1])
                        }

                        index++
                    }

                    simpleIntentSections.forEach(s => section.Errors.push(...s.Errors))

                    section.SimpleIntentSection = simpleIntentSections
                }
            } else if (section.SectionType === SectionType.SIMPLEINTENTSECTION) {
                while (index + 1 < sections.length && (sections[index + 1].SectionType === SectionType.ENTITYSECTION
                    || sections[index + 1].SectionType === SectionType.NEWENTITYSECTION)) {
                    section.Entities.push(sections[index + 1])
                    section.Errors.push(...sections[index + 1].Errors)
                    index++
                }
            }

            newSections.push(section)
        }

        return newSections
    }

    /**
     * @param {any[]} sections
     * @param {string} content
     */
    static extractSectionBody(sections, content) {
        const originList = content.split(/\r?\n/)
        let qnaSectionIndex = 0
        sections.forEach(function (section, index) {
            if (section.SectionType === SectionType.SIMPLEINTENTSECTION
                || section.SectionType === SectionType.NESTEDINTENTSECTION
                || section.SectionType === SectionType.QNASECTION) {
                const startLine = section.Range.Start.Line - 1;
                let stopLine
                if (index + 1 < sections.length) {
                    stopLine = sections[index + 1].Range.Start.Line - 1
                    if (isNaN(startLine) || isNaN(stopLine) || startLine < 0 || startLine > stopLine) {
                        throw new Error("index out of range.")
                    }
                } else {
                    stopLine = originList.length
                }
                section.Range.End.Line = stopLine;
                section.Range.End.Character = originList[stopLine - 1].length

                let destList
                if (section.SectionType === SectionType.QNASECTION) {
                    destList = originList.slice(startLine, stopLine)
                    section.Id = qnaSectionIndex
                    qnaSectionIndex++
                } else {
                    destList = originList.slice(startLine + 1, stopLine)
                }

                section.Body = destList.join(NEWLINE)

                if (section.SectionType === SectionType.NESTEDINTENTSECTION) {
                    LUParser.extractSectionBody(section.SimpleIntentSections, originList.slice(0, stopLine).join(NEWLINE))
                }
            }
        })
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