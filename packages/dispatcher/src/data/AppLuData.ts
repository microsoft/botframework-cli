/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { LuData } from "./LuData";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../Utility/Utility";

export async function exampleFunctionData(): Promise<string[]> {
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppLuData",
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
        ["-o", "--outputFilenamePrefix"],
        {
            help: "output file name prefix",
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
        `args=${Utility.jsonStringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${Utility.jsonStringify(unknownArgs)}`);
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string = args.filename;
    let outputFilenamePrefix: string = args.outputFilenamePrefix;
    if (outputFilenamePrefix == null) {
        outputFilenamePrefix = filename;
    }
    Utility.debuggingLog(
        `filename=${filename}`);
    Utility.debuggingLog(
        `outputFilenamePrefix=${outputFilenamePrefix}`);
    const luContent: string = Utility.loadFile(filename);
    const luData: LuData = await LuData.createLuData(
        luContent,
        new NgramSubwordFeaturizer(),
        true);
    let luLuisJsonStructureInLuFormatOutputFilename: string =
        outputFilenamePrefix + ".lu";
    luLuisJsonStructureInLuFormatOutputFilename = luData.dumpLuLuisJsonStructureInLuFormat(
        luLuisJsonStructureInLuFormatOutputFilename);
    let luLuisJsonStructureOutputFilename: string =
        outputFilenamePrefix + ".luis";
    luLuisJsonStructureOutputFilename = luData.dumpLuLuisJsonStructure(
        luLuisJsonStructureOutputFilename, undefined, 4);
    return [luLuisJsonStructureInLuFormatOutputFilename, luLuisJsonStructureOutputFilename];
// -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData().then(() => { return; });
}
