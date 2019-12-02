/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ArgumentParser } from "argparse";

import { Tester } from "./Tester";

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

// import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { BinaryConfusionMatrixMetrics } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";

import { ColumnarData } from "../../../data/ColumnarData";

import { LuData } from "../../../data/LuData";

// import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

export async function mainTester(): Promise<void> {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppTester",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--filename"],
        {
            help: "an input data file",
            required: true,
        },
    );
    parser.addArgument(
        ["-m", "--modelFilename"],
        {
            help: "model file",
            required: true,
        },
    );
    parser.addArgument(
        ["-x", "--featurizerFilename"],
        {
            help: "serialized featurizer file",
            required: true,
        },
    );
    parser.addArgument(
        ["-o", "--outputFilename"],
        {
            help: "output data file",
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
            defaultValue: 0,
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
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string =
        args.filename;
    if (!Utility.exists(filename)) {
        Utility.debuggingThrow(
            `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
    }
    const modelFilename: string =
        args.modelFilename;
    if (!Utility.exists(modelFilename)) {
        Utility.debuggingThrow(
            `The input model file ${modelFilename} does not exist! process.cwd()=${process.cwd()}`);
    }
    const featurizerFilename: string =
        args.featurizerFilename;
    if (!Utility.exists(featurizerFilename)) {
        Utility.debuggingThrow(
            `The input featurizer file ${featurizerFilename} does not exist! process.cwd()=${process.cwd()}`);
    }
    let outputFilename: string = args.outputFilename;
    if (outputFilename == null) {
        outputFilename = filename + ".metrics.json";
    }
    Utility.debuggingLog(
        `filename=${filename}`);
    Utility.debuggingLog(
        `outputFilename=${outputFilename}`);
    Utility.debuggingLog(
        `modelFilename=${modelFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
    // const outputModelFilename: string =
    //     args.outputModelFilename;
    // -----------------------------------------------------------------------
    const tester: Tester =
        new Tester(
            modelFilename,
            featurizerFilename);
    // -----------------------------------------------------------------------
    const content: string =
        Utility.loadFile(filename);
    let intentsUtterances: {
        "intents": string[],
        "utterances": string[] } = {
            intents: [],
            utterances: [] };
    let intentLabelIndexArray: number[] = [];
    let utteranceFeatureIndexArrays: number[][] = [];
    if (filename.endsWith(".lu")) {
        const luData: LuData =
            await LuData.createLuData(
                content,
                tester.getFeaturizer(),
                false);
        intentsUtterances = luData.getIntentsUtterances();
        intentLabelIndexArray = luData.getIntentLabelIndexArray();
        utteranceFeatureIndexArrays = luData.getUtteranceFeatureIndexArrays();
    } else {
        const labelColumnIndex: number = +args.labelColumnIndex;
        const textColumnIndex: number = +args.textColumnIndex;
        const linesToSkip: number = +args.linesToSkip;
        Utility.debuggingLog(
            `labelColumnIndex=${labelColumnIndex}`);
        Utility.debuggingLog(
            `textColumnIndex=${textColumnIndex}`);
        Utility.debuggingLog(
            `linesToSkip=${linesToSkip}`);
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                content,
                tester.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                false);
        intentsUtterances = columnarData.getIntentsUtterances();
        intentLabelIndexArray = columnarData.getIntentLabelIndexArray();
        utteranceFeatureIndexArrays = columnarData.getUtteranceFeatureIndexArrays();
    }
    // -----------------------------------------------------------------------
    const confusionMatrixTest: ConfusionMatrix =
        tester.test(
            intentsUtterances.intents,
            intentsUtterances.utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays);
    const confusionMatrixMetricStructure: { "confusionMatrix": ConfusionMatrix,
        "labelBinaryConfusionMatrixDerivedMetricMap": { [id: string]: { [id: string]: number }; },
        "labelBinaryConfusionMatrixMetricMap": { [id: string]: BinaryConfusionMatrixMetrics; },
        "macroAverageMetrics": { "averagePrecision": number,
                                 "averageRecall": number,
                                 "averageF1Score": number,
                                 "totalMacroAverage": number },
        "microAverageMetrics": { "accuracy": number,
                                 "truePositives": number,
                                 "totalMicroAverage": number },
        "weightedMacroAverageMetrics": { "weightedAveragePrecision": number,
                                 "weightedAverageRecall": number,
                                 "weightedAverageF1Score": number,
                                 "weightedTotalMacroAverage": number } } =
        ConfusionMatrix.generateConfusionMatrixMetricStructure(
            confusionMatrixTest);
    if (!Utility.isEmptyString(outputFilename)) {
        Utility.dumpFile(
            outputFilename,
            JSON.stringify(confusionMatrixMetricStructure, undefined, 4));
    }
    Utility.debuggingLog(
        `confusionMatrixTest.getMicroAverageMetrics()=` +
        `${confusionMatrixTest.getMicroAverageMetrics()}` +
        `,confusionMatrixTest.getMacroAverageMetrics()=` +
        `${confusionMatrixTest.getMacroAverageMetrics()}` +
        `,confusionMatrixTest.getWeightedMacroAverageMetrics()=` +
        `${confusionMatrixTest.getWeightedMacroAverageMetrics()}`);
    // -----------------------------------------------------------------------
    const dateTimeEndInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    Utility.debuggingLog(
        `dateTimeBeginInString=${dateTimeBeginInString}`);
    Utility.debuggingLog(
        `dateTimeEndInString=${dateTimeEndInString}`);
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    mainTester().then(() => { return; });
}
