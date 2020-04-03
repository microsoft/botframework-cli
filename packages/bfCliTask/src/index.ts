/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';
import { readFileSync } from 'fs';

const input = new InputValues();
const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
const outputFileLuisCreate = `${ rootPath }/LuisApplicationCreate.json`;

const azureLogin = (helper: SubscriptionHelper): void => {
    const userName = helper.getServicePrincipalClientId();
    const password = helper.getServicePrincipalKey();
    const tenantId = helper.getTenantId();

    console.log('Logging in to Azure...');
    const loginCommand = `az login --service-principal --username "${ userName }" --password "${ password }" --tenant "${ tenantId }"`;
    
    execSync(loginCommand);
    console.log('Successful login');
}

const checkInstalledTool = (): boolean => {
    const output: string = `${ rootPath }/Output.txt`;
    const command = `bf -v > ${ output }`;
    let buffer: Buffer;

    try {
        console.log('Checking bf cli installation...');

        execSync(command);
        buffer = readFileSync(output);
        const version = buffer.toString('utf-8').trim();

        if (version.substr(0,27) === '@microsoft/botframework-cli') {
            console.log('bf cli tool version: ' + version);
            return true;
        }
        else {
            console.log('bf cli tool not installed');
            return false;
        }
    } catch {
        console.log('bf cli tool not installed');
        return false;
    }
}

const installBfCliTool = (): void => {
    const command = `npm i -g @microsoft/botframework-cli`;

    console.log('Installing bf cli tool...');

    execSync(command);
    console.log('bf cli successfully installed');
}

const createLuisApplication = (): void => {
    console.log('Creating LUIS Application...');

    let command = `bf luis:application:create --name "${ input.luisApplicationName }" --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" `;
    command += `--culture "${ input.luisCulture }" --description "${ input.luisAppDescription }" --versionId "${ input.luisVersionId }" > ${ outputFileLuisCreate }`;

    execSync(command);
    console.log('LUIS Application successfully created');
}

const buildLuisApplication = (): void => {
    console.log('Building LUIS Application...');

    const command = `bf luis:build --in "${ input.luisInputFile }" --authoringKey "${ input.luisSubscriptionKey }" --botName "${ input.luisBotName }" `;

    execSync(command);
    console.log('LUIS Application successfully built');
}

const trainLuisApplication = (): void => {
    console.log('Training LUIS Application...');

    const command = `bf luis:train:run --appId "${ input.luisAppId }" --versionId "${ input.luisVersionId }" --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }"`;

    execSync(command);
    console.log('LUIS Training request successfully issued');
}

const publishLuisApplication = (): void => {
    console.log('Publishing LUIS Application...');

    let command = `bf luis:application:publish --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" --versionId "${ input.luisVersionId }" --appId "${ input.luisAppId }"`;
    command += input.luisPublishStaging? ` --staging` : '';

    execSync(command);
    console.log('LUIS Application successfully published');
}

const deleteLuisApplication = (): void => {
    console.log('Deleting LUIS Application...');

    const command = `bf luis:application:delete --appId "${ input.luisAppId }" --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" --force`;

    execSync(command);
    console.log('LUIS Application successfully deleted');
}

const importLuisApplication = (): void => {
    console.log('Importing LUIS Application...');

    let command = `bf luis:application:import --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" --name "${ input.luisApplicationName }" `
    command += `--in "${ input.luisInputFile }" > ${ outputFileLuisCreate }`;

    execSync(command);
    console.log('LUIS Application successfully imported');
}

const renameLuisApplication = (): void => {
    console.log('Renaming LUIS Application...');

    let command = `bf luis:application:rename --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" --appId "${ input.luisAppId }" `
    command += `--name "${ input.luisApplicationName }" --description "${ input.luisAppDescription }"`;

    execSync(command);
    console.log('LUIS Application successfully renamed');
}

const run = (): void => {
    const subscription = taskLibrary.getInput('azureSubscription', true) as string;
    const helper = new SubscriptionHelper(subscription);

    azureLogin(helper);

    if (!checkInstalledTool()) {
        installBfCliTool();
    }

    if (input.luisCommand) {
        switch (input.luisSubCommand) {
            case 'ApplicationCreate':
                createLuisApplication();
                break;
            case 'LuisBuild':
                buildLuisApplication();
                break;
            case 'LuisTrainRun':
                trainLuisApplication();
                break;
            case 'LuisPublish':
                publishLuisApplication();
                break;
            case 'LuisApplicationDelete':
                deleteLuisApplication();
                break;
            case 'LuisApplicationImport':
                importLuisApplication();
                break;
            case 'LuisApplicationRename':
                renameLuisApplication();
                break;
            default:
                console.log('No LUIS Command was selected.');
        }
    }
}

run();