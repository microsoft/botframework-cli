const NEWLINE = require('os').EOL;
const exception = require('./../../parser/lufile/classes/exception')
const retCode = require('./../../parser/lufile/enums/CLI-errors')
const deepEqual = require('deep-equal')

class Qna {
    constructor(qnaJSON) {
        this.urls = qnaJSON ? qnaJSON.urls: [];
        this.qnaList = qnaJSON ? qnaJSON.qnaList : [];
        this.files = qnaJSON ? qnaJSON.files : [];
        this.qnaDocuments = qnaJSON ? qnaJSON.qnaDocuments : [];
    }

    static build(parsedQnAList) {
        let FinalQnAJSON = new Qna();
        parsedQnAList.forEach(function (blob) {
            blob = blob.qnaJsonStructure;
            // does this blob have URLs?
            if (blob.urls.length > 0) {
                // add this url if this does not already exist in finaljson
                blob.urls.forEach(function (qnaUrl) {
                    if (!FinalQnAJSON.urls.includes(qnaUrl)) {
                        FinalQnAJSON.urls.push(qnaUrl);
                    }
                });
            }
            // does this blob have files?
            if (blob.files.length > 0) {
                // add this url if this does not already exist in finaljson
                blob.files.forEach(function (qnaFile) {
                    if (FinalQnAJSON.files.filter(item => { return item.fileUri == qnaFile.fileUri }).length === 0) {
                        FinalQnAJSON.files.push(qnaFile);
                    }
                });
            }
            // does this blob have qnapairs?
            if (blob.qnaList.length > 0) {
                // walk through each qnaPair and add it if it does not exist
                blob.qnaList.forEach(function (newQnAItem) {
                    if (FinalQnAJSON.qnaList.length == 0) {
                        FinalQnAJSON.qnaList.push(newQnAItem);
                    } else {
                        let qnaExists = false;
                        let fIndex = 0;
                        for (fIndex in FinalQnAJSON.qnaList) {
                            if (deepEqual(FinalQnAJSON.qnaList[fIndex], newQnAItem)) {
                                qnaExists = true;
                                break;
                            }
                        }
                        if (!qnaExists) FinalQnAJSON.qnaList.push(newQnAItem);
                    }
                });
            }

            if (blob.name !== undefined) FinalQnAJSON.name = blob.name;

        });
        return FinalQnAJSON
    }
    

    parseToLuContent() {
       let fileContent = '> # QnA pairs' + NEWLINE + NEWLINE;
       let root = null;
       if(this.qnaDocuments) {
           root = this.qnaDocuments;
       } else {
           root = this.qnaList;
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

   sortQnAJSON() {
        try {
            (this.qnaList || []).forEach(pair => {
                pair.questions.sort(sortComparers.compareFn);
            });
            this.qnaList.sort(sortComparers.compareQn);
        } catch (e) {
            throw (new exception(retCode.errorCode.INVALID_INPUT, 'Sorry, invalid QnA Maker json object'));
        }
    };
}

module.exports = Qna

const sortComparers = {
    
    compareAltName : function(a, b) {
        return compareString(a.alterations[0].toUpperCase(), b.alterations[0].toUpperCase())
    },    
    compareFn : function(a, b) {
        return compareString(a.toUpperCase(), b.toUpperCase())
    },    
    compareQn : function(a, b) {
        return compareString(a.questions[0].toUpperCase(), b.questions[0].toUpperCase())
    }
}

const compareString = function(a, b) {
    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;
}
