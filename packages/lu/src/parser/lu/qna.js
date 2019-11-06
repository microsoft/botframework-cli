const QnAMaker = require('./../qna/qnamaker/qnamaker')
const Alterations = require('./../qna/alterations/alterations')
const parseFileContents = require('./../lufile/parseFileContents').parseFile

class Qna {
    constructor(content, id, includeInCollate = true, qna = null, alterations = null){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.qna = qna
        this.alterations = alterations
    }

    async parseToQna(verbose, luis_culture){
        let parsedContent = await parseFileContents(this.content, verbose, luis_culture)
        this.qna = new QnAMaker(parsedContent.qnaJsonStructure)
        return this.qna
    }

    async parseToQnaAlterations(verbose, luis_culture){
        let parsedContent = await parseFileContents(this.content, verbose, luis_culture)
        this.alterations = new Alterations(parsedContent.qnaAlterations)
        return this.alterations   
    }
}

module.exports = Qna
