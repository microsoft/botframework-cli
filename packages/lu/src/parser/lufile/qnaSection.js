const QnaSectionContext = require('./generated/LUFileParser').LUFileParser.QnaSectionContext;
const LUSectionTypes = require('./../utils/enums/lusectiontypes');
const BuildDiagnostic = require('./diagnostic').BuildDiagnostic;

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
        this.Id = `${this.SectionType}_${this.Questions.join('_')}`;
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
            for (const errorFilterLineStr of filterSection.errorFilterLine()) {
                if (errorFilterLineStr.getText().trim() !== '') {
                    errors.push(BuildDiagnostic({
                    message: "Invalid QnA filter line, did you miss '-' at line begin",
                    context: errorFilterLineStr
                }))}
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
        let answer = multiLineAnswer.slice(11, multiLineAnswer.length - 3);
        
        return answer;
    }
}

module.exports = QnaSection;