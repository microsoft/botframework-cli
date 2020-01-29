/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { DictionaryMapUtility } from "../data_structure/DictionaryMapUtility";

import { Utility } from "./Utility";

export function exampleFunctionUtilityWithFilename(
    filename: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    linesToSkip: number): void {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`filename=${filename}`);
    Utility.debuggingLog(`labelColumnIndex=${labelColumnIndex}`);
    Utility.debuggingLog(`textColumnIndex=${textColumnIndex}`);
    Utility.debuggingLog(`linesToSkip=${linesToSkip}`);
    // -----------------------------------------------------------------------
    const labels: string[] = [ "label0", "label1", "label2" ];
    const labelMap: { [id: string]: number; } = {};
    labelMap.label0 = 0;
    labelMap.label1 = 1;
    labelMap.label2 = 2;
    DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(labels, labelMap);
    // -----------------------------------------------------------------------
    const intentsUtterances: { "intents": string[], "utterances": string[] } =
        Utility.loadLabelTextColumnarFile(
            filename,         // ---- filename: string,
            labelColumnIndex, // ---- labelColumnIndex: number = 0,
            textColumnIndex,  // ---- textColumnIndex: number = 1,
            linesToSkip,     // ---- lineIndexToStart: number = 0,
            "\t",             // ---- columnDelimiter: string = "\t",
            "\n",             // ---- rowDelimiter: string = "\n",
            "utf8",           // ---- encoding: string = "utf8",
            -1,               // ---- lineIndexToEnd: number = -1
        );
    const intents: string[] = intentsUtterances.intents;
    const utterances: string[] = intentsUtterances.utterances;
    Utility.debuggingLog(`intents.length=${intents.length}, utterances.length=${utterances.length}`);
    // -----------------------------------------------------------------------
    const filenameMd5: string = Utility.getStringMd5Hash(filename) as string;
    Utility.debuggingLog(`filenameMd5=${filenameMd5}`);
    // -----------------------------------------------------------------------
}

export function exampleFunctionUtility(): void {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`process.argv=${process.argv}`);
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppUtility",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--filename"],
        {
            help: "a file",
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
        `args=${JSON.stringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${JSON.stringify(unknownArgs)}`);
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string = args.filename;
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const linesToSkip: number = +args.linesToSkip;
    exampleFunctionUtilityWithFilename(
        filename,
        labelColumnIndex,
        textColumnIndex,
        linesToSkip);
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionUtility();
}
