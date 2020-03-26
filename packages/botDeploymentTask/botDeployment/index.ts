/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';
import { lstatSync, readFileSync } from 'fs';
import * as AppInsights from 'applicationinsights';
import * as dotenv from 'dotenv';
import * as path from 'path';

const input = new InputValues();
const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
const outputFileDirectLine = `${ rootPath }/DirectLineCreate.json`;
const outputFileTeams = `${ rootPath }/TeamsCreate.json`;
const taskType = taskLibrary.getVariable("Release.ReleaseId") ? "Release Task": "Build Task"
const envFile = path.join(__dirname, '.env');
let formattedParams = new Map<string, string>();  
let botName:string = '';
let webAppName:string = '';
let telemetryClient: AppInsights.TelemetryClient;

dotenv.config({ path: envFile });

const setUserAgent = (): void => {
    const taskFile = path.join(__dirname, 'task.json')
    const buffer = readFileSync(taskFile)
    const fileContents  = buffer.toString('utf-8')
    const sourceTask = JSON.parse(fileContents)

    process.env['AZURE_HTTP_USER_AGENT'] = `Bot-Deployment-Task/${sourceTask.version.Major}.${sourceTask.version.Minor}.${sourceTask.version.Patch}`;
}

const appInsightInit = (): void => {
    AppInsights.setup(process.env.InstrumentationKey)
      // turn off extra instrumentation
      .setAutoCollectConsole(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectExceptions(false)
      .setAutoCollectPerformance(false)
      .setAutoCollectRequests(false)
      .setAutoDependencyCorrelation(false)
      .start();

    telemetryClient = AppInsights.defaultClient;
    telemetryClient.commonProperties = {
        collection: taskLibrary.getVariable("system.collectionId") as string, 
        projectId: taskLibrary.getVariable("system.teamProjectId") as string
    };
    telemetryClient.config.disableAppInsights = !input.telemetry;
  }

const azureLogin = (helper: SubscriptionHelper): void => {
    const userName = helper.getServicePrincipalClientId();
    const password = helper.getServicePrincipalKey();
    const tenantId = helper.getTenantId();

    console.log('Logging in to Azure...');
    const loginCommand = `az login --service-principal --username "${ userName }" --password "${ password }" --tenant "${ tenantId }"`;
    
    execSync(loginCommand);
    console.log('Successful login');
}

const getTemplateParameters = (): string => {
    let parameters = '';  

    console.log('input.parameterFile: ' + input.parameterFile);
    console.log('isFile(): ' + lstatSync(input.parameterFile).isFile());

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

    botName = parametersFile["botId"]? parametersFile["botId"].value : '';
    webAppName = parametersFile["newWebAppName"]? parametersFile["newWebAppName"].value : parametersFile["siteName"]? parametersFile["siteName"].value : '';
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
    else if(formattedParams.has("siteName")) {
        webAppName = formattedParams.get("siteName") as string;
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
        command += input.slackSigningSecret ? ` slackClientSigningSecret="${ input.slackSigningSecret }"` : '';
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
    console.log('Validating Deployment...');

    let command = `az deployment validate --location "${ input.location }" --template-file "${ input.templateFile }" `;
        command += getTemplateParameters();
        command += getOptionalParameters();

    execSync(command);
    console.log('Deployment successfully validated');      
}

const ResourceGroupExists = (): boolean => {
    const output: string = `${ rootPath }/Output.txt`;
    const command = `az group exists --name "${ input.resourceGroup }" > "${ output }"`;
    let exists: string = "false";
    let buffer: Buffer;
    
    execSync(command);        
    buffer = readFileSync(output);
    exists = buffer.toString('utf-8').trim();
    console.log('Resource Group exists: ' + exists);

    return exists === "true";
}

const createResourceGroup = (): void => {
    console.log('Creating Resource Group...');

    let command = `az group create --location "${ input.location }" --name "${ input.resourceGroup }"`;
    
    execSync(command);
    console.log('Resource Group successfully created');      
}

const resourcesDeployment = (): void => {
    let command: string = '';
    
    console.log('Deploying resources to Azure...');        
    if (input.scope === 'Resource Group') {
        command = `az group deployment create --name "${ input.resourceGroup }" -g "${ input.resourceGroup }" --template-file "${ input.templateFile }"`;            
    } 
    else {
        command = `az deployment create --name "${ input.resourceGroup }" --location "${ input.location }" --template-file "${ input.templateFile }"`;
    }

    command += getTemplateParameters();
    command += getOptionalParameters();

    execSync(command);
    console.log('Successful deployment');      
}

const botDeployment = (): void => {
    console.log('Deploying bot to Azure...');
    const command = `az webapp deployment source config-zip --resource-group "${ input.resourceGroup }" --name "${ webAppName }" --src "${ input.zipFile }"`;
    
    execSync(command);
    console.log('Bot successfully deployed');
}

const directLineConnection = (): void => {
    console.log('Connecting to Channel: Direct Line...');         
    const command = `az bot directline create -n "${ botName }" -g "${ input.resourceGroup }" > "${ outputFileDirectLine }"`;

    execSync(command);
    console.log('Connection with Direct Line succeeded'); 
}

const teamsConnection = (): void => {
    console.log('Connecting to Channel: Teams...');         
    const command = `az bot msteams create -n "${ botName }" -g "${ input.resourceGroup }" > "${ outputFileTeams }"`;

    execSync(command);
    console.log('Connection with Teams succeeded'); 
}

const run = (): void => {
    const subscription = taskLibrary.getInput('azureSubscription', true) as string;
    const helper = new SubscriptionHelper(subscription);
    const startTime  = Date.now();
    
    setUserAgent();
    
    appInsightInit();

    azureLogin(helper);

    try {        
        if (input.validationMode) {
            validateDeployment();
            return;
        }

        if(!ResourceGroupExists()) {
            createResourceGroup();
        }

        resourcesDeployment();   
        botDeployment();
        
        if (input.directLineChannel) {
            directLineConnection();
            telemetryClient.trackEvent({ name: "DirectLineConnection" });  
        }

        if (input.slackChannel) {
            telemetryClient.trackEvent({ name: "SlackConnection" });  
        }

        if (input.teamsChannel) {
            teamsConnection();
            telemetryClient.trackEvent({ name: "MSTeamsConnection" });  
        }

        if (input.webexChannel) {
            telemetryClient.trackEvent({ name: "WebexConnection" });  
        }

        if (input.facebookChannel) {
            telemetryClient.trackEvent({ name: "FacebookConnection" });  
        }

        if (input.twilioChannel) {
            telemetryClient.trackEvent({ name: "TwilioConnection" });  
        }

        let duration = Date.now() - startTime;
        telemetryClient.trackRequest({ name: "Task Execution", url: taskType, duration: duration, success: true, resultCode: "OK" });
        taskLibrary.setResult(taskLibrary.TaskResult.Succeeded, "Ok", true);
    }
    catch (error) {
        let duration = Date.now() - startTime;
        telemetryClient.trackException({ exception: error });   
        telemetryClient.trackRequest({ name: "Task Execution", url: taskType, duration: duration, success: false, resultCode: "Error" });
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error.message, true);
    } 
    finally {
        telemetryClient.flush();
    }
}

run();