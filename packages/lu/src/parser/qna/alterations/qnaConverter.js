const NEWLINE = require('os').EOL;

const qnaAlterationsToLuContent = function(alterationsJSON){
    let fileContent = '> # QnA Alterations' + NEWLINE + NEWLINE;
    if(alterationsJSON.wordAlterations && alterationsJSON.wordAlterations.length > 0) {
        alterationsJSON.wordAlterations.forEach(function(alteration) {
            fileContent += '$' + alteration.alterations[0] + ' : ' + 'qna-alterations = ' + NEWLINE;
            alteration.alterations.splice(0, 1);
            alteration.alterations.forEach(function(item) {
                fileContent += '- ' + item + NEWLINE;
            })
            fileContent += NEWLINE;
        });
    }
    return fileContent
}

module.exports = qnaAlterationsToLuContent