const NEWLINE = require('os').EOL;

class alterations{
    constructor(alterations) {
        this.wordAlterations = alterations?alterations:[];
    }

    static build(allParsedQnAAlterations) {
        let finalQnAAlterationsList = new alterations
        allParsedQnAAlterations.forEach(function (alterationList) {
            alterationList = alterationList.qnaAlterations;
            if (alterationList.wordAlterations) {
                alterationList.wordAlterations.forEach(function (alteration) {
                    finalQnAAlterationsList.wordAlterations.push(alteration);
                })
            }
        })
        return finalQnAAlterationsList;
    }

    parseToLuContent() {
        let fileContent = '> # QnA Alterations' + NEWLINE + NEWLINE;
        if(this.wordAlterations && this.wordAlterations.length > 0) {
            this.wordAlterations.forEach(function(alteration) {
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
}

module.exports = alterations