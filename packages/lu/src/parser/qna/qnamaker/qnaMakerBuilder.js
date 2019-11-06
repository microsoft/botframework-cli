const mergeLuFiles = require('./../../lu/luMerger').Build
const QnAMaker = require('./qnamaker')

class QnABuilder{

    static async build(luArray, verbose, luis_culture, luSearchFn) {
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let parsedQnAList = mergedContent.QnAContent.filter(item => item.includeInCollate)


        let result = new QnAMaker();
        let qnaList = []
        parsedQnAList.forEach(index =>{
            qnaList.push(index.qnaJsonStructure)
        })
        result.collate(qnaList)
        return result
    }
}

module.exports = QnABuilder