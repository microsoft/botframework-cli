import { getInput, getBoolInput } from "azure-pipelines-task-lib";
import { existsSync } from "fs";

export class InputValues {

    public resourceGroup: string;
    public location: string;
    public template: string;
    public appId: string;
    public appSecret: string;
    public botName: string;
    public zipFile: string;
    public botSku?: string = 'F0';
    public directLineChannel?: boolean;
    public slackChannel?: boolean;
    public slackVerificationToken?: string = '';
    public slackBotToken?: string = '';
    public slackClientSigningSecret?: string = '';

    constructor() {
        this.resourceGroup = getInput('resourceGroup', true) as string;
        this.location = getInput('location', true) as string;
        this.template = this.validatePath('template');
        this.appId = getInput('appId', true) as string;
        this.appSecret = getInput('appSecret', true) as string;
        this.botName = getInput('botName', true) as string;
        this.zipFile = this.validatePath('zipFile');
        this.botSku = getInput('botSku', false) as string;
        this.directLineChannel = getBoolInput('directLineChannel', false);        
        this.slackChannel = getBoolInput('slackChannel', false);
        
        if (this.slackChannel) {
            this.slackVerificationToken = getInput('slackVerificationToken', false);
            this.slackBotToken = getInput('slackBotToken', false);
            this.slackClientSigningSecret = getInput('slackClientSigningSecret', false);
        }
    }

    private validatePath = (inputName: string): string => {
        const path = getInput(inputName) as string;
        
        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }
    
        return path;
    }    
}