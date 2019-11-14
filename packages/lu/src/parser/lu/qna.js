const QnAMaker = require('./../qna/qnamaker/qnamaker')
const Alterations = require('./../qna/alterations/alterations')
const parseFileContents = require('./../lufile/parseFileContents').parseFile

class Qna {
    constructor(content, id, includeInCollate = true, language = ''){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.language = language
    }

    async parseToQna(verbose, luis_culture){
        let parsedContent = await parseFileContents(this.content, verbose, luis_culture)
        return new QnAMaker(parsedContent.qnaJsonStructure)
    }

    async parseToQnaAlterations(verbose, luis_culture){
        let parsedContent = await parseFileContents(this.content, verbose, luis_culture)
        return new Alterations(parsedContent.qnaAlterations)
    }
}

module.exports = Qna
