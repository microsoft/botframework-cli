const Luis = require('./../luis/luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile

class Lu {
    constructor(content, id, includeInCollate = true, luis = null){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.luis = luis
    }

    async parseToLuis(verbose, luis_culture){
            let parsedContent = await parseFileContents(this.content, verbose, luis_culture)
            this.luis = new Luis(parsedContent.LUISJsonStructure)
            return this.luis   
    }
}

module.exports = Lu
