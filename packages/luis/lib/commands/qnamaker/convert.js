"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const exception = require('./../../parser/lufile/classes/exception');
const fs = require('fs-extra');
const file = require('./../../utils/filehelper');
const luConverter = require('./../../parser/converters/qnatoqnajsonconverter');
const qnaConverter = require('./../../parser/converters/qnajsontoqnaconverter');
const fileExtEnum = require('./../../parser/lufile/helpers').FileExtTypeEnum;
class QnamakerConvert extends bf_cli_command_1.Command {
    async run() {
        try {
            const { flags } = this.parse(QnamakerConvert);
            // Check if data piped in stdin
            let stdin = await this.readStdin();
            //Check if file or folder
            //if folder, only lu to luis is supported
            let isQnA = await file.detectLuContent(stdin, flags.in);
            // Parse the object depending on the input
            let result;
            if (isQnA) {
                let luFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.QnAFile);
                // for back-compat, also include QnA content in .lu files.
                let legLUFiles = await file.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.LUFile);
                for (let legFileidx of legLUFiles) {
                    luFiles.push(legLUFiles[legFileidx]);
                }
                result = await luConverter.parseQnaToJson(luFiles, false, flags.luis_culture);
            }
            else {
                const qnAFile = stdin ? stdin : await file.getContentFromFile(flags.in);
                result = await qnaConverter.parseQnAObjectToLu(qnAFile, flags.sort, flags.alterations);
            }
            // If result is null or undefined return
            if (!result) {
                throw new bf_cli_command_1.CLIError('No LU or QnA content parsed!');
            }
            // Add headers to QnAJson
            if (isQnA) {
                result.finalQnAJSON.name = flags.name || result.name || '';
            }
            // Print or write the parsed object
            if (flags.out) {
                await this.writeOutput(result, flags, isQnA);
            }
            else {
                if (isQnA) {
                    this.log(JSON.stringify(result.finalQnAJSON, null, 2));
                    this.log(JSON.stringify(result.finalQnAAlterations, null, 2));
                }
                else {
                    this.log(result);
                }
            }
        }
        catch (err) {
            if (err instanceof exception) {
                throw new bf_cli_command_1.CLIError(err.text);
            }
            throw err;
        }
    }
    async writeOutput(convertedObject, flags, isQnA) {
        let filePath = await file.generateNewFilePath(flags.out, flags.in, isQnA);
        try {
            if (isQnA) {
                await fs.writeFile(filePath, JSON.stringify(convertedObject.finalQnAJSON, null, 2), 'utf-8');
                if (convertedObject.finalQnAAlterations) {
                    let filePathAlterations = await file.generateNewFilePath(flags.out, flags.in, isQnA, 'alterations_');
                    await fs.writeFile(filePathAlterations, JSON.stringify(convertedObject.finalQnAAlterations, null, 2), 'utf-8');
                }
            }
            else {
                await fs.writeFile(filePath, convertedObject, 'utf-8');
            }
        }
        catch (err) {
            throw new bf_cli_command_1.CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message);
        }
        this.log('Successfully wrote QnA model to ' + filePath);
    }
}
exports.default = QnamakerConvert;
QnamakerConvert.description = 'Convert .lu file(s) to a QnA application JSON model or vice versa';
QnamakerConvert.flags = {
    in: bf_cli_command_1.flags.string({ description: 'Source .qna file(s) or QnA KB JSON file', required: true }),
    alterations: bf_cli_command_1.flags.boolean({ description: 'Indicates if files is QnA Alterations' }),
    log: bf_cli_command_1.flags.boolean({ description: 'Enables log messages', default: false }),
    sort: bf_cli_command_1.flags.boolean({ description: 'When set, questions collections are alphabetically sorted are alphabetically sorted in .lu files', default: false }),
    recurse: bf_cli_command_1.flags.boolean({ description: 'Indicates if sub-folders need to be considered to file .qna file(s)' }),
    out: bf_cli_command_1.flags.string({ description: 'Output file or folder name. If not specified stdout will be used as output' }),
    name: bf_cli_command_1.flags.string({ description: 'Name of the QnA KB' }),
};
