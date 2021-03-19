/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

// tslint:disable-next-line: no-var-requires
const readlineSync = require("readline-sync");

import { ArgumentParser } from "argparse";

import { Predictor } from "./Predictor";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

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
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-f", "--filename"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "an input data file",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: true,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-t", "--filetype"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "data file type",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
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
        ["-o", "--outputReportFilenamePrefix"],
        {
            help: "output report file prefix",
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
    Utility.resetFlagToPrintDebuggingLogToConsole(debugFlag);
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    // ---- NOTE-TODO-PLACEHOLDER ---- const filename: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- if (!Utility.exists(filename)) {
    // ---- NOTE-TODO-PLACEHOLDER ----     Utility.debuggingThrow(
    // ---- NOTE-TODO-PLACEHOLDER ----         `The input dataset file ${filename} does not exist!` +
    // ---- NOTE-TODO-PLACEHOLDER ----         ` process.cwd()=${process.cwd()}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- }
    // ---- NOTE-TODO-PLACEHOLDER ---- const filetype: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.filetype;
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
    let outputReportFilenamePrefix: string = args.outputReportFilenamePrefix;
    if (Utility.isEmptyString(outputReportFilenamePrefix)) {
        outputReportFilenamePrefix = Utility.getFilenameWithoutExtension(modelFilename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `filename=${filename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    Utility.debuggingLog(
        `modelFilename=${modelFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
    // -----------------------------------------------------------------------
    const predictor: Predictor =
        new Predictor(
            modelFilename,
            featurizerFilename);
    // -----------------------------------------------------------------------
    const modelNullable: SoftmaxRegressionSparse|null =
        predictor.getModel();
    if (modelNullable === null) {
        Utility.debuggingThrow("model is null");
    }
    const featurizerNullable: NgramSubwordFeaturizer|null =
        predictor.getFeaturizer();
    if (featurizerNullable === null) {
        Utility.debuggingThrow("featurizer is null");
    }
    const model: SoftmaxRegressionSparse =
        modelNullable as SoftmaxRegressionSparse;
    const featurizer: NgramSubwordFeaturizer =
        featurizerNullable as NgramSubwordFeaturizer;
    // -------------------------------------------------------------------
    const labels: string[] = featurizer.getLabels();
    const labelMap: Map<string, number> = featurizer.getLabelMap();
    // const numberLabels: number = featurizer.getNumberLabels();
    // const numberFeatures: number = featurizer.getNumberFeatures();
    // -----------------------------------------------------------------------
    const confusionMatrixPrediction: ConfusionMatrix =
        new ConfusionMatrix(labels, labelMap);
    const thresholdReporterPredict: ThresholdReporter =
        new ThresholdReporter("", "", null, null, labels, labelMap);
    // -----------------------------------------------------------------------
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
            "confusionMatrixPrediction": ConfusionMatrix
            "thresholdReporterPrediction": ThresholdReporter,
            "predictionLabels": string[],
            "predictionLabelIndexes": number[],
            "groundTruthLabels": string[],
            "groundTruthLabelIndexes": number[],
            "predictions": number[][] } = predictor.predict(
                utterance,
                intent);
        Utility.debuggingLog(
           `groundTruthLabel=${predictionResult.groundTruthLabels[predictionResult.groundTruthLabels.length - 1]}` +
           `, predictionLabel=${predictionResult.predictionLabels[predictionResult.predictionLabels.length - 1]}` +
           `, groundTruthLabelIndex=${predictionResult.groundTruthLabelIndexes[predictionResult.groundTruthLabelIndexes.length - 1]}, ` +
           `, predictionLabelIndex=${predictionResult.predictionLabelIndexes[predictionResult.predictionLabelIndexes.length - 1]}`);
    }
    // -----------------------------------------------------------------------
    const evaluationJsonReportResult: {
        "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
        "outputFilenames": string[],
        } = predictor.generateEvaluationJsonReportToFiles(
            outputReportFilenamePrefix);
    const evaluationDataArraysReportResult: {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        } = predictor.generateEvaluationDataArraysReportToFiles(
            outputReportFilenamePrefix);
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
