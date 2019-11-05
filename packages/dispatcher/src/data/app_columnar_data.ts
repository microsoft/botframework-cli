/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { ColumnarData } from "./columnar_data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/ngram_subword_featurizer";

import { Utility } from "../utility/utility";

export function exampleFunctionData(): ColumnarData {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "app_columnar_data",
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
    // parser.addArgument(
    //     ["-o", "--outputFilename"],
    //     {
    //         help: "output file",
    //         required: false,
    //     },
    // );
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
        ["-s", "--linesToSkip"],
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
        `args=${JSON.stringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${JSON.stringify(unknownArgs)}`);
    if (Utility.toBoolean(args.debug)) {
        Utility.toPrintDebuggingLogToConsole = true;
    }
    // console.dir(args);
    const filename: string = args.filename;
    // let outputFilename: string = args.outputFilename;
    // if (outputFilename == null) {
    //     outputFilename = filename + ".json";
    // }
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const linesToSkips: number = +args.linesToSkip;
    Utility.debuggingLog(
        `filename=${filename}`);
    // Utility.debuggingLog(
    //     `outputFilename=${outputFilename}`);
    const luContent: string = Utility.loadFile(filename);
    const columnarData: ColumnarData = ColumnarData.createColumnarData(
        luContent,
        new NgramSubwordFeaturizer(),
        labelColumnIndex,
        textColumnIndex,
        linesToSkips);
    // columnarData.dumpLuJsonStructure(outputFilename);
    return columnarData;
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData();
}
