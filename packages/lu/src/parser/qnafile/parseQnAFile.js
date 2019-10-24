const exception = require('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')

module.exports = {
    parseQnAJSONFile: async function(QnAFileContent){
        let QnAJSON
        try {
            QnAJSON = JSON.parse(QnAFileContent);
        } catch (err) {
            throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, error parsing QnA JSON content'))
        }
        return QnAJSON;
    }
}

