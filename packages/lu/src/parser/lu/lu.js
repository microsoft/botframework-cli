const mergeLuFiles = require('./luMerger').Build
const Luis = require('./../luis/luis')
const QnA = require('./../qna/qna')
const Alterations = require('./../qna/alterations')
const parseFileContents = require('./../lufile/parseFileContents').parseFile

class Lu {
    constructor(content, id, includeInCollate = true, luis = null, qna = null, alterations = null){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.luis = luis
        this.qna = qna
        this.alterations = alterations
    }

    static async build(luArray, verbose, luis_culture, luSearchFn){
        let mergedContent = await mergeLuFiles(luArray, verbose, luis_culture, luSearchFn)
        let luisContent = mergedContent.LUISContent.filter(item => item.includeInCollate)
        let qnaContent = mergedContent.QnAContent.filter(item => item.includeInCollate)
        let qnaAlterationsContent = mergedContent.QnAAlterations.filter(item => item.includeInCollate)
        let luisResult = Luis.build(luisContent)
        let qnaResult = QnA.build(qnaContent)
        let qnaAlterationsResult = Alterations.build(qnaAlterationsContent)
        let luContent = '' + luisResult.parseToLuContent()
        luContent += qnaResult.parseToLuContent()
        luContent += qnaAlterationsResult.parseToLuContent()
        let result = new Lu(luContent, '', true, luisResult, qnaResult, qnaAlterationsResult)
        return result

 }

    async parseToLuis(verbose, luis_culture){
        if (!this.luis) {
            await updateParsedObjects(this, verbose, luis_culture)
        }
        return this.luis   
    }

    async parseToQna(verbose, luis_culture){
        if (!this.qna) {
            await updateParsedObjects(this, verbose, luis_culture)
        }
        return this.qna   
    }

    async parseToQnaAlterations(verbose, luis_culture){
        if (!this.alterations) {
            await updateParsedObjects(this, verbose, luis_culture)
        }
        return this.alterations   
    }
}

module.exports = Lu

const updateParsedObjects = async function(lu, verbose, luis_culture){
    let parsedContent = await parseFileContents(lu.content, verbose, luis_culture)
    lu.luis = new Luis(parsedContent.LUISJsonStructure)
    lu.qna = new QnA(parsedContent.qnaJsonStructure)
    lu.alterations = new Alterations(parsedContent.qnaAlterations)
}