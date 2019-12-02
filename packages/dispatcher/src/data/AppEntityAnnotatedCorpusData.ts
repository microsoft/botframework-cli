/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { EntityAnnotatedCorpusData } from "./EntityAnnotatedCorpusData";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export function exampleFunctionData(): EntityAnnotatedCorpusData {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppEntityAnnotatedCorpusData",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--filename"],
        {
            help: "an Entity-Annotated-Corpus file",
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
        ["-s", "--linesToSkip"],
        {
            defaultValue: 1,
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
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // console.dir(args);
    const filename: string = args.filename;
    // let outputFilename: string = args.outputFilename;
    // if (outputFilename == null) {
    //     outputFilename = filename + ".json";
    // }
    const linesToSkips: number = +args.linesToSkip;
    Utility.debuggingLog(
        `filename=${filename}`);
    // Utility.debuggingLog(
    //     `outputFilename=${outputFilename}`);
    const entityAnnotatedCorpusContent: string = Utility.loadFile(filename);
    const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
        EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
            entityAnnotatedCorpusContent,
            new NgramSubwordFeaturizer(),
            linesToSkips,
            true);
    // entityAnnotatedCorpusData.dumpLuJsonStructure(outputFilename);
    return entityAnnotatedCorpusData;
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData();
}
