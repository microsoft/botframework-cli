const Luis = require('./../luis/luis')
const parseFileContents = require('./../lufile/parseFileContents').parseFile

class Lu {
    constructor(content, id, includeInCollate = true, language = '', path = ''){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
        this.language = language
        this.path = path

        if (this.language !== '') {
            this.name = id + '.' + this.language + '.lu'
        } else {
            this.name = id + '.lu'
        }
    }

    async parseToLuis(verbose, luis_culture){
        let parsedContent = await parseFileContents(this.content, verbose, luis_culture) 
        return new Luis(parsedContent.LUISJsonStructure)
    }
}

module.exports = Lu
