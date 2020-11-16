const NEWLINE = require('os').EOL;
const exception = require('./../../utils/exception')
const retCode = require('./../../utils/enums/CLI-errors')
const QNA_GENERIC_SOURCE = "custom editorial";

/**
 * Parses a QnAMaker object into Qna Content
 * @param {QnAMaker} qnaJSON
 * @returns {string} Qna Content
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
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

    if(root.length <= 0) {
        return fileContent
    }
    
    root.forEach(function(qnaItem) {
        fileContent += '> !# @qna.pair.source = ' + qnaItem.source + NEWLINE + NEWLINE;
        fileContent += qnaItem.id.toString() !== "0" ? `<a id = "${qnaItem.id}"></a>` + NEWLINE + NEWLINE : '';
        fileContent += '# ? ' + qnaItem.questions[0] + NEWLINE;
        qnaItem.questions.splice(0,1);
        qnaItem.questions.forEach(function(question) {
            fileContent += '- ' + question + NEWLINE;
        })
        fileContent += NEWLINE;
        if(qnaItem.metadata && qnaItem.metadata.length > 0) {
            fileContent += '**Filters:**' + NEWLINE;
            qnaItem.metadata.forEach(function(filter) {
                fileContent += '- ' + filter.name + ' = ' + filter.value + NEWLINE;    
            });
            fileContent += NEWLINE;
        }
        fileContent += '```markdown' + NEWLINE;
        fileContent += qnaItem.answer + NEWLINE;
        fileContent += '```' + NEWLINE;
        if (qnaItem.context && qnaItem.context.prompts && qnaItem.context.prompts.length !== 0) {
            fileContent += NEWLINE + '**Prompts:**' + NEWLINE;
            qnaItem.context.prompts.forEach(function(prompt) {
                fileContent += `- [${prompt.displayText}](#${prompt.qnaId})`;
                // See if the linked prompt is context only and if so, add the decoration.
                let promptQnA = root.find(item => item.id == prompt.qnaId);
                if (promptQnA) {
                    fileContent += promptQnA.context.isContextOnly === true ? ` \`context-only\`` : '';
                }
                fileContent += NEWLINE;
            })
        }
        fileContent += NEWLINE;
    });

    return fileContent
}

module.exports = qnaToLuContent
