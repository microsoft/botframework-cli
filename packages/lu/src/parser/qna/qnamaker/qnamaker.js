const qnaConverter = require('./qnaConverter')
const deepEqual = require('deep-equal')

class QnAMaker {
    constructor(qnaJSON = null) {
        if (qnaJSON) {
            for (let prop in qnaJSON) {
                this[prop] = qnaJSON[prop];
            }
        } else {
            this.urls = [];
            this.qnaList = [];
            this.files = [];
        }
    }

    hasContent(){
        for (let prop in this) {
            if (this[prop].length > 0 ) return true
        }   
        return false
    }

    parseToLuContent() {
        return qnaConverter(this)
   }

   sort() {
        this.qnaList.forEach(pair => {
            pair.questions.sort(sortComparers.compareFn);
        });
        this.qnaList.sort(sortComparers.compareQn);
    }

    collate(qnaList) {
        for (let i = 0; i < qnaList.length; i++) {
            let blob = qnaList[i]
            // does this blob have URLs?
            collateUrls(this, blob)
            // does this blob have files?
            collateFiles(this, blob)
            // does this blob have qnapairs?
            collateQnAPairs(this, blob)

           this.name = blob.name ? blob.name : this.name

        };    
    }

    resolveMultiTurnReferences() {
        var qnaPairsWithMultiTurn = this.qnaList.filter(item => item.context.prompts.length !== 0);
        (qnaPairsWithMultiTurn || []).forEach(item => {
            // find matching QnA id for each follow up prompt
            (item.context.prompts || []).forEach(prompt => {
                var qnaId = this.qnaList.find(x => x.questions.includes(prompt.qnaId) || x.questions.includes(prompt.qnaId.replace('-', ' ')));
                if (qnaId === undefined) {
                    // throw
                    throw (new exception(retCode.errorCode.INVALID_INPUT, `[ERROR]: Cannot find follow up prompt definition for '- [${prompt.displayText}](#?${prompt.qnaId}).`));
                } else {
                    prompt.qnaId = qnaId.id;
                    prompt.qna = qnaId;
                    prompt.qna.context.isContextOnly = prompt.isContextOnly ? prompt.isContextOnly : prompt.qna.context.isContextOnly;
                    qnaId.context.isContextOnly = qnaId.context.isContextOnly ? qnaId.context.contextOnly : prompt.qna.context.isContextOnly;
                }
            })
        })
    }
}

module.exports = QnAMaker

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

const collateUrls = function(instance, qnaObject) {
    if (qnaObject.urls.length == 0) {
        return
    }
    // add this url if this does not already exist in finaljson
    qnaObject.urls.forEach(function (qnaUrl) {
        if (!instance.urls.includes(qnaUrl)) {
            instance.urls.push(qnaUrl);
        }
    });

}

const collateFiles = function(instance, qnaObject) {
    if (qnaObject.files.length === 0) {
        return
    }
    // add this url if this does not already exist in finaljson
    qnaObject.files.forEach(function (qnaFile) {
        if (instance.files.filter(item => { return item.fileUri == qnaFile.fileUri }).length === 0) {
            instance.files.push(qnaFile);
        }
    });
}

const collateQnAPairs = function(instance, qnaObject) {
    if (qnaObject.qnaList.length === 0) {
        return
    }
    // walk through each qnaPair and add it if it does not exist
    qnaObject.qnaList.forEach(function (newQnAItem) {
        if (instance.qnaList.length == 0) {
            instance.qnaList.push(newQnAItem);
        } else {
            let qnaExists = false;
            let fIndex = 0;
            for (fIndex in instance.qnaList) {
                if (deepEqual(instance.qnaList[fIndex], newQnAItem)) {
                    qnaExists = true;
                    break;
                }
            }
            if (!qnaExists) instance.qnaList.push(newQnAItem);
        }
    });
}

