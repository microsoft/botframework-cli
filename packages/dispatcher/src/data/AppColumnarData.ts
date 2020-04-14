/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { ColumnarData } from "./ColumnarData";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export function exampleFunctionData(): ColumnarData {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppColumnarData",
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
        `args=${Utility.JSONstringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${Utility.JSONstringify(unknownArgs)}`);
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
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
    const columnarData: ColumnarData = ColumnarData.createColumnarData(
        columnarContent,
        new NgramSubwordFeaturizer(),
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        linesToSkip,
        true);
    // ---- NOTE-TODO-PLACEHOLDER ---- columnarData.dumpLuLuisJsonStructureInLuFormat(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".lu");
    // ---- NOTE-TODO-PLACEHOLDER ---- columnarData.dumpLuLuisJsonStructure(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".luis", undefined, 4);
    return columnarData;
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData();
}
