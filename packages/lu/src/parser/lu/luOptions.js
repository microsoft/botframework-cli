const getLuisCultureFromPath = require('../../utils/localehelper').getLuisCultureFromPath

class LuOptions {
    constructor(id = '', includeInCollate = true, language = '', path = ''){
        let fileLocale
        if (id) {
            fileLocale = getLuisCultureFromPath(`${id}.lu`)
        }

        this.id = id ? id : get_guid()
        this.includeInCollate = includeInCollate
        this.language = language ? language : fileLocale ? fileLocale : ''
        this.path = path
    }
}

module.exports = LuOptions

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