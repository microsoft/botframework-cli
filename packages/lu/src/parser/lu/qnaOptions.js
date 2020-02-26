class QnAOptions {
    constructor(id = '', includeInCollate = true, language = ''){
        this.id = id
        this.includeInCollate = includeInCollate
        this.language = language
    }
}

module.exports = QnAOptions