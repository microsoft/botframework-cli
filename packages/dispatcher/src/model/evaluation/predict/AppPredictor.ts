/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

// tslint:disable-next-line: no-var-requires
const readlineSync = require("readline-sync");

import { ArgumentParser } from "argparse";

import { Predictor } from "./Predictor";

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

// import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { BinaryConfusionMatrixMetrics } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

export function mainPredictor(): void {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppPredictor",
        version: "0.0.1",
    });
    // ==== parser.addArgument(
    // ====     ["-f", "--filename"],
    // ====     {
    // ====         help: "an input data file",
    // ====         required: true,
    // ====     },
    // ==== );
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
    // ==== const filename: string =
    // ====     args.filename;
    // ==== if (!Utility.exists(filename)) {
    // ====     Utility.debuggingThrow(
    // ====         `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
    // ==== }
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
    const outputFilename: string = args.outputFilename;
    // if (outputFilename == null) {
    //     // ==== outputFilename = filename + ".metrics.json";
    //     Utility.debuggingThrow(
    //         `The output file ${outputFilename} is empty! process.cwd()=${process.cwd()}`);
    // }
    // ==== Utility.debuggingLog(
    // ====     `filename=${filename}`);
    Utility.debuggingLog(
        `outputFilename=${outputFilename}`);
    Utility.debuggingLog(
        `modelFilename=${modelFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
    // const outputModelFilename: string =
    //     args.outputModelFilename;
    // -----------------------------------------------------------------------
    const predictor: Predictor =
        new Predictor(
            modelFilename,
            featurizerFilename);
    // -----------------------------------------------------------------------
    const featurizer: NgramSubwordFeaturizer =
        predictor.getFeaturizer();
    const labels: string[] = featurizer.getLabels();
    const labelMap: { [id: string]: number; } = featurizer.getLabelMap();
    // const numberLabels: number = featurizer.getNumberLabels();
    // const numberFeatures: number = featurizer.getNumberFeatures();
    // -----------------------------------------------------------------------
    const confusionMatrixTest: ConfusionMatrix =
        new ConfusionMatrix(labels, labelMap);
    while (true) {
        const utterance: string =
            readlineSync.question("Please enter an utterance? [empty to end the loop] ");
        Utility.debuggingLog(
            `utterance=${utterance}`);
        if (Utility.isEmptyString(utterance)) {
            break;
        }
        const intent: string =
            readlineSync.question("Please enter intent for the utterance? ");
        Utility.debuggingLog(
            `intent=${intent}`);
        const predictionResult: {
            "confusionMatrixPredict": ConfusionMatrix
            "predictionLabel": string,
            "predictionLabelIndex": number,
            "label": string,
            "labelIndex": number,
            "prediction": number[] } = predictor.predict(
                utterance,
                intent,
                confusionMatrixTest);
        Utility.debuggingLog(
           `label=${predictionResult.label}` +
           `, predictionLabel=${predictionResult.predictionLabel}` +
           `, labelIndex=${predictionResult.labelIndex}, ` +
           `, predictionLabelIndex=${predictionResult.predictionLabelIndex}`);
    }
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
    mainPredictor();
}
