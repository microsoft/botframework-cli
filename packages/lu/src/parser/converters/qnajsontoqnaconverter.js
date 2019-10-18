const NEWLINE = require('os').EOL;
const fs = require('fs-extra')
const path = require('path')
const txtfile = require('./../lufile/read-text-file')
const qnaFile = require('./../qnafile/parseQnAFile')
const helperClasses = require('./../lufile/classes/hclasses')
const exception = require('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')

module.exports = {
    parseQnAFileToLu: async function(file, sort, isAlterations) {
        let QnAFileContent = await openFileAndReadContent(file)
        return await this.parseQnAObjectToLu(QnAFileContent, sort, isAlterations, file)
    },
    parseQnAObjectToLu: async function(qnaObjectString, sort, isAlterations, src = '') {
        let QnAJSON  = await parseQnA(qnaObjectString, src, sort, isAlterations)

        if (!isAlterations) {
            return await this.constructMdFromQnAJSON(QnAJSON.model)
        } else {
            return await this.constructMdFromQnAAlterationJSON(QnAJSON.model)
        }
    },
    /**
     * Construct lu file content from QnA Alteration JSON object
     * @param {object} QnAAltJSON QnA Alteration JSON object
     * @returns {String} Generated lu content 
     */
    constructMdFromQnAAlterationJSON: function(QnAAltJSON) {
        let fileContent = '> # QnA Alterations' + NEWLINE + NEWLINE;
        if(QnAAltJSON.wordAlterations && QnAAltJSON.wordAlterations.length > 0) {
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
    constructMdFromQnAJSON: function(QnAJSON) {
        let fileContent = '> # QnA pairs' + NEWLINE + NEWLINE;
        let root = null;
        if(QnAJSON.qnaDocuments) {
            root = QnAJSON.qnaDocuments;
        } else {
            root = QnAJSON.qnaList;
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
        return fileContent;
    }
}

const parseQnA= async function(qnaObject, src, sort, isAlterations){
    let QnAJSON = new helperClasses.readerObject()
    QnAJSON.model = await qnaFile.parseQnAJSONFile(qnaObject)
    QnAJSON.sourceFile = src

    if (!QnAJSON.model) {
        throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'No input QnA content found '));
    }

    if (sort) {
        const sortingFunction = isAlterations ? sortQnAAltJSON : sortQnAJSON
        sortingFunction(QnAJSON.model)
    }

    return QnAJSON
}


/**
 * Helper function to return sorted QnA JSON model
 * @param {Object} QnAJSON 
 */
const sortQnAJSON = function(QnAJSON) {
    try {
        (QnAJSON.qnaList || []).forEach(pair => {
            pair.questions.sort(sortComparers.compareFn);
        });
        QnAJSON.qnaList.sort(sortComparers.compareQn);
    } catch (e) {
        throw (new exception(retCode.errorCode.INVALID_INPUT, 'Sorry, invalid QnA Maker json object'));
    }
};

/**
 * Helper function to return sorted QnA Alterations pair
 * @param {Object} QnAAltJSON 
 */
const sortQnAAltJSON = function(QnAAltJSON) {
    try {
        (QnAAltJSON.wordAlterations || []).forEach(word => {
            word.alterations.sort(sortComparers.compareFn);
        });
        QnAAltJSON.wordAlterations.sort(sortComparers.compareAltName);
    } catch (e) {
        throw (new exception(retCode.errorCode.INVALID_INPUT, 'Sorry, invalid QnA Maker json object'));
    }
}; 

/**
 * Helper set of comparer functions that help with sort by examining a specific comparison logic.
 */
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

const openFileAndReadContent = async function(file) {
    // catch if input file is a folder
    if(fs.lstatSync(file).isDirectory()) {
        throw (new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, "' + file + '" is a directory! Please try a QnA Maker JSON file as input.'));
    }
    if(!fs.existsSync(path.resolve(file))) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry unable to open [' + file + ']'));
    }
    let fileContent = txtfile.readSync(file);
    if (!fileContent) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, error reading file: ' + file));
    }
    return fileContent;
}