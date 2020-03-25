/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getInput } from "azure-pipelines-task-lib";

export class InputValues {

    public bfCommand: string;
    public applicationName: string;

    constructor() {
        this.bfCommand = getInput('bfCommand', true) as string;
        this.applicationName = getInput('applicationName', true) as string;
    } 
}