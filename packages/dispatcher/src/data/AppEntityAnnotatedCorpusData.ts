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
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-o", "--outputFilenamePrefix"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "output file name prefix",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    parser.addArgument(
        ["-ls", "--linesToSkip"],
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
        `args=${Utility.jsonStringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${Utility.jsonStringify(unknownArgs)}`);
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string = args.filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- let outputFilenamePrefix: string = args.outputFilenamePrefix;
    // ---- NOTE-TODO-PLACEHOLDER ---- if (outputFilenamePrefix == null) {
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix = filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- }
    const linesToSkip: number = +args.linesToSkip;
    Utility.debuggingLog(
        `exampleFunctionData(): filename=${filename}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `outputFilenamePrefix=${outputFilenamePrefix}`);
    const entityAnnotatedCorpusContent: string = Utility.loadFile(filename);
    Utility.debuggingLog(
        `exampleFunctionData(): after calling Utility.loadFile(), filename=${filename}`);
    const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
        EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
            entityAnnotatedCorpusContent,
            new NgramSubwordFeaturizer(),
            linesToSkip,
            true);
    Utility.debuggingLog(
        `exampleFunctionData(): after calling EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(), filename=${filename}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- entityAnnotatedCorpusData.dumpLuLuisJsonStructureInLuFormat(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".lu");
    // ---- NOTE-TODO-PLACEHOLDER ---- entityAnnotatedCorpusData.dumpLuLuisJsonStructure(
    // ---- NOTE-TODO-PLACEHOLDER ----     outputFilenamePrefix + ".luis", undefined, 4);
    return entityAnnotatedCorpusData;
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionData();
}
