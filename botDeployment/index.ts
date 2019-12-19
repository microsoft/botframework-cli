import taskLibrary = require('azure-pipelines-task-lib/task');
import { execSync } from "child_process";
import { SubscriptionHelper } from './subscriptionHelper';

const azureLogin = (helper: SubscriptionHelper): void => {
    let userName = helper.getServicePrincipalClientId();
    let password = helper.getServicePrincipalKey();
    let tenantId = helper.getTenantId();

    try {
        console.log('Logging in to Azure...');
        let loginCommand = `az login --service-principal --username "${ userName }" --password "${ password }" --tenant "${ tenantId }"`;
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
        let resourceGroup = taskLibrary.getInput('resourceGroup', true);
        let location = taskLibrary.getInput('location', true);
        let template = taskLibrary.getInput('template', true);
        let appId = taskLibrary.getInput('appId', true);
        let appSecret = taskLibrary.getInput('appSecret', true);
        let botName = taskLibrary.getInput('botName', true);

        let command = `az deployment create --name "${ resourceGroup }" --location "${ location }" --template-file "${ template }" `;
        command += `--parameters appId="${ appId }" appSecret="${ appSecret }" botId="${ botName }" `;
        command += `botSku=F0 newAppServicePlanName="${ botName }" newWebAppName=${ botName } groupName="${ resourceGroup }" groupLocation="${ location }" newAppServicePlanLocation="${ location }"`;
        execSync(command);
        console.log('Successful deployment');      
    } catch (error) {
        console.log('Error in deploy: ' + error);    
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);    
    }
}

const run = (): void => {
    try {
        let subscription = taskLibrary.getInput('azureSubscription', true) as string;
        let helper = new SubscriptionHelper(subscription);

        azureLogin(helper);
        resourcesDeployment();   
    } catch (error) {
        taskLibrary.setResult(taskLibrary.TaskResult.Failed, error);
    }
}

run();