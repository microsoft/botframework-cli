/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as readline from "readline";

import { ArgumentParser } from "argparse";

import { DictionaryMapUtility } from "../data_structure/DictionaryMapUtility";

import { Utility } from "./Utility";

export function exampleFunctionReadline(): void {
    const interactive: readline.Interface = readline.createInterface(process.stdin, process.stdout);
    const prefix: string = " > ";
    interactive.on("line", (line: string) => {
        switch (line.trim()) {
        case "hello":
            // eslint-disable-next-line no-console
            // tslint:disable-next-line: no-console
            console.log("world!");
            break;
        default:
            // eslint-disable-next-line no-console
            // tslint:disable-next-line: no-console
            console.log("Say what? I might have heard `" + line.trim() + "`");
            break;
        }
        interactive.setPrompt(prefix);
        interactive.prompt();
        }).on("close", () => {
        // eslint-disable-next-line no-console
        // tslint:disable-next-line: no-console
        console.log("Have a great day!");
        // eslint-disable-next-line no-process-exit
        process.exit(0);
    });
    // eslint-disable-next-line no-console
    // tslint:disable-next-line: no-console
    console.log(prefix + "Good to see you. Try typing stuff.");
    // eslint-disable-next-line no-constant-condition
    interactive.setPrompt(prefix);
    interactive.prompt();
}

export function exampleFunctionUtilityWithFilename(
    filename: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    weightColumnIndex: number,
    linesToSkip: number): void {
    // -----------------------------------------------------------------------
    Utility.debuggingLog(`filename=${filename}`);
    Utility.debuggingLog(`labelColumnIndex=${labelColumnIndex}`);
    Utility.debuggingLog(`textColumnIndex=${textColumnIndex}`);
    Utility.debuggingLog(`weightColumnIndex=${weightColumnIndex}`);
    Utility.debuggingLog(`linesToSkip=${linesToSkip}`);
    // -----------------------------------------------------------------------
    const labels: string[] = [ "label0", "label1", "label2" ];
    const labelMap: Map<string, number> = new  Map<string, number>();
    labelMap.set("label0", 0);
    labelMap.set("label1", 1);
    labelMap.set("label2", 2);
    DictionaryMapUtility.validateStringArrayAndStringKeyNumberValueMap(labels, labelMap);
    // -----------------------------------------------------------------------
    const intentsUtterancesWeights: { "intents": string[], "texts": string[], "weights": number[] } =
        Utility.loadLabelTextColumnarFile(
            filename,          // ---- filename: string,
            labelColumnIndex,  // ---- labelColumnIndex: number = 0,
            textColumnIndex,   // ---- textColumnIndex: number = 1,
            weightColumnIndex, // ---- weightColumnIndex: number = -1,
            linesToSkip,       // ---- lineIndexToStart: number = 0,
            "\t",              // ---- columnDelimiter: string = "\t",
            "\n",              // ---- rowDelimiter: string = "\n",
            "utf8",            // ---- encoding: string = "utf8",
            -1,                // ---- lineIndexToEnd: number = -1
        );
    const intents: string[] = intentsUtterancesWeights.intents;
    const texts: string[] = intentsUtterancesWeights.texts;
    const weights: number[] = intentsUtterancesWeights.weights;
    Utility.debuggingLog(`intents.length=${intents.length}, texts.length=${texts.length}`);
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
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string = args.filename;
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const weightColumnIndex: number = +args.weightColumnIndex;
    const linesToSkip: number = +args.linesToSkip;
    exampleFunctionUtilityWithFilename(
        filename,
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        linesToSkip);
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionUtility();
    // exampleFunctionReadline();
}
