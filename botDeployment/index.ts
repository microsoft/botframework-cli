import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';
import { InputValues } from './inputValues';

const input = new InputValues();

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
        console.log('Error in login: ' + error);
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);
    }
}

const resourcesDeployment = (): void => {
    try {
        console.log('Deploying resources to Azure...');
        let command = `az deployment create --name "${ input.resourceGroup }" --location "${ input.location }" --template-file "${ input.template }" `;
            command += `--parameters appId="${ input.appId }" appSecret="${ input.appSecret }" botId="${ input.botName }" `;
            command += `botSku=F0 newAppServicePlanName="${ input.botName }" newWebAppName=${ input.botName } groupName="${ input.resourceGroup }" groupLocation="${ input.location }" newAppServicePlanLocation="${ input.location }"`;
        
        execSync(command);
        console.log('Successful deployment');      
    } catch (error) {
        console.log('Error in deploy: ' + error);    
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);    
    }
}

const botDeployment = (): void => {
    try {
        console.log('Deploying bot to Azure...');
        const command = `az webapp deployment source config-zip --resource-group "${ input.resourceGroup }" --name "${ input.botName }" --src "${ input.zipFile }"`;
        
        execSync(command);
        console.log('Bot successfully deployed');
    } catch (error) {
        console.log('Error in bot deployment: ' + error);    
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);
    }
}

const run = (): void => {
    try {
        const subscription = taskLibrary.getInput('azureSubscription', true) as string;
        const helper = new SubscriptionHelper(subscription);

        azureLogin(helper);
        resourcesDeployment();   
        botDeployment();
    } catch (error) {
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);
    }
}

run();