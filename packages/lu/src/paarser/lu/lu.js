const mergeLuFiles = require('./luMerger').Build
const Luis = require('./../luis/luis')
const QnA = require('./../qna/qna')
const Alterations = require('./../qna/alterations')
const parseFileContents = require('./../../parser/lufile/parseFileContents').parseFile

class Lu {
    constructor(content, id, includeInCollate = true, luis = null, qna = null, alterations = null){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.luis = luis
        this.qna = qna
        this.alterations = alterations
    }

    static async build(luArray){
        let mergedContent = await mergeLuFiles(luArray)
        let luisContent = mergedContent.LUISContent.filter(item => item.includeInCollate)
        let qnaContent = mergedContent.QnAContent.filter(item => item.includeInCollate)
        let qnaAlterationsContent = mergedContent.QnAAlterations.filter(item => item.includeInCollate)
        let luisResult = Luis.build(luisContent)
        let qnaResult = QnA.build(qnaContent)
        let qnaAlterationsResult = Alterations.build(qnaAlterationsContent)
        let luContent = '' + luisResult.parseToLu()
        luContent += qnaResult.parseToLu()
        luContent += qnaAlterationsResult.parseToLu()
        let result = new Lu(luContent, '', true, luisResult, qnaResult, qnaAlterationsResult)
        return result

 }

    async parseToLuis(){
        if (!this.luis) {
            await updateParsedObjects(this)
        }
        return this.luis   
    }

    async parseToQna(){
        if (!this.qna) {
            await updateParsedObjects()
        }
        return this.qna   
    }

    async parseToQnaAlterations(){
        if (!this.alterations) {
            await updateParsedObjects()
        }
        return this.alterations   
    }
}

module.exports = Lu

const updateParsedObjects = async function(lu){
    let parsedContent = await parseFileContents(lu.content)
    lu.luis = new Luis(parsedContent.LUISJsonStructure)
    lu.qna = new QnA(parsedContent.qnaJsonStructure)
    lu.alterations = new Alterations(parsedContent.qnaAlterations)
}