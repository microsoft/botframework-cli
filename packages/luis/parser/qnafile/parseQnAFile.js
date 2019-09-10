const fs = require('fs-extra')
const path = require('path')
const txtfile = require('./../lufile/read-text-file')
const exception = ('./../lufile/classes/exception')
const retCode = require('./../lufile/enums/CLI-errors')

module.exports = {
    parseQnAJSONFile: async function(file){
        let QnAFileContent, QnAJSON;
        try {
            QnAFileContent = await openFileAndReadContent(file);
        } catch (err) {
            throw(err);
        }
        try {
            QnAJSON = JSON.parse(QnAFileContent);
        } catch (err) {
            throw (new exception(retCode.errorCode.INVALID_INPUT_FILE, 'Sorry, error parsing file as QnA JSON: ' + file));
        }
        return QnAJSON;
    }
}

const openFileAndReadContent = async function(file) {
    // catch if input file is a folder
    if(fs.lstatSync(file).isDirectory()) {
        throw (new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, "' + file + '" is a directory! Please try a LUIS/ QnA Maker JSON file as input.'));
    }
    if(!fs.existsSync(path.resolve(file))) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry unable to open [' + file + ']'));
    }
    let fileContent = txtfile.readSync(file);
    if (!fileContent) {
        throw(new exception(retCode.errorCode.FILE_OPEN_ERROR, 'Sorry, error reading file: ' + file));
    }
    return fileContent;
}
