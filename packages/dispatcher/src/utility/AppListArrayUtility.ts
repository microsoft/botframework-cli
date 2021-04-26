/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import assert = require("assert");

import { ArgumentParser } from "argparse";

import { ListArrayUtility } from "./ListArrayUtility";

import { Utility } from "./Utility";

export function exampleFunctionListArrayUtility(): void {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionListArrayUtility();
}
