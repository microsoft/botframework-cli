/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from 'child_process';
import { Utils } from './utils';

export class LuisCommand {

    public luisSubCommand: string;
    public luisApplicationName: string;
    public luisEndpoint: string;
    public luisSubscriptionKey: string;
    public luisCulture: string;
    public luisVersionId: string;
    public luisAppDescription: string;
    public luisInputFile: string;
    public luisBotName: string;
    public luisAppId: string;
    public luisPublishStaging: boolean;
    public luisConvertInput: string;
    public luisConvertOutput: string;
    public luisGenerateInput: string;
    public luisGenerateOutput: string;
    public className: string;
    public programmingLanguage: string;
    public luisTranslateInput: string;
    public luisTranslateOutputFolder: string;
    public translateKey: string;
    public sourceLang: string;
    public targetLang: string;
    public targetVersionId: string;
    public luisOutputFile: string;
    public luisImportFile: string;
    public newVersionId: string;

    private utils = new Utils();

    constructor() {
        this.luisSubCommand = taskLibrary.getInput('luisSubCommand', false) as string;
        this.luisApplicationName = taskLibrary.getInput('luisApplicationName', false) as string;
        this.luisEndpoint = taskLibrary.getInput('luisEndpoint', false) as string;
        this.luisSubscriptionKey = taskLibrary.getInput('luisSubscriptionKey', false) as string;
        this.luisCulture = taskLibrary.getInput('luisCulture', false) as string;
        this.luisVersionId = taskLibrary.getInput('luisVersionId', false) as string;
        this.luisAppDescription = taskLibrary.getInput('luisAppDescription', false) as string;
        this.luisInputFile = this.utils.validatePath('luisInputFile');
        this.luisBotName = taskLibrary.getInput('luisBotName', false) as string;
        this.luisAppId = taskLibrary.getInput('luisAppId', false) as string;
        this.luisPublishStaging = taskLibrary.getBoolInput('luisPublishStaging', false);
        this.luisConvertInput = taskLibrary.getInput('luisConvertInput', false) as string;
        this.luisConvertOutput = taskLibrary.getInput('luisConvertOutput', false) as string;
        this.luisGenerateInput = taskLibrary.getInput('luisGenerateInput', false) as string;
        this.luisGenerateOutput = taskLibrary.getInput('luisGenerateOutput', false) as string;
        this.className = taskLibrary.getInput('className', false) as string;
        this.programmingLanguage = taskLibrary.getInput('programmingLanguage', false) as string;
        this.luisTranslateInput = taskLibrary.getInput('luisTranslateInput', false) as string;
        this.luisTranslateOutputFolder = taskLibrary.getInput('luisTranslateOutputFolder', false) as string;
        this.translateKey = taskLibrary.getInput('translateKey', false) as string;
        this.sourceLang = taskLibrary.getInput('sourceLang', false) as string;
        this.targetLang = taskLibrary.getInput('targetLang', false) as string;
        this.targetVersionId = taskLibrary.getInput('targetVersionId', false) as string;
        this.luisOutputFile = taskLibrary.getInput('luisOutputFile', false) as string;
        this.luisImportFile = taskLibrary.getInput('luisImportFile', false) as string;
        this.newVersionId = taskLibrary.getInput('newVersionId', false) as string;
    }

    public executeSubCommand = (): void => {
        switch (this.luisSubCommand) {
            case 'ApplicationCreate':
                this.createLuisApplication();
                break;
            case 'LuisBuild':
                this.buildLuisApplication();
                break;
            case 'LuisTrainRun':
                this.trainLuisApplication();
                break;
            case 'LuisPublish':
                this.publishLuisApplication();
                break;
            case 'LuisApplicationDelete':
                this.deleteLuisApplication();
                break;
            case 'LuisApplicationImport':
                this.importLuisApplication();
                break;
            case 'LuisApplicationRename':
                this.renameLuisApplication();
                break;
            case 'LuisConvert':
                this.convertLuisModel();
                break;
            case 'LuisGenerate':
                this.generateSourceCode();
                break;
            case 'LuisTranslate':
                this.translateLuisModel();
                break;
            case 'LuisVersionClone':
                this.versionClone();
                break;
            case 'LuisVersionExport':
                this.exportVersion();
                break;
            case 'LuisVersionImport':
                this.importVersion();
                break;
            case 'LuisVersionRename':
                this.renameVersion();
                break;
            case 'LuisVersionDelete':
                this.deleteVersion();
                break;
            default:
                console.log('No LUIS Command was selected.');
        }
    }

    private createLuisApplication = (): void => {
        const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
        const outputFileLuisCreate = `${ rootPath }/LuisApplicationCreate.json`;

        console.log('Creating LUIS Application...');

        let command = `bf luis:application:create --name "${ this.luisApplicationName }" --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" `;
        command += `--culture "${ this.luisCulture }" --description "${ this.luisAppDescription }" --versionId "${ this.luisVersionId }" > ${ outputFileLuisCreate }`;

        execSync(command);
        console.log('LUIS Application successfully created');
    }

