/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getInput, getBoolInput } from "azure-pipelines-task-lib";

export class InputValues {

    public luisCommand: boolean;
    public luisSubCommand: string;
    public luisApplicationName: string;
    public luisEndpoint: string;
    public luisSubscriptionKey: string;
    public luisCulture: string;
    public luisVersionId: string;
    public luisAppDescription: string;

    constructor() {
        // LUIS inputs
        this.luisCommand = getBoolInput('luisCommand', false);
        this.luisSubCommand = getInput('luisSubCommand', true) as string;
        this.luisApplicationName = getInput('luisApplicationName', true) as string;
        this.luisEndpoint = getInput('luisEndpoint', true) as string;
        this.luisSubscriptionKey = getInput('luisSubscriptionKey', true) as string;
        this.luisCulture = getInput('luisCulture', true) as string;
        this.luisVersionId = getInput('luisVersionId', true) as string;
        this.luisAppDescription = getInput('luisAppDescription', true) as string;
    } 
}