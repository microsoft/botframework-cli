import task = require('azure-pipelines-task-lib/task');

export class InputValues {

    public resourceGroup: string;
    public location: string;
    public template: string;
    public appId: string;
    public appSecret: string;
    public botName: string;
    public zipFile: string;

    constructor() {
        this.resourceGroup = task.getInput('resourceGroup', true) as string;
        this.location = task.getInput('location', true) as string;
        this.template = task.getInput('template', true) as string;
        this.appId = task.getInput('appId', true) as string;
        this.appSecret = task.getInput('appSecret', true) as string;
        this.botName = task.getInput('botName', true) as string;
        this.zipFile = task.getInput('zipFile', true) as string;
    }
}