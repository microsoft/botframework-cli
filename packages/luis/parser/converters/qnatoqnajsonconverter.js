const lu = require('./lumerger')
const deepEqual = require('deep-equal')
const qna = require('./../lufile/classes/qna')
const qnaAlterations = require('./../lufile/classes/qnaAlterations');

module.exports = {
    parseQnaToJson: async function(files, verbose, luis_culture) {
        // Extract all lu files and merge all into and object
        let allParsedContent = await lu.mergeAndResolveReferences(files, verbose, luis_culture)
        // pass only files that need to be collated.
        let finalQnAJSON = await this.collateQnAFiles(allParsedContent.QnAContent.filter(item => item.includeInCollate));
        let finalQnAAlterations = await collateQnAAlterations(allParsedContent.QnAAlterations.filter(item => item.includeInCollate));
        return {
            finalQnAJSON,
            finalQnAAlterations
        }
    },
    /**
     * Handle collating all QnA sections across all parsed files into one QnA collection
     *
     * @param {qna []} parsedQnAList Array of parsed QnA blobs
     * @returns {qna} Collated qna object
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    collateQnAFiles: async function (parsedQnAList) {
        let FinalQnAJSON = new qna();
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
        return FinalQnAJSON;
    }
}

/**
 * Collate QnA maker alterations sections across parsed files into one collection
 * @param {qnaAlterations []} allParsedQnAAlterations Contents of all parsed file blobs
 * @returns {qnaAlterations} Collated QnA maker alterations json contents
 * @throws {exception} Throws on errors. exception object includes errCode and text. 
 */
const collateQnAAlterations = async function (allParsedQnAAlterations) {
    let finalQnAAlterationsList = new qnaAlterations.qnaAlterations();
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