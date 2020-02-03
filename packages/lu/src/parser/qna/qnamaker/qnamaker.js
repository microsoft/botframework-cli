const qnaConverter = require('./qnaConverter')
const deepEqual = require('deep-equal')
const exception = require('../../utils/exception')
const retCode = require('../../utils/enums/CLI-errors').errorCode
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
        resolveMultiTurnReferences(this.qnaList);
        resolveQnAIds(this.qnaList);
    }
}

module.exports = QnAMaker


const resolveMultiTurnReferences = function(qnaList) {
    let qnaPairsWithMultiTurn = qnaList.filter(item => item.context.prompts.length !== 0);
    // find the largetst auto-id
    let largestAutoIdxList = qnaList.filter(item => item.id !== 0 && item.id.toString().startsWith('*auto*'));
    let largestAutoIdx = 0;
    if (largestAutoIdxList.length !== 0) {
        let idx = largestAutoIdxList.reduce(function(max, obj) {
            return parseInt(obj.id.replace('*auto*', '')) > parseInt(max.id.replace('*auto*', '')) ? obj : max;
        });
        largestAutoIdx = parseInt(idx.id.replace('*auto*', '')) + 1;
    }

    (qnaPairsWithMultiTurn || []).forEach(item => {
        // find matching QnA id for each follow up prompt
        (item.context.prompts || []).forEach(prompt => {
            // find by ID first
            let qnaId = qnaList.find(x => x.id === prompt.qnaId || x.id === parseInt(prompt.qnaId));
            if (!qnaId) {
                // find by question match
                qnaId = qnaList.find(x => x.questions.includes(prompt.qnaId) || x.questions.includes(prompt.qnaId.replace(/-/g, ' ').trim()))
            }
            if (qnaId === undefined) {
                throw (new exception(retCode.INVALID_INPUT, `[ERROR]: Cannot find follow up prompt definition for '- [${prompt.displayText}](#?${prompt.qnaId}).`));
            } else {
                if (qnaId.id === 0) {
                    qnaId.id = `*auto*${largestAutoIdx++}`;
                }
                prompt.qnaId = qnaId.id;
                prompt.qna = null;
                qnaId.context.isContextOnly = !qnaId.context.isContextOnly ? prompt.contextOnly : true;
                delete prompt.contextOnly;
            }
        })
    })
}

const resolveQnAIds = function(qnaList) {
    let qnaIdsAssigned = [];
    let baseQnaId = 1;
    // find all explicitly assigned IDs
    let qnasWithId = qnaList.filter(pair => (pair.id !== 0) && (!pair.id.toString().startsWith('*auto*')));
    qnasWithId.forEach(qna => {
        let qnaId = 0;
        // this is the only enforcement for IDs being numbers.
        if (isNaN(qna.id)) throw (new exception(retCode.INVALID_INPUT, `[Error]: Explicitly assigned QnA Ids must be numbers. '${qna.id}' is not a number.`));
        qnaId = parseInt(qna.id);
        if(!qnaIdsAssigned.includes(qnaId)) qnaIdsAssigned.push(qnaId)
    });
    
    // finalize IDs for everything that was auto id'd
    let qnasWithAutoId = qnaList.filter(pair => (pair.id !== 0) && isNaN(pair.id) && (pair.id.toString().startsWith('*auto*')));
    qnasWithAutoId.forEach(qna => {
        // get a new ID
        let newIdToAssign = getNewId(qnaIdsAssigned, baseQnaId++);
        // find all child references to this id and update.
        qnaList.forEach(pair => {
            if (pair.context.prompts.length === 0) return;
            pair.context.prompts.forEach(prompt => {
                if (prompt.qnaId === qna.id) {
                    prompt.qnaId = newIdToAssign;
                }
            })
        });
        qna.id = newIdToAssign;
    })

    // finalize IDs for everyone else.
    let qnasWithoutId = qnaList.filter(pair => pair.id === 0);
    qnasWithoutId.forEach(qna => {
        if (qnasWithId.length !== 0 || qnasWithAutoId.length !== 0) {
            qna.id = getNewId(qnaIdsAssigned, baseQnaId++);
        } else {
            // remove context for back compat.
            delete qna.context;
        }
    })
}

const getNewId = function(currentList, curId) {
    while (currentList.includes(curId)) curId++;
    currentList.push(curId)
    return curId;
}

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

