"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const fs = require('fs-extra');
const path = require('path');
const helpers = require('./../parser/lufile/helpers');
const luObject = require('./../parser/lufile/classes/luObject');
/* tslint:disable:prefer-for-of no-unused*/
async function getLuObjects(stdin, input, recurse = false, extType) {
    let luObjects = [];
    if (stdin) {
        luObjects.push(new luObject('stdin', stdin));
    }
    else {
        let luFiles = await getLuFiles(input, recurse, extType);
        for (let i = 0; i < luFiles.length; i++) {
            let luContent = await getContentFromFile(luFiles[i]);
            luObjects.push(new luObject(path.resolve(luFiles[i]), luContent));
        }
    }
    return luObjects;
}
exports.getLuObjects = getLuObjects;
async function getLuFiles(input, recurse = false, extType) {
    let filesToParse = [];
    let fileStat = await fs.stat(input);
    if (fileStat.isFile()) {
        filesToParse.push(input);
        return filesToParse;
    }
    if (!fileStat.isDirectory()) {
        throw new bf_cli_command_1.CLIError('Sorry, ' + input + ' is not a folder or does not exist');
    }
    filesToParse = helpers.findLUFiles(input, recurse, extType);
    if (filesToParse.length === 0) {
        throw new bf_cli_command_1.CLIError(`Sorry, no ${extType} files found in the specified folder.`);
    }
    return filesToParse;
}
async function getContentFromFile(file) {
    // catch if input file is a folder
    if (fs.lstatSync(file).isDirectory()) {
        throw new bf_cli_command_1.CLIError('Sorry, "' + file + '" is a directory! Unable to read as a file');
    }
    if (!fs.existsSync(path.resolve(file))) {
        throw new bf_cli_command_1.CLIError('Sorry [' + file + '] does not exist');
    }
    let fileContent;
    try {
        fileContent = await bf_cli_command_1.utils.readTextFile(file);
    }
    catch (err) {
        throw new bf_cli_command_1.CLIError('Sorry, error reading file: ' + file);
    }
    return fileContent;
}
exports.getContentFromFile = getContentFromFile;
async function generateNewFilePath(outFileName, inputfile, isLu, prefix = '') {
    let base = path.resolve(outFileName);
    let extension = path.extname(base);
    if (extension) {
        let root = path.dirname(base);
        let file = path.basename(base);
        return path.join(root, prefix + file);
    }
    let name = '';
    let inputStat = await fs.stat(inputfile);
    if (inputStat.isFile()) {
        name += path.basename(inputfile, path.extname(inputfile)) + (isLu ? '.json' : '.lu');
    }
    else {
        name += isLu ? 'converted.json' : 'converted.lu';
    }
    return path.join(base, prefix + name);
}
exports.generateNewFilePath = generateNewFilePath;
async function generateNewTranslatedFilePath(fileName, translatedLanguage, output) {
    let newPath = path.resolve(output);
    newPath = path.join(output, translatedLanguage);
    await fs.mkdirp(newPath);
    return path.join(newPath, fileName);
}
exports.generateNewTranslatedFilePath = generateNewTranslatedFilePath;
function validatePath(outputPath, defaultFileName, forceWrite = false) {
    let completePath = path.resolve(outputPath);
    const containingDir = path.dirname(completePath);
    // If the cointaining folder doesnt exist
    if (!fs.existsSync(containingDir))
        throw new bf_cli_command_1.CLIError(`Containing directory path doesn't exist: ${containingDir}`);
    const baseElement = path.basename(completePath);
    const pathAlreadyExist = fs.existsSync(completePath);
    // If the last element in the path is a file
    if (baseElement.includes('.')) {
        return pathAlreadyExist && !forceWrite ? enumerateFileName(completePath) : completePath;
    }
    // If the last element in the path is a folder
    if (!pathAlreadyExist)
        throw new bf_cli_command_1.CLIError(`Target directory path doesn't exist: ${completePath}`);
    completePath = path.join(completePath, defaultFileName);
    return fs.existsSync(completePath) && !forceWrite ? enumerateFileName(completePath) : completePath;
}
exports.validatePath = validatePath;
function enumerateFileName(filePath) {
    const fileName = path.basename(filePath);
    const containingDir = path.dirname(filePath);
    if (!fs.existsSync(containingDir))
        throw new bf_cli_command_1.CLIError(`Containing directory path doesn't exist: ${containingDir}`);
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    let nextNumber = 0;
    let newPath = '';
    do {
        newPath = path.join(containingDir, baseName + `(${++nextNumber})` + extension);
    } while (fs.existsSync(newPath));
    return newPath;
}
async function detectLuContent(stdin, input) {
    if (!stdin && !input) {
        throw new bf_cli_command_1.CLIError('Missing input. Please use stdin or pass a file location with --in flag');
    }
    if (!stdin) {
        if (!fs.existsSync(path.resolve(input))) {
            throw new bf_cli_command_1.CLIError(`Sorry unable to open [${input}]`);
        }
        let inputStat = await fs.stat(input);
        return !inputStat.isFile() ? true : (path.extname(input) === '.lu' || path.extname(input) === '.qna');
    }
    try {
        await JSON.parse(stdin);
    }
    catch (error) {
        return true;
    }
    return false;
}
exports.detectLuContent = detectLuContent;
