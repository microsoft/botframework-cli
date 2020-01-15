/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';
import { lstatSync, readFileSync } from 'fs';

const input = new InputValues();
const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
const outputFile = `"${ rootPath }/DirectLineCreate.json`;
let formattedParams = new Map<string, string>();  
let botName:string = '';
let webAppName:string = '';

const azureLogin = (helper: SubscriptionHelper): void => {
    const userName = helper.getServicePrincipalClientId();
    const password = helper.getServicePrincipalKey();
    const tenantId = helper.getTenantId();

    try {
        console.log('Logging in to Azure...');
        const loginCommand = `az login --service-principal --username "${ userName }" --password "${ password }" --tenant "${ tenantId }"`;
        
        execSync(loginCommand);
        console.log('Successful login');
    } catch (error) {
        throw new Error('Error in login: ' + error);
    }
}

const getTemplateParameters = (): string => {
    let parameters = '';  

    if (input.parameterFile && lstatSync(input.parameterFile).isFile()) {        
        getResourcesNames();
        parameters += ` --parameters "${ input.parameterFile }"`;
    }

    parameters += input.overrideParameters? ` --parameters ${ getOverrideParameters() }` : '';

    return parameters;
}

const getResourcesNames = (): void => {
    const buffer = readFileSync(input.parameterFile);
    const fileContents: string = buffer.toString('utf-8');    
    const jsonFile = JSON.parse(fileContents);    
    const parametersFile =  jsonFile["parameters"];

    botName = parametersFile["botId"].value;
    webAppName = parametersFile["newWebAppName"].value;
}

const getOverrideParameters = (): string => {
    let keyValuePair = input.overrideParameters.split(' ');
    let key: string = '';
    let value: string = '';

    keyValuePair.forEach(element => {
        if (element.substr(0,1) === '-') {
            key = element.slice(1);
        }
        else {
            value = element;
        }

        formattedParams.set(key, value);
    });

    if (formattedParams.has("botId")) {
        botName = formattedParams.get("botId") as string;
    }

    if (formattedParams.has("newWebAppName")) {
        webAppName = formattedParams.get("newWebAppName") as string;
    }

    let stringParams: string = '';

    for (let [key, value] of formattedParams) {
        stringParams += key + '=' + value + ' ';
    }

    return stringParams;
}

const getOptionalParameters = (): string => {
    let command:string = '';
    
    if (input.slackChannel) {
        command += input.slackVerificationToken? ` slackVerificationToken="${ input.slackVerificationToken }"`: '';
        command += input.slackBotToken ? ` slackBotToken="${ input.slackBotToken }"` : '';
        command += input.slackClientSigningSecret ? ` slackClientSigningSecret="${ input.slackClientSigningSecret }"` : '';
    }

    if (input.webexChannel) {
        command += ` webexPublicAddress=https://"${ webAppName }".azurewebsites.net`;
        command += input.webexAccessToken ? ` webexAccessToken="${ input.webexAccessToken }"` : '';
        command += input.webexSecret ? ` webexSecret="${ input.webexSecret }"` : '';
        command += input.webexWebhookName ? ` webexWebhookName="${ input.webexWebhookName }"` : '';
    }

    if (input.facebookChannel) {
        command += input.facebookVerifyToken ? ` facebookVerifyToken="${ input.facebookVerifyToken }"` : '';
        command += input.facebookAppSecret ? ` facebookAppSecret="${ input.facebookAppSecret }"` : '';
        command += input.facebookAccessToken ? ` facebookAccessToken="${ input.facebookAccessToken }"` : '';
    }

    if (input.twilioChannel) {
        command += input.twilioNumber ? ` twilioNumber="${ input.twilioNumber }"` : '';
        command += input.twilioAccountSid ? ` twilioAccountSid="${ input.twilioAccountSid }"` : '';
        command += input.twilioAuthToken ? ` twilioAuthToken="${ input.twilioAuthToken }"` : '';
        command += ` twilioValidationUrl=https://"${ webAppName }".azurewebsites.net/api/messages`;
    }

    return command;
}

const validateDeployment = (): void => {
    try {
        console.log('Validating Deployment...');

        let command = `az deployment validate --location "${ input.location }" --template-file "${ input.templateFile }" `;
            command += getTemplateParameters();
            command += getOptionalParameters();

        execSync(command);
        console.log('Deployment successfully validated');      
    } catch (error) {
        throw new Error('Error in deployment validation: ' + error);    
    }
}

const resourcesDeployment = (): void => {
    try {
        console.log('Deploying resources to Azure...');

        let command = `az deployment create --name "${ input.resourceGroup }" --location "${ input.location }" --template-file "${ input.templateFile }" `;
            command += getTemplateParameters();
            command += getOptionalParameters();

        execSync(command);
        console.log('Successful deployment');      
    } catch (error) {
        throw new Error('Error in deploy: ' + error);    
    }
}

const botDeployment = (): void => {
    try {
        console.log('Deploying bot to Azure...');
        const command = `az webapp deployment source config-zip --resource-group "${ input.resourceGroup }" --name "${ webAppName }" --src "${ input.zipFile }"`;
        
        execSync(command);
        console.log('Bot successfully deployed');
    } catch (error) {
        throw new Error('Error in bot deployment: ' + error);    
    }
}

const directLineConnection = (): void => {
    try {
        console.log('Connecting to Channel: Direct Line...');         
        const command = `az bot directline create -n "${ botName }" -g "${ input.resourceGroup }"`;
    
        execSync(command);
        console.log('Connection with Teams succeeded'); 
    } catch (error) {
        throw new Error('Error in Teams connection: ' + error);    
    }
}

const teamsConnection = (): void => {
    try {
        console.log('Connecting to Channel: Teams...');         
        const command = `az bot msteams create -n "${ botName }" -g "${ input.resourceGroup }" > "${ outputFile }"`;
    
        execSync(command);
        console.log('Connection with Direct Line succeeded'); 
    } catch (error) {
        throw new Error('Error in Direct Line connection: ' + error);    
    }
}

const run = (): void => {
    const subscription = taskLibrary.getInput('azureSubscription', true) as string;
    const helper = new SubscriptionHelper(subscription);
    
    azureLogin(helper);

    if (input.validationMode) {
        validateDeployment();
    }
    else {
        resourcesDeployment();   
        botDeployment();
        
        if (input.directLineChannel) {
            directLineConnection();
        }

        if (input.teamsChannel) {
            teamsConnection();
        }
    }
}

run();