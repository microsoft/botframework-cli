"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const fs_1 = require("fs");
const path_1 = require("path");
var Utils;
(function (Utils) {
    function validatePath(outputPath, workingDirectory, defaultFileName, forceWrite = false) {
        let completePath = path_1.isAbsolute(outputPath) ? outputPath : path_1.join(workingDirectory, outputPath);
        const containingDir = path_1.dirname(completePath);
        // If the cointaining folder doesnt exist
        if (!fs_1.existsSync(containingDir))
            throw new bf_cli_command_1.CLIError(`Containing directory path doesn't exist: ${containingDir}`);
        const baseElement = path_1.basename(completePath);
        const pathAlreadyExist = fs_1.existsSync(completePath);
        // If the last element in the path is a file
        if (baseElement.includes('.')) {
            return pathAlreadyExist && !forceWrite ? enumerateFileName(completePath) : completePath;
        }
        // If the last element in the path is a folder
        if (!pathAlreadyExist)
            throw new bf_cli_command_1.CLIError(`Target directory path doesn't exist: ${completePath}`);
        completePath = path_1.join(completePath, defaultFileName);
        return fs_1.existsSync(completePath) && !forceWrite ? enumerateFileName(completePath) : completePath;
    }
    Utils.validatePath = validatePath;
    function enumerateFileName(filePath) {
        const fileName = path_1.basename(filePath);
        const containingDir = path_1.dirname(filePath);
        if (!fs_1.existsSync(containingDir))
            throw new bf_cli_command_1.CLIError(`Containing directory path doesn't exist: ${containingDir}`);
        const extension = path_1.extname(fileName);
        const baseName = path_1.basename(fileName, extension);
        let nextNumber = 0;
        let newPath = '';
        do {
            newPath = path_1.join(containingDir, baseName + `(${++nextNumber})` + extension);
        } while (fs_1.existsSync(newPath));
        return newPath;
    }
})(Utils = exports.Utils || (exports.Utils = {}));
