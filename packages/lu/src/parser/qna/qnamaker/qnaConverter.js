const NEWLINE = require('os').EOL;
const exception = require('./../../lufile/classes/exception')
const retCode = require('./../../lufile/enums/CLI-errors')

const qnaToLuContent = function(qnaJSON){
    let fileContent = '> # QnA pairs' + NEWLINE + NEWLINE;
    let root = null;
    if(qnaJSON.qnaDocuments) {
        root = qnaJSON.qnaDocuments;
    } else {
        root = qnaJSON.qnaList;
    }
    
    if (!root) {
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'No input QnA content found '));
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
    return fileContent
}

module.exports = qnaToLuContent
