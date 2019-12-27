import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';

const input = new InputValues();
const rootPath = taskLibrary.getVariable('System.DefaultWorkingDirectory');
const outputFile = `"${ rootPath }/DirectLineCreate.json`;

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

const getOptionalParameters = (): string => {
    let command = input.slackVerificationToken? ` slackVerificationToken="${ input.slackVerificationToken }"`: '';
    command += input.slackBotToken ? ` slackBotToken="${ input.slackBotToken }"` : '';
    command += input.slackClientSigningSecret ? ` slackClientSigningSecret="${ input.slackClientSigningSecret }"` : '';

    return command;
}

const resourcesDeployment = (): void => {
    try {
        console.log('Deploying resources to Azure...');

        let command = `az deployment create --name "${ input.resourceGroup }" --location "${ input.location }" --template-file "${ input.template }" `;
            command += `--parameters appId="${ input.appId }" appSecret="${ input.appSecret }" botId="${ input.botName }" `;
            command += `botSku="${ input.botSku }" newAppServicePlanName="${ input.botName }" newWebAppName=${ input.botName } groupName="${ input.resourceGroup }" `;
            command += `groupLocation="${ input.location }" newAppServicePlanLocation="${ input.location }"`;
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
        const command = `az webapp deployment source config-zip --resource-group "${ input.resourceGroup }" --name "${ input.botName }" --src "${ input.zipFile }"`;
        
        execSync(command);
        console.log('Bot successfully deployed');
    } catch (error) {
        throw new Error('Error in bot deployment: ' + error);    
    }
}

const directLineConnection = (): void => {
    try {
        console.log('Connecting to Channel: Direct Line...');         
        const command = `az bot directline create -n "${ input.botName }" -g "${ input.resourceGroup }" > "${ outputFile }"`;
    
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
    resourcesDeployment();   
    botDeployment();
    
    if (input.directLineChannel) {
        directLineConnection();
    }
}

run();