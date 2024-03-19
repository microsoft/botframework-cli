/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getInput } from "azure-pipelines-task-lib";
import { existsSync } from "fs";

export class Utils {


    public validatePath = (inputName: string): string => {
        const path = getInput(inputName) as string;

        if (!existsSync(path)) {
            throw new Error(`The file or directory "${ path }" specified in "${ inputName }" does not exist.`);
        }

        return path;
    }    
}