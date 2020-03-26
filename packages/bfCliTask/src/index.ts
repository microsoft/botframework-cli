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
    
    console.log('bf cli installed successfully');      
}

const createLuisApplication = (): void => {
    console.log('Creating LUIS Application...');

    let command = `bf luis:application:create --name "${ input.luisApplicationName }" --endpoint "${ input.luisEndpoint }" --subscriptionKey "${ input.luisSubscriptionKey }" `;
    command += `--culture "${ input.luisCulture }" --description "${ input.luisAppDescription }" --versionId "${ input.luisVersionId }"`
    
    execSync(command);
    console.log('LUIS Application successfully created');      
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
            default:
                console.log('No LUIS Command was selected.');
        }
    }
}

run();