class LuOptions {
    constructor(id = '', includeInCollate = true, language = '', path = ''){
        this.id = id
        this.includeInCollate = includeInCollate
        this.language = language
        this.path = path
    }
}

module.exports = LuOptions