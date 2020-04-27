class QnAOptions {
    constructor(id = '', includeInCollate = true, language = '', path = ''){
        this.id = id ? id : get_guid()
        this.includeInCollate = includeInCollate
        this.language = language
        this.path = path
    }
}

module.exports = QnAOptions

/**
 * Helper function to create a random guid
  * @returns {string} GUID
 */
const get_guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}