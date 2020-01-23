const mergeLuFiles = require('./../../lu/luMerger').Build
const QnAMaker = require('./qnamaker')

class QnABuilder{
    /**
     * Builds a QnAMaker instance from a Qna list.
     * @param {Array<Qna>} qnaObjArray Array of QnA files to be merge
     * @param {boolean} verbose indicates if we need verbose logging.
     * @param {string} luis_culture LUIS locale code
     * @param {function} luSearchFn function to retrieve the lu files found in the references
     * @returns {QnAMaker} new QnAMaker instance
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    static async build(qnaObjArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(qnaObjArray, verbose, luis_culture, luSearchFn)
        let parsedQnAList = mergedContent.QnAContent.filter(item => item.includeInCollate)


        let result = new QnAMaker();
        let qnaList = []
        parsedQnAList.forEach(index =>{
            qnaList.push(index.qnaJsonStructure)
        })
        result.collate(qnaList)
        result.resolveMultiTurnReferences()
        return result
    }
}

module.exports = QnABuilder