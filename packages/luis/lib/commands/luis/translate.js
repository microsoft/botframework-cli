"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const fs = require('fs-extra');
const path = require('path');
const fileHelper = require('./../../utils/filehelper');
const exception = require('./../../parser/lufile/classes/exception');
const luTranslator = require('./../../parser/translator/lutranslate');
const luisConverter = require('./../../parser/converters/luistoluconverter');
const luConverter = require('./../../parser/lufile/parseFileContents');
const fileExtEnum = require('./../../parser/lufile/helpers').FileExtTypeEnum;
class LuisTranslate extends bf_cli_command_1.Command {
    /* tslint:disable:forin no-for-in*/
    async run() {
        try {
            const { flags } = this.parse(LuisTranslate);
            // Check if data piped in stdin
            let stdin = await this.readStdin();
            let outputStat = flags.out ? await fs.stat(flags.out) : null;
            if (outputStat && outputStat.isFile()) {
                throw new bf_cli_command_1.CLIError('Output can only be writen to a folder');
            }
            let isLu = await fileHelper.detectLuContent(stdin, flags.in);
            let result;
            if (isLu) {
                let luFiles = await fileHelper.getLuObjects(stdin, flags.in, flags.recurse, fileExtEnum.LUFile);
                result = await luTranslator.translateLuList(luFiles, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text);
            }
            else {
                let json = stdin ? stdin : await fileHelper.getContentFromFile(flags.in);
                let translation = await luisConverter.parseLuisObjectToLu(json, false);
                translation = await luTranslator.translateLuObj(translation, flags.translatekey, flags.tgtlang, flags.srclang, flags.translate_comments, flags.translate_link_text);
                let key = stdin ? 'stdin' : path.basename(flags.in);
                result = {
                    [key]: {}
                };
                for (let lng in translation) {
                    let translatedJSON = await luConverter.parseFile(translation[lng], false);
                    result[key][lng] = await translatedJSON.LUISJsonStructure;
                }
            }
            if (flags.out) {
                await this.writeOutput(result, flags.out, isLu);
            }
            else {
                if (isLu) {
                    this.log(result);
                }
                else {
                    this.log(JSON.stringify(result, null, 2));
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
    async writeOutput(translatedObject, out, isLu) {
        let filePath = '';
        try {
            for (let file in translatedObject) {
                for (let lng in translatedObject[file]) {
                    filePath = await fileHelper.generateNewTranslatedFilePath(file, lng, out);
                    let content = isLu ? translatedObject[file][lng] : JSON.stringify(translatedObject[file][lng], null, 2);
                    await fs.writeFile(filePath, content, 'utf-8');
                }
            }
        }
        catch (err) {
            throw new bf_cli_command_1.CLIError('Unable to write file - ' + filePath + ' Error: ' + err.message);
        }
    }
}
exports.default = LuisTranslate;
LuisTranslate.description = ' Translate given LUIS application JSON model or lu file(s)';
LuisTranslate.flags = {
    in: bf_cli_command_1.flags.string({ description: 'Source .lu file(s) or LUIS application JSON model', required: true }),
    recurse: bf_cli_command_1.flags.boolean({ description: 'Indicates if sub-folders need to be considered to file .lu file(s)' }),
    out: bf_cli_command_1.flags.string({ description: 'Output folder name. If not specified stdout will be used as output' }),
    srclang: bf_cli_command_1.flags.string({ description: 'Source lang code. Auto detect if missing.' }),
    tgtlang: bf_cli_command_1.flags.string({ description: 'Comma separated list of target languages.', required: true }),
    translatekey: bf_cli_command_1.flags.string({ description: 'Machine translation endpoint key.', required: true }),
    translate_comments: bf_cli_command_1.flags.string({ description: 'When set, machine translate comments found in .lu or .qna file' }),
    translate_link_text: bf_cli_command_1.flags.string({ description: 'When set, machine translate link description in .lu or .qna file' }),
};