    private buildLuisApplication = (): void => {
        console.log('Building LUIS Application...');

        const command = `bf luis:build --in "${ this.luisInputFile }" --authoringKey "${ this.luisSubscriptionKey }" --botName "${ this.luisBotName }" `;

        execSync(command);
        console.log('LUIS Application successfully built');
    }

    private trainLuisApplication = (): void => {
        console.log('Training LUIS Application...');

        const command = `bf luis:train:run --appId "${ this.luisAppId }" --versionId "${ this.luisVersionId }" --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }"`;

        execSync(command);
        console.log('LUIS Training request successfully issued');
    }

    private publishLuisApplication = (): void => {
        console.log('Publishing LUIS Application...');

        let command = `bf luis:application:publish --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --versionId "${ this.luisVersionId }" --appId "${ this.luisAppId }"`;
        command += this.luisPublishStaging? ` --staging` : '';

        execSync(command);
        console.log('LUIS Application successfully published');
    }

    private deleteLuisApplication = (): void => {
        console.log('Deleting LUIS Application...');

        const command = `bf luis:application:delete --appId "${ this.luisAppId }" --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --force`;

        execSync(command);
        console.log('LUIS Application successfully deleted');
    }

    private importLuisApplication = (): void => {
        const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
        const outputFileLuisImport = `${ rootPath }/LuisApplicationImport.json`;

        console.log('Importing LUIS Application...');
    
        let command = `bf luis:application:import --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --name "${ this.luisApplicationName }" `
        command += `--in "${ this.luisInputFile }" > ${ outputFileLuisImport }`;

        execSync(command);
        console.log('LUIS Application successfully imported');
    }
    
    private renameLuisApplication = (): void => {
        console.log('Renaming LUIS Application...');
    
        let command = `bf luis:application:rename --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --appId "${ this.luisAppId }" `
        command += `--name "${ this.luisApplicationName }" --description "${ this.luisAppDescription }"`;
    
        execSync(command);
        console.log('LUIS Application successfully renamed');
    }

    private convertLuisModel = (): void => {
        console.log('Converting LUIS model...');
    
        let command = `bf luis:convert --name "${ this.luisApplicationName }" --description "${ this.luisAppDescription }" `;
        command += `--in "${ this.luisConvertInput }" --out "${ this.luisConvertOutput }" --culture "${ this.luisCulture }" --force --recurse`;
    
        execSync(command);
        console.log('LUIS model successfully wrote to:' + this.luisConvertOutput);
    }

    private generateSourceCode = (): void => {
        console.log('Generating Source Code...');
    
        let language: string;

        if (this.programmingLanguage === 'C#') {
            language = 'cs';
        } else {
            language = 'ts';
        }

        const command = `bf luis:generate:${ language } --in "${ this.luisGenerateInput }" --out "${ this.luisGenerateOutput }" --className "${ this.className }" --force`;
    
        execSync(command);
        console.log('The file: ' + this.luisGenerateOutput + ' containing the class: ' + this.className + ' was successfully generated.');
    }

    private translateLuisModel = (): void => {
        console.log('Translating LUIS model...');

        let command = `bf luis:translate --in "${ this.luisTranslateInput }" --out "${ this.luisTranslateOutputFolder }" --translatekey "${ this.translateKey }"`;
        command += this.sourceLang? ` --srclang "${ this.sourceLang }"` : '';
        command += ` --tgtlang "${ this.targetLang }" --force --recurse --translate_comments --translate_link_text`;

        execSync(command);
        console.log('LUIS model successfully translated');
    }

    private versionClone = (): void => {
        console.log('Cloning LUIS application version...');

        let command = `bf luis:version:clone --appId "${ this.luisAppId }" --versionId "${ this.luisVersionId }" --targetVersionId "${ this.targetVersionId }" `;
        command += `--endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }"`;

        execSync(command);
        console.log('LUIS version successfully cloned');
    }

    private exportVersion = (): void => {
        console.log('Exporting LUIS application version...');

        let command = `bf luis:version:export --appId "${ this.luisAppId }" --versionId "${ this.luisVersionId }" --out "${ this.luisOutputFile }" `;
        command += `--endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --force`;

        execSync(command, {stdio: 'inherit'});
        console.log('LUIS version successfully exported');
    }

    private importVersion = (): void => {
        console.log('Importing LUIS application version...');

        let command = `bf luis:version:import --appId "${ this.luisAppId }" --versionId "${ this.luisVersionId }" --in "${ this.luisImportFile }" `;
        command += `--endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }"`;

        execSync(command, {stdio: 'inherit'});
        console.log('LUIS version successfully exported');
    }

    private renameVersion = (): void => {
        console.log('Renaming LUIS application version...');

        let command = `bf luis:version:rename --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --appId "${ this.luisAppId }" `;
        command += `--versionId "${ this.luisVersionId }" --newVersionId "${ this.newVersionId }"`;

        execSync(command, {stdio: 'inherit'});
    }

    private deleteVersion = (): void => {
        console.log('Deleting LUIS application version...');

        let command = `bf luis:version:delete --endpoint "${ this.luisEndpoint }" --subscriptionKey "${ this.luisSubscriptionKey }" --appId "${ this.luisAppId }" `;
        command += `--versionId "${ this.luisVersionId }"`;

        execSync(command, {stdio: 'inherit'});
    }
}