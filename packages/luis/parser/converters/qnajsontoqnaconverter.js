const NEWLINE = require('os').EOL;
const qnaFile = require('./../qnafile/parseQnAFile')
const helperClasses = require('./../lufile/classes/hclasses')

module.exports = {
    parseQnAToLu: async function(file, isAlterations) {
            let QnAJSON = new helperClasses.readerObject()
            QnAJSON.model = await qnaFile.parseQnAJSONFile(file)
            QnAJSON.sourceFile = file
            return await constructMdFileHelper(QnAJSON, isAlterations)
    }
}

/**
 * Helper function to construct the file content based on parsed luis and qna objects
 * 
 * @param {object} QnAJSON QnA JSON or QnA Alteration file content
 * @param {boolean} include_model_info If true, QnA Alteration file content will be parsed
 * @returns {String} Generated Markdown file content to flush to disk
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const constructMdFileHelper = async function(QnAJSON, isAlterations) {
    let fileContent = ''
    let modelDesc = ''

    if (!QnAJSON.sourceFile) {
        return
    }

    if (!isAlterations) {
        fileContent += await constructMdFromQnAJSON(QnAJSON.model)
        modelDesc += await constructModelDescFromQnAJSON(QnAJSON.model)
    } else {
        fileContent += await constructMdFromQnAAlterationJSON(QnAJSON.model)
    }
    return fileContent
}

/**
 * Construct lu file content from QnA Alteration JSON object
 * @param {object} QnAAltJSON QnA Alteration JSON object
 * @returns {String} Generated lu content 
 */
constructMdFromQnAAlterationJSON = function(QnAAltJSON) {
    let fileContent = '> # QnA Alterations' + NEWLINE + NEWLINE;
    if(QnAAltJSON.wordAlterations.length > 0) {
        QnAAltJSON.wordAlterations.forEach(function(alteration) {
            fileContent += '$' + alteration.alterations[0] + ' : ' + 'qna-alterations = ' + NEWLINE;
            alteration.alterations.splice(0, 1);
            alteration.alterations.forEach(function(item) {
                fileContent += '- ' + item + NEWLINE;
            })
            fileContent += NEWLINE;
        });
    }
    return fileContent;
},
/**
 * Construct lu file content from QnA JSON object
 * @param {object} QnAJSON QnA JSON object
 * @returns {String} Generated lu content 
 */
constructMdFromQnAJSON = function(QnAJSON) {
    let fileContent = '> # QnA pairs' + NEWLINE + NEWLINE;
    let root = null;
    if(QnAJSON.qnaDocuments) {
        root = QnAJSON.qnaDocuments;
    } else {
        root = QnAJSON.qnaList;
    }
    if(root.length > 0) {
        root.forEach(function(qnaItem) {
            fileContent += '> Source: ' + qnaItem.source + NEWLINE;
            fileContent += '## ? ' + qnaItem.questions[0] + NEWLINE;
            qnaItem.questions.splice(0,1);
            qnaItem.questions.forEach(function(question) {
                fileContent += '- ' + question + NEWLINE;
            })
            fileContent += NEWLINE;
            if(qnaItem.metadata.length > 0) {
                fileContent += NEWLINE + '**Filters:**' + NEWLINE;
                qnaItem.metadata.forEach(function(filter) {
                    fileContent += '- ' + filter.name + ' = ' + filter.value + NEWLINE;    
                });
                fileContent += NEWLINE;
            }
            fileContent += '```markdown' + NEWLINE;
            fileContent += qnaItem.answer + NEWLINE;
            fileContent += '```' + NEWLINE + NEWLINE;
        });

    }
    return fileContent;
}

/**
 * Helper function to construct model description information from QnA JSON
 * @param {Object} QnAJSON 
 * @returns {string} model description
 */
const constructModelDescFromQnAJSON = async function(QnAJSON) {
    let modelDesc = NEWLINE;
    modelDesc += '> QnA KB information' + NEWLINE;
    modelDesc += '> !# @kb.name = ' + QnAJSON.name + NEWLINE;
    return modelDesc;
}