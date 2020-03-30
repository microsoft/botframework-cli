/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getInput, getBoolInput } from "azure-pipelines-task-lib";
import { existsSync } from "fs";

export class InputValues {

    public luisCommand: boolean;
    public luisSubCommand: string;
    public luisApplicationName: string;
    public luisEndpoint: string;
    public luisSubscriptionKey: string;
    public luisCulture: string;
    public luisVersionId: string;
    public luisAppDescription: string;
    public luisInputFile: string;
    public luisBotName: string;
    public luisAppId: string;
    public luisPublishStaging: boolean;

    constructor() {
        // LUIS inputs
        this.luisCommand = getBoolInput('luisCommand', false);
        this.luisSubCommand = getInput('luisSubCommand', false) as string;
        this.luisApplicationName = getInput('luisApplicationName', false) as string;
        this.luisEndpoint = getInput('luisEndpoint', false) as string;
        this.luisSubscriptionKey = getInput('luisSubscriptionKey', false) as string;
        this.luisCulture = getInput('luisCulture', false) as string;
        this.luisVersionId = getInput('luisVersionId', false) as string;
        this.luisAppDescription = getInput('luisAppDescription', false) as string;
        this.luisInputFile = this.validatePath('luisInputFile');
        this.luisBotName = getInput('luisBotName', false) as string;
        this.luisAppId = getInput('luisAppId', false) as string;
        this.luisPublishStaging = getBoolInput('luisPublishStaging', false);
    }

    private validatePath = (inputName: string): string => {
        const path = getInput(inputName) as string;

        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }

        return path;
    }    
}