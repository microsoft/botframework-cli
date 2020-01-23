const QnaSectionContext = require('./generated/LUFileParser').LUFileParser.QnaSectionContext;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;
const helpers = require('../utils/helpers');
const QNA_GENERIC_SOURCE = "custom editorial";

class QnaSection {
    /**
     * 
     * @param {QnaSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.QNASECTION;
        this.Questions = [this.ExtractQuestion(parseTree)];
        let result = this.ExtractMoreQuestions(parseTree);
        this.Questions = this.Questions.concat(result.questions);
        this.Errors = result.errors;
        result = this.ExtractFilterPairs(parseTree);
        this.FilterPairs = result.filterPairs;
        this.Errors = this.Errors.concat(result.errors);
        this.Answer = this.ExtractAnswer(parseTree);
        result = this.ExtractPrompts(parseTree);
        this.prompts = result.promptDefinitions;
        this.Errors = this.Errors.concat(result.errors);
        this.Id = this.ExtractAssignedId(parseTree);
        this.source = this.ExtractSourceInfo(parseTree);
    }

    ExtractSourceInfo(parseTree) {
        let srcAssignment = parseTree.qnaDefinition().qnaSourceInfo()
        if (srcAssignment) {
            let srcRegExp = new RegExp(/^[ ]*\>[ ]*!#[ ]*@qna.pair.source[ ]*=[ ]*(?<sourceInfo>.*?)$/gmi);
            let srcParsed = srcRegExp.exec(srcAssignment.getText().trim());
            return srcParsed.groups.sourceInfo || QNA_GENERIC_SOURCE;
        }
        return QNA_GENERIC_SOURCE
    }
    
    ExtractAssignedId(parseTree) {
        let idAssignment = parseTree.qnaDefinition().qnaIdMark()
        if (idAssignment) {
            let idTextRegExp = new RegExp(/^\<a[ ]*id[ ]*=[ ]*[\"\'](?<idCaptured>.*?)[\"\'][ ]*>[ ]*\<\/a\>$/gmi);
            let idTextParsed = idTextRegExp.exec(idAssignment.getText().trim());
            return idTextParsed.groups.idCaptured || undefined;
        }
        return undefined;
    }

    ExtractPrompts(parseTree) {
        let promptDefinitions = [];
        let errors = [];
        let promptSection = parseTree.qnaDefinition().promptSection();
        if (promptSection) {
            if (promptSection.errorFilterLine() !== undefined) {
                for (const errorFilterLineStr of promptSection.errorFilterLine()) {
                    if (errorFilterLineStr.getText().trim() !== '') {
                        errors.push(BuildDiagnostic({
                        message: "Invalid QnA prompt line, expecting '-' prefix for each line.",
                        context: errorFilterLineStr
                    }))}
                }
            }
            
            for (const promptLine of promptSection.filterLine()) {
                let filterLineText = promptLine.getText().trim();
                filterLineText = filterLineText.substr(1).trim();
                if (helpers.isUtteranceLinkRef(filterLineText.replace('`context-only`', '').trim())) {
                    let promptConfigurationRegExp = new RegExp(/^\[(?<displayText>.*?)]\([ ]*\#[ ]*[ ?]*(?<linkedQuestion>.*?)\)[ ]*(?<contextOnly>\`context-only\`)?$/gmi);
                    let splitLine = promptConfigurationRegExp.exec(filterLineText);
                    if (!splitLine) {
                        errors.push(BuildDiagnostic({
                            message: "Invalid QnA prompt definition. Unable to parse prompt. Please verify syntax as well as question link`.",
                            context: filterLineText
                        }))
                    }
                    promptDefinitions.push(splitLine.groups);
                } else {
                    errors.push(BuildDiagnostic({
                        message: "Invalid QnA prompt definition. Prompts must be specified using a valid format [display text](# ? <question> | <id>) `context-only`.",
                        context: filterLineText
                    }))
                }
            }
        } 
    
        return { promptDefinitions, errors};
    }

    ExtractQuestion(parseTree) {
        return parseTree.qnaDefinition().qnaQuestion().questionText().getText().trim();
    }

    ExtractMoreQuestions(parseTree) {
        let questions = [];
        let errors = [];
        let questionsBody = parseTree.qnaDefinition().moreQuestionsBody();
        for (const errorQuestionStr of questionsBody.errorQuestionString()) {
            if (errorQuestionStr.getText().trim() !== '') {
                errors.push(BuildDiagnostic({
                message: "Invalid QnA question line, did you miss '-' at line begin",
                context: errorQuestionStr
            }))}
        }

        for (const question of questionsBody.moreQuestion()) {
            let questionText = question.getText().trim();
            questions.push(questionText.substr(1).trim());
        }

        return { questions, errors };
    }

    ExtractFilterPairs(parseTree) {
        let filterPairs = [];
        let errors = [];
        let filterSection = parseTree.qnaDefinition().qnaAnswerBody().filterSection();
        if (filterSection) {
            if (filterSection.errorFilterLine() !== undefined) {
                for (const errorFilterLineStr of filterSection.errorFilterLine()) {
                    if (errorFilterLineStr.getText().trim() !== '') {
                        errors.push(BuildDiagnostic({
                        message: "Invalid QnA filter line, did you miss '-' at line begin",
                        context: errorFilterLineStr
                    }))}
                }
            }
            
            for (const filterLine of filterSection.filterLine()) {
                let filterLineText = filterLine.getText().trim();
                filterLineText = filterLineText.substr(1).trim()
                let filterPair = filterLineText.split('=');
                let key = filterPair[0].trim();
                let value = filterPair[1].trim();
                filterPairs.push({ key, value });
            }
        } 

        return { filterPairs, errors };
    }

    ExtractAnswer(parseTree) {
        let multiLineAnswer = parseTree.qnaDefinition().qnaAnswerBody().multiLineAnswer().getText().trim();
        // trim first and last line
        var answerRegexp = /^```(markdown)?\n?(?<answer>(.|\n)*)```$/gim;
        let answer = answerRegexp.exec(multiLineAnswer);
        return answer.groups.answer !== undefined ? answer.groups.answer : '';
    }
}

module.exports = QnaSection;