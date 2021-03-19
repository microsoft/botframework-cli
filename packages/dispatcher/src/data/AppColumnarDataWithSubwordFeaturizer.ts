/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { ColumnarDataWithSubwordFeaturizer } from "./ColumnarDataWithSubwordFeaturizer";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export function exampleFunctionDataWithSubwordFeaturizer(): ColumnarDataWithSubwordFeaturizer {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppColumnarDataWithSubwordFeaturizer",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--filename"],
        {
            help: "a columnar file",
            required: true,
        },
    );
    parser.addArgument(
        ["-d", "--debug"],
        {
            help: "enable printing debug information",
            required: false,
        },
    );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-o", "--outputFilenamePrefix"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "output file name prefix",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    parser.addArgument(
        ["-li", "--labelColumnIndex"],
        {
            defaultValue: 0,
            help: "label column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-ti", "--textColumnIndex"],
        {
            defaultValue: 1,
            help: "text/utterance column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-wi", "--weightColumnIndex"],
        {
            defaultValue: -1,
            help: "weight column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-ls", "--linesToSkip"],
        {
            defaultValue: 0,
            help: "number of lines to skip from the input file",
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
    Utility.resetFlagToPrintDebuggingLogToConsole(debugFlag);
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string = args.filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- let outputFilenamePrefix: string = args.outputFilenamePrefix;
    // ---- NOTE-TODO-PLACEHOLDER ---- if (outputFilenamePrefix == null) {
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix = filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- }
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const weightColumnIndex: number = +args.weightColumnIndex;
    const linesToSkip: number = +args.linesToSkip;
    Utility.debuggingLog(
        `filename=${filename}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `outputFilenamePrefix=${outputFilenamePrefix}`);
    const columnarContent: string = Utility.loadFile(filename);
    const columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
        ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip,
            true);
    // ---- NOTE-TODO-PLACEHOLDER ---- columnarDataWithSubwordFeaturizer.dumpLuLuisJsonStructureInLuFormat(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".lu");
    // ---- NOTE-TODO-PLACEHOLDER ---- columnarDataWithSubwordFeaturizer.dumpLuLuisJsonStructure(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".luis", undefined, 4);
    return columnarDataWithSubwordFeaturizer;
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionDataWithSubwordFeaturizer();
}
