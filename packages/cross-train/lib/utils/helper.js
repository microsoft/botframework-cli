"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const fs = require('fs-extra');
const path = require('path');
const dialogExt = '.dialog';
const luExt = '.lu';
async function generateConfig(inputFolder, rootDialogFile) {
    let dialogFiles = [];
    await getDialogFiles(inputFolder, dialogFiles);
    let rootDialogObject = JSON.parse(await getInputFromFile(rootDialogFile));
    rootDialogObject.path = rootDialogFile;
    rootDialogObject.isRoot = true;
    let dialogObjects = [];
    for (const dialogFile of dialogFiles) {
        let dialogObject = JSON.parse(await getInputFromFile(dialogFile));
        dialogObject.path = dialogFile;
        dialogObjects.push(dialogObject);
    }
    const configObject = createConfig(rootDialogObject, dialogObjects, inputFolder);
    return JSON.stringify(configObject);
}
exports.generateConfig = generateConfig;
async function getDialogFiles(inputFolder, results) {
    fs.readdirSync(inputFolder).forEach(async (dirContent) => {
        dirContent = path.resolve(inputFolder, dirContent);
        if (fs.statSync(dirContent).isDirectory()) {
            await getDialogFiles(dirContent, results);
        }
        if (fs.statSync(dirContent).isFile()) {
            if (dirContent.endsWith(dialogExt)) {
                results.push(dirContent);
            }
        }
    });
}
async function getInputFromFile(path) {
    if (path) {
        try {
            return await bf_cli_command_1.utils.readTextFile(path);
        }
        catch (error) {
            throw new bf_cli_command_1.CLIError(`Failed to read file: ${error}`);
        }
    }
    return '';
}
function createConfig(rootDialog, dialogs, configPath) {
    let result = {};
    const key = createPath(rootDialog.path, configPath);
    const rootLuPath = rootDialog.path.replace(dialogExt, luExt);
    if (!fs.existsSync(rootLuPath)) {
        throw new bf_cli_command_1.CLIError(`Failed to parse mapping rules config from file system: ${rootLuPath} does not exist. Please provide config file by --config`);
    }
    rootDialog.triggers.forEach((trigger) => {
        if (trigger.$type && trigger.$type === 'Microsoft.OnIntent') {
            const actions = trigger.actions || [];
            for (const action of actions) {
                if (action.$type && action.$type === 'Microsoft.BeginDialog') {
                    const dialogName = action.dialog;
                    const target = dialogs.find(dialog => path.basename(dialog.path, dialogExt) === dialogName);
                    if (target) {
                        const relativePath = createPath(target.path, configPath);
                        if (!result[key])
                            result[key] = { triggers: {} };
                        if (!result[key].triggers[trigger.intent]) {
                            result[key].triggers[trigger.intent] = relativePath;
                        }
                        else if (typeof result[key].triggers[trigger.intent] === 'string') {
                            result[key].triggers[trigger.intent] = [result[key].triggers[trigger.intent], relativePath];
                        }
                        else {
                            result[key].triggers[trigger.intent].push(relativePath);
                        }
                        result = Object.assign(Object.assign({}, result), createConfig(target, dialogs, configPath));
                    }
                }
            }
        }
    });
    if (rootDialog.isRoot && result[key])
        result[key].rootDialog = true;
    return result;
}
function createPath(dialogPath, configPath) {
    const luFilePath = dialogPath.replace('.dialog', '.lu');
    const relativePath = path.relative(configPath, luFilePath);
    return relativePath;
}
