/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { LuData } from "./lu_data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/ngram_subword_featurizer";

import { Utility } from "../utility/utility";

export async function exampleFunctionData(): Promise<void> {
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "app_lu_data",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--filename"],
        {
            help: "a LU file",
            required: true,
        },
    );
    parser.addArgument(
        ["-o", "--outputFilename"],
        {
            help: "output file",
            required: false,
        },
    );
    parser.addArgument(
        ["-d", "--debug"],
        {
            help: "enable printing debug information",
            required: false,
        },
    );
    const parsedKnownArgs: any[] = parser.parseKnownArgs();
    const args: any = parsedKnownArgs[0];
    const unknownArgs: any = parsedKnownArgs[1];
    Utility.debuggingLog(
        `args=${JSON.stringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${JSON.stringify(unknownArgs)}`);
    if (Utility.toBoolean(args.debug)) {
        Utility.toPrintDebuggingLogToConsole = true;
    }
    // console.dir(args);
    const filename: string = args.filename;
    let outputFilename: string = args.outputFilename;
    if (outputFilename == null) {
        outputFilename = filename + ".json";
    }
    Utility.debuggingLog(
        `filename=${filename}`);
    Utility.debuggingLog(
        `outputFilename=${outputFilename}`);
    const luContent: string = Utility.loadFile(filename);
    const luData: LuData = await LuData.createLuData(
        luContent,
        new NgramSubwordFeaturizer());
    luData.dumpLuJsonStructure(outputFilename, undefined, 4);
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData().then(() => { return; });
}
