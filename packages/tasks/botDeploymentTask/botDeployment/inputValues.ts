/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getInput, getBoolInput } from "azure-pipelines-task-lib";
import { existsSync } from "fs";

export class InputValues {

    public resourceGroup: string;
    public location: string;
    public templateFile: string;
    public parameterFile: string;
    public overrideParameters: string;
    public validationMode?: boolean;
    public zipFile: string;
    public directLineChannel?: boolean;
    public slackChannel?: boolean;
    public teamsChannel?: boolean;
    public webexChannel?: boolean;
    public facebookChannel?: boolean;
    public twilioChannel?: boolean;
    public slackVerificationToken?: string = '';
    public slackBotToken?: string = '';
    public slackClientSigningSecret?: string = '';
    public webexAccessToken?: string = '';
    public webexSecret?: string = '';
    public webexWebhookName?: string = '';
    public facebookVerifyToken?: string = '';
    public facebookAppSecret?: string = '';
    public facebookAccessToken?: string = '';
    public twilioNumber?: string = '';
    public twilioAccountSid?: string = '';
    public twilioAuthToken?: string = '';

    constructor() {
        this.resourceGroup = getInput('resourceGroup', true) as string;
        this.location = getInput('location', true) as string;
        this.templateFile = this.validatePath('template');
        this.parameterFile = this.validatePath('templateParameters');
        this.overrideParameters = getInput('overrideParameters', false) as string;
        this.zipFile = this.validatePath('zipFile');
        this.directLineChannel = getBoolInput('directLineChannel', false);        
        this.slackChannel = getBoolInput('slackChannel', false);
        this.teamsChannel = getBoolInput('teamsChannel', false); 
        this.webexChannel = getBoolInput('webexChannel', false);
        this.facebookChannel = getBoolInput('facebookChannel', false); 
        this.twilioChannel = getBoolInput('twilioChannel', false);
        
        if (this.slackChannel) {
            this.slackVerificationToken = getInput('slackVerificationToken', false);
            this.slackBotToken = getInput('slackBotToken', false);
            this.slackClientSigningSecret = getInput('slackClientSigningSecret', false);
        }

        if (this.webexChannel) {
            this.webexAccessToken = getInput('webexAccessToken', false);
            this.webexSecret = getInput('webexSecret', false);
            this.webexWebhookName = getInput('webexWebhookName', false);
        }

        if (this.facebookChannel) {
            this.facebookVerifyToken = getInput('facebookVerifyToken', false);
            this.facebookAppSecret = getInput('facebookAppSecret', false);
            this.facebookAccessToken = getInput('facebookAccessToken', false);
        }

        if (this.twilioChannel) {
            this.twilioNumber = getInput('twilioNumber', false);
            this.twilioAccountSid = getInput('twilioAccountSid', false);
            this.twilioAuthToken = getInput('twilioAuthToken', false);
        }

        this.validationMode = getBoolInput('validationMode', false);
    }

    private validatePath = (inputName: string): string => {
        const path = getInput(inputName) as string;
        
        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }
    
        return path;
    }    
}