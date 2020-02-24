/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const mergeLuFiles = require('./../../lu/luMerger').Build
const Alterations = require('./../alterations/alterations')
const QnAMaker = require('./qnamaker')
const KB = require('./kb')
const deepEqual = require('deep-equal')
const exception = require('../../utils/exception')
const retCode = require('../../utils/enums/CLI-errors').errorCode
const parseFileContents = require('./../../lufile/parseFileContents').parseFile

class QnABuilder{
    /**
     * Builds a Luis instance from a Lu list.
     * @param {JSON} qnamakerJson QnAMaker json
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnaMakerJson(qnamakerJson) {
        return new QnAMaker(new KB(qnamakerJson))
    }

    /**
     * Builds a QnAMaker instance from a QnAMaker list.
     * @param {Qna} qnaObject QnA instance
     * @returns {Luis} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnA(qnaObject) {
        let parsedContent = await parseFileContents(qnaObject.content, false)
        return new QnAMaker(new KB(parsedContent.qnaJsonStructure), new Alterations(parsedContent.qnaAlterations))
    }

    /**
     * Builds a Luis instance from a Lu list.
     * @param {Array<QnA>} qnaObjArray Array of LU files to be merge
     * @param {function} qnaSearchFn function to retrieve the qna files found in the references
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async buildFromQnAList(qnaObjArray, qnaSearchFn) {
        return this.build(qnaObjArray, false, qnaSearchFn)
    }

    /**
     * Builds a QnAMaker instance from a Qna list.
     * @param {Array<Qna>} qnaObjArray Array of QnA files to be merge
     * @param {boolean} verbose indicates if we need verbose logging.
     * @param {function} qnaSearchFn function to retrieve the lu files found in the references
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(qnaObjArray, verbose, qnaSearchFn) {
        let mergedContent = await mergeLuFiles(qnaObjArray, verbose, '', qnaSearchFn)
        let parsedQnAList = mergedContent.QnAContent.filter(item => item.includeInCollate)

        let qnaList = []
        parsedQnAList.forEach(index =>{
            qnaList.push(index.qnaJsonStructure)
        })
        let kbResult = collate(qnaList)

        let allParsedQnAAlterations = mergedContent.QnAAlterations.filter(item => item.includeInCollate)
        let finalQnAAlterationsList = new Alterations()
        allParsedQnAAlterations.forEach(function (alterationList) {
            alterationList = alterationList.qnaAlterations;
            if (alterationList.wordAlterations) {
                alterationList.wordAlterations.forEach(function (alteration) {
                    finalQnAAlterationsList.wordAlterations.push(alteration);
                })
            }
        })
        return new QnAMaker(kbResult, finalQnAAlterationsList)
    }
}

module.exports = QnABuilder

const collate = function(qnaList) {
    let result = new KB()
    for (let i = 0; i < qnaList.length; i++) {
        let blob = qnaList[i]
        // does this blob have URLs?
        collateUrls(result, blob)
        // does this blob have files?
        collateFiles(result, blob)
        // does this blob have qnapairs?
        collateQnAPairs(result, blob)

        result.name = blob.name ? blob.name : result.name

    };    
    resolveMultiTurnReferences(result.qnaList)
    resolveQnAIds(result.qnaList)
    return result
}

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
