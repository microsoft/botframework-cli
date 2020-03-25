/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';

const input = new InputValues();

const azureLogin = (helper: SubscriptionHelper): void => {
    const userName = helper.getServicePrincipalClientId();
    const password = helper.getServicePrincipalKey();
    const tenantId = helper.getTenantId();

    console.log('Logging in to Azure...');
    const loginCommand = `az login --service-principal --username "${ userName }" --password "${ password }" --tenant "${ tenantId }"`;
    
    execSync(loginCommand);
    console.log('Successful login');
}

const createLuisApplication = (): void => {
    console.log('Creating LUIS Application...');

    let command = `az group create --name "${ input.applicationName }" --subscriptionKey "XXXXXXXXX" --versionId "1.0"`;
    
    execSync(command);
    console.log('LUIS Application successfully created');      
}

const run = (): void => {
    const subscription = taskLibrary.getInput('azureSubscription', true) as string;
    const helper = new SubscriptionHelper(subscription);

    azureLogin(helper);

    createLuisApplication();
}

run();