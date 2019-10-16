
class LuObject{
    constructor(id, content, includeInCollate = true){
        this.id = id
        this.content = content
        this.includeInCollate = includeInCollate
    }
}

module.exports = LuObject;