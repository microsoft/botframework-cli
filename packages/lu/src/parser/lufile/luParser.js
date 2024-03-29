import antlr4 from 'antlr4';
const { CommonTokenStream, InputStream } = antlr4;
import LUFileLexer from './generated/LUFileLexer.js';
import LUFileParser from './generated/LUFileParser.js';
import FileContext from './generated/LUFileParser.js';
const LUResource = require('./luResource');
const NestedIntentSection = require('./nestedIntentSection');
const SimpleIntentSection = require('./simpleIntentSection');
const EntitySection = require('./entitySection');
const NewEntitySection =  require('./newEntitySection');
const ImportSection = require('./importSection');
const ReferenceSection = require('./referenceSection');
const QnaSection = require('./qnaSection');
const ModelInfoSection = require('./modelInfoSection');
const LUErrorListener = require('./luErrorListener');
const SectionType = require('./../utils/enums/lusectiontypes');
const DiagnosticSeverity = require('./diagnostic').DiagnosticSeverity;
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const Range = require('./diagnostic').Range;
const Position = require('./diagnostic').Position;
const NEWLINE = require('os').EOL;

const defaultConfig = {
  enableModelDescription: true,
  enableComments: true // Temporarily enabled by default, cannot be configured
}

const objectFactory = (className) => {
    const classes = { 
        NestedIntentSection, 
        SimpleIntentSection, 
        EntitySection, 
        NewEntitySection, 
        ImportSection, 
        ReferenceSection, 
        QnaSection, 
        ModelInfoSection
    };
    return classes[className]
}

const extractElementSections = (mapFunction, filterFunction, className, fileContext, content) => {
    if (fileContext === undefined
        || fileContext === null) {
            return [];
    }

    let entitySections = fileContext.paragraph()
        .map(x => x[mapFunction]());

    let filterToApply = (x => x !== undefined && x !== null);
    if (filterFunction) {
        filterToApply = (x => x && x[filterFunction]());
    } 

    entitySections = entitySections.filter(filterToApply);

    let entitySectionList = entitySections.map(x => {
        const classToBuild = objectFactory(className)
        return new classToBuild(x, content);
    });

    return entitySectionList;
}

const buildSection = (strategyObject) => {
    let builtSections = []
    let builtErrors = []

    try {
        let sectionToBuild = extractElementSections(...strategyObject.args);
        sectionToBuild.forEach(section => builtErrors = builtErrors.concat(section.Errors));

        if (strategyObject.postProcess) {
            let postProcessArgs = [sectionToBuild].concat(strategyObject.postProcessArgs ? strategyObject.postProcessArgs : []);
            let result = strategyObject.postProcess.apply(this, postProcessArgs);
            builtSections = builtSections.concat(result.sections);
            builtErrors = builtErrors.concat(result.errors)
        }
        builtSections = builtSections.concat(sectionToBuild);
    } catch (err) {
        builtErrors.push(BuildDiagnostic({
            message: `${strategyObject.message} ${err.message}`
        }));
    }

    return {
            sections: builtSections,
            errors: builtErrors,
    }
}


class LUParser {
    /**
     *
     * @param {string} text
     * @param {LUResource} luResource
     */
    static parseWithRef(text, luResource, config) {
        config = config || {};
        config = {...defaultConfig, ...config};
        if (text === undefined || text === '') {
            return new LUResource([], '', []);
        }

        const sectionEnabled = luResource ? this.isSectionEnabled(luResource.Sections) : undefined;

        return this.parse(text, sectionEnabled, config);
    }

    /**
     * @param {string} text
     */
    static parse(text, sectionEnabled, config) {
        config = config || {};
        config = {...defaultConfig, ...config};
        if (text === undefined || text === '') {
            return new LUResource([], '', []);
        }

        let {fileContent, errors} = this.getFileContent(text);

        return this.extractFileContent(fileContent, text, errors, sectionEnabled, config);
    }

    static extractFileContent(fileContent, content, errors, sectionEnabled, config) {
        let sections = [];
        let modelInfoSections = [];

        let result = buildSection({args:['modelInfoSection', undefined, 'ModelInfoSection', fileContent], message: 'Error happened when parsing model information:' });
        sections = sections.concat(result.sections);
        errors = errors.concat(result.errors)

        if (modelInfoSections && modelInfoSections.length > 0 && !config.enableModelDescription) {
          errors.push(BuildDiagnostic({
            message: `Do not support Model Description. Please make sure enableModelDescription is set to true.`
          }))
        }

        let isSectionEnabled = sectionEnabled === undefined ?  this.isSectionEnabled(sections) : sectionEnabled;

        let strategies = [
            {args:['nestedIntentSection', undefined, 'NestedIntentSection', fileContent, content], message: 'Error happened when parsing nested intent section:', postProcess: this.filterNestedEntities, postProcessArgs: isSectionEnabled},
            {args:['simpleIntentSection', 'intentDefinition', 'SimpleIntentSection', fileContent, content], message: 'Error happened when parsing simple intent section:' }, 
            {args:['entitySection', 'entityDefinition', 'EntitySection', fileContent], message: 'Error happened when parsing entities:'},
            {args:['newEntitySection', 'newEntityDefinition', 'NewEntitySection', fileContent], message: 'Error happened when parsing new entities:', postProcess: this.filterPrebuiltEntities },
            {args:['importSection', undefined, 'ImportSection', fileContent], message: 'Error happened when parsing import section:'}, 
            {args:['referenceSection', undefined, 'ReferenceSection', fileContent], message: 'Error happened when parsing reference section:'},
            {args:['qnaSection', undefined, 'QnaSection', fileContent], message: 'Error happened when parsing qna section'}
        ]

        for(let i = 0; i < strategies.length; i++){
            result = buildSection(strategies[i]);
            sections = sections.concat(result.sections);
            errors = errors.concat(result.errors)
        };

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

        const chars = new InputStream(text);
        const lexer = new LUFileLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new LUFileParser(tokens);
        let errors = [];
        const listener = new LUErrorListener(errors)
        parser.removeErrorListeners();
        parser.addErrorListener(listener);
        parser.buildParseTrees = true;
        const fileContent = parser.file();

        return { fileContent, errors };
    }

    static filterPrebuiltEntities (newEntitySections) {
        const prebuilts = new Set(['age', 'datetimeV2', 'dimension', 'email', 'geographyV2', 'keyPhrase', 'money', 'number', 'ordinal', 'ordinalV2',
        'percentage', 'personName', 'phonenumber', 'temperature', 'url', 'datetime']);
        newEntitySections.forEach(section =>{
            if (prebuilts.has(section.Name) && section.Type && section.Type !== 'prebuilt') {
                section.Errors.push(BuildDiagnostic({
                    message: `The model name ${section.Name} is reserved.`,
                    range: section.Range
                }))
            }
        });
        return {sections:[], errors:[]};
    }

    static filterNestedEntities (nestedIntentSections, isSectionEnabled) {
        let sections = [];
        let errors = [];
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

        nestedIntentSections.splice(0, nestedIntentSections.length);
        return {
            sections,
            errors
        }
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
