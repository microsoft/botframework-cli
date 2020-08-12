/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ArgumentParser } from "argparse";

import { CrossValidator } from "./CrossValidator";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

import { ColumnarData } from "../../../data/ColumnarData";
import { LuData } from "../../../data/LuData";
import { Data } from "../../../data/Data";
import { DataUtility } from "../../../data/DataUtility";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

/**
 * This function consumes a Data object as input and run cross validation (CV) to evaluate models trained from
 * the input label/text (intent/utterance) instance set.
 *
 * @param data - input Data object as input.
 * @param numberOfCrossValidationFolds - number of cross validation (CV) folds.
 * @param learnerParameterEpochs - CV Softmax Regression Learner parameter - number of epochs
 * @param learnerParameterMiniBatchSize - CV Softmax Regression learner parameter - mini-batch size.
 * @param learnerParameterL1Regularization - CV Softmax Regression learner parameter - L1 regularization.
 * @param learnerParameterL2Regularization - CV Softmax Regression learner parameter - L2 regularization.
 * @param learnerParameterLossEarlyStopRatio - CV Softmax Regression learner parameter - early stop ratio.
 * @param learnerParameterLearningRate - CV Softmax Regression learner parameter - learning rate.
 * @param learnerParameterToCalculateOverallLossAfterEpoch - CV Softmax Regression learner parameter - flag
 */
export function mainCrossValidatorWithData(
    data: Data,
    numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds,
    learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs,
    learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
    learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization,
    learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization,
    learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
    learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate,
    learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true): CrossValidator {
    // -----------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // -------------------------------------------------------------------
    const intents: string[] =
        data.getIntents();
    const utterances: string[] =
        data.getUtterances();
    const intentLabelIndexArray: number[] =
        data.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        data.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const crossValidationResult: {
        "confusionMatrixCrossValidation": ConfusionMatrix,
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = crossValidator.crossValidate(
        data.getFeaturizerLabels(),
            data.getFeaturizerLabelMap(),
            data.getFeaturizer().getNumberLabels(),
            data.getFeaturizer().getNumberFeatures(),
            intents,
            utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            data.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
        // tslint:disable-next-line: max-line-length
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
    return crossValidator;
    // -----------------------------------------------------------------------
}

/**
 * This function consumes a LU file content as input and run cross validation (CV) to evaluate models trained from
 * the input label/text (intent/utterance) instance set.
 *
 * @param luContent - input LU file content as input.
 * @param numberOfCrossValidationFolds - number of cross validation (CV) folds.
 * @param learnerParameterEpochs - CV Softmax Regression Learner parameter - number of epochs
 * @param learnerParameterMiniBatchSize - CV Softmax Regression learner parameter - mini-batch size.
 * @param learnerParameterL1Regularization - CV Softmax Regression learner parameter - L1 regularization.
 * @param learnerParameterL2Regularization - CV Softmax Regression learner parameter - L2 regularization.
 * @param learnerParameterLossEarlyStopRatio - CV Softmax Regression learner parameter - early stop ratio.
 * @param learnerParameterLearningRate - CV Softmax Regression learner parameter - learning rate.
 * @param learnerParameterToCalculateOverallLossAfterEpoch - CV Softmax Regression learner parameter - flag
 */
export async function mainCrossValidatorWithLuContent(
    luContent: string,
    numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds,
    learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs,
    learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
    learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization,
    learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization,
    learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
    learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate,
    learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true): Promise<CrossValidator> {
    // -----------------------------------------------------------------------
    const luData: LuData =
        await LuData.createLuData(
            luContent,
            new NgramSubwordFeaturizer(),
            true);
    // -----------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // -------------------------------------------------------------------
    const intents: string[] =
        luData.getIntents();
    const utterances: string[] =
        luData.getUtterances();
    const intentLabelIndexArray: number[] =
        luData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        luData.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const crossValidationResult: {
        "confusionMatrixCrossValidation": ConfusionMatrix,
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = crossValidator.crossValidate(
            luData.getFeaturizerLabels(),
            luData.getFeaturizerLabelMap(),
            luData.getFeaturizer().getNumberLabels(),
            luData.getFeaturizer().getNumberFeatures(),
            intents,
            utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            luData.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
        // tslint:disable-next-line: max-line-length
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
    return crossValidator;
    // -----------------------------------------------------------------------
}

/**
 * This function consumes a columnar TSV file content as input and run cross validation (CV) to
 * evaluate models trained from the input label/text (intent/utterance) instance set.
 *
 * @param columnarContent - content of a TSV columnar file in string form as input.
 * @param labelColumnIndex - label/intent column index.
 * @param textColumnIndex - text/utterace column index.
 * @param weightColumnIndex - weight column index.
 * @param linesToSkip - number of header lines skipped before processing each line as an instance record.
 * @param numberOfCrossValidationFolds - number of cross validation (CV) folds.
 * @param learnerParameterEpochs - CV Softmax Regression Learner parameter - number of epochs
 * @param learnerParameterMiniBatchSize - CV Softmax Regression learner parameter - mini-batch size.
 * @param learnerParameterL1Regularization - CV Softmax Regression learner parameter - L1 regularization.
 * @param learnerParameterL2Regularization - CV Softmax Regression learner parameter - L2 regularization.
 * @param learnerParameterLossEarlyStopRatio - CV Softmax Regression learner parameter - early stop ratio.
 * @param learnerParameterLearningRate - CV Softmax Regression learner parameter - learning rate.
 * @param learnerParameterToCalculateOverallLossAfterEpoch - CV Softmax Regression learner parameter - flag
 */
export function mainCrossValidatorWithColumnarContent(
    columnarContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    weightColumnIndex: number,
    linesToSkip: number,
    numberOfCrossValidationFolds: number =
        CrossValidator.defaultNumberOfCrossValidationFolds,
    learnerParameterEpochs: number =
        AppSoftmaxRegressionSparse.defaultEpochs,
    learnerParameterMiniBatchSize: number =
        AppSoftmaxRegressionSparse.defaultMiniBatchSize,
    learnerParameterL1Regularization: number =
        AppSoftmaxRegressionSparse.defaultL1Regularization,
    learnerParameterL2Regularization: number =
        AppSoftmaxRegressionSparse.defaultL2Regularization,
    learnerParameterLossEarlyStopRatio: number =
        AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
    learnerParameterLearningRate: number =
        AppSoftmaxRegressionSparse.defaultLearningRate,
    learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        true): CrossValidator {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip,
            true);
    // -----------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // -------------------------------------------------------------------
    const intents: string[] =
        columnarData.getIntents();
    const utterances: string[] =
        columnarData.getUtterances();
    const intentLabelIndexArray: number[] =
        columnarData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        columnarData.getUtteranceFeatureIndexArrays();
    assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
    assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
    const crossValidator: CrossValidator =
        new CrossValidator(
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const crossValidationResult: {
        "confusionMatrixCrossValidation": ConfusionMatrix,
        "thresholdReporterCrossValidation": ThresholdReporter,
        "predictionLabels": string[],
        "predictionLabelIndexes": number[],
        "groundTruthLabels": string[],
        "groundTruthLabelIndexes": number[],
        "predictions": number[][] } = crossValidator.crossValidate(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            intents,
            utterances,
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            columnarData.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMicroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()=` +
        // tslint:disable-next-line: max-line-length
        `${crossValidationResult.confusionMatrixCrossValidation.getPositiveSupportLabelSummationMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}` +
        `,crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()=` +
        `${crossValidationResult.confusionMatrixCrossValidation.getSummationWeightedMacroAverageMetrics()}`);
    return crossValidator;
    // -----------------------------------------------------------------------
}

export async function mainCrossValidator(): Promise<{
    "evaluationJsonReportResult": {
        "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
        "outputFilenames": string[],
        },
    "evaluationDataArraysReportResult": {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        },
        }> {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppCrossValidator",
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
        ["-t", "--filetype"],
        {
            help: "data file type",
            required: false,
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
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-m", "--outputModelFilename"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "output model file",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-x", "--outputFeaturizerFilename"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "output serialized featurizer file",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    parser.addArgument(
        ["-nc", "--numberOfCrossValidationFolds"],
        {
            defaultValue: CrossValidator.defaultNumberOfCrossValidationFolds,
            help: "initial number of data instances per category for auto active learning",
            required: false,
        },
    );
    parser.addArgument(
        ["-le", "--learnerParameterEpochs"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultEpochs,
            help: "number of epochs",
            required: false,
        },
    );
    parser.addArgument(
        ["-lb", "--learnerParameterMiniBatchSize"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultMiniBatchSize,
            help: "mini batch size",
            required: false,
        },
    );
    parser.addArgument(
        ["-ll1", "--learnerParameterL1Regularization"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultL1Regularization,
            help: "l1 regularization coefficient",
            required: false,
        },
    );
    parser.addArgument(
        ["-ll2", "--learnerParameterL2Regularization"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultL2Regularization,
            help: "l2 regularization coefficient",
            required: false,
        },
    );
    parser.addArgument(
        ["-lesr", "--learnerParameterLossEarlyStopRatio"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio,
            help: "loss early stop ratio",
            required: false,
        },
    );
    parser.addArgument(
        ["-llr", "--learnerParameterLearningRate"],
        {
            defaultValue: AppSoftmaxRegressionSparse.defaultLearningRate,
            help: "learning rate",
            required: false,
        },
    );
    parser.addArgument(
        ["-ltl", "--learnerParameterToCalculateOverallLossAfterEpoch"],
        {
            defaultValue: true,
            help: "whether to calcualte loss after each epoch",
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
    const filename: string =
        args.filename;
    if (!Utility.exists(filename)) {
        Utility.debuggingThrow(
            `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
    }
    const filetype: string =
        args.filetype;
    let outputReportFilenamePrefix: string = args.outputReportFilenamePrefix;
    if (Utility.isEmptyString(outputReportFilenamePrefix)) {
        outputReportFilenamePrefix = Utility.getFilenameWithoutExtension(filename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    const numberOfCrossValidationFolds: number =
        +args.numberOfCrossValidationFolds;
    const learnerParameterEpochs: number =
        +args.learnerParameterEpochs;
    const learnerParameterMiniBatchSize: number =
        +args.learnerParameterMiniBatchSize;
    const learnerParameterL1Regularization: number =
        +args.learnerParameterL1Regularization;
    const learnerParameterL2Regularization: number =
        +args.learnerParameterL2Regularization;
    const learnerParameterLossEarlyStopRatio: number =
        +args.learnerParameterLossEarlyStopRatio;
    const learnerParameterLearningRate: number =
        +args.learnerParameterLearningRate;
    const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
        args.learnerParameterToCalculateOverallLossAfterEpoch;
    Utility.debuggingLog(
        `filename=${filename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    Utility.debuggingLog(
        `numberOfCrossValidationFolds=${numberOfCrossValidationFolds}`);
    Utility.debuggingLog(
        `learnerParameterEpochs=${learnerParameterEpochs}`);
    Utility.debuggingLog(
        `learnerParameterMiniBatchSize=${learnerParameterMiniBatchSize}`);
    Utility.debuggingLog(
        `learnerParameterL1Regularization=${learnerParameterL1Regularization}`);
    Utility.debuggingLog(
        `learnerParameterL2Regularization=${learnerParameterL2Regularization}`);
    Utility.debuggingLog(
        `learnerParameterLossEarlyStopRatio=${learnerParameterLossEarlyStopRatio}`);
    Utility.debuggingLog(
        `learnerParameterLearningRate=${learnerParameterLearningRate}`);
    Utility.debuggingLog(
        `learnerParameterToCalculateOverallLossAfterEpoch=${learnerParameterToCalculateOverallLossAfterEpoch}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- const outputModelFilename: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.outputModelFilename;
    // ---- NOTE-TODO-PLACEHOLDER ---- const outputFeaturizerFilename: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.outputFeaturizerFilename;
    // -----------------------------------------------------------------------
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const weightColumnIndex: number = +args.weightColumnIndex;
    const linesToSkip: number = +args.linesToSkip;
    Utility.debuggingLog(
        `labelColumnIndex=${labelColumnIndex}`);
    Utility.debuggingLog(
        `textColumnIndex=${textColumnIndex}`);
    Utility.debuggingLog(
        `weightColumnIndex=${weightColumnIndex}`);
    Utility.debuggingLog(
        `linesToSkip=${linesToSkip}`);
    // -----------------------------------------------------------------------
    const data: Data = await DataUtility.LoadData(
        filename,
        null,
        true,
        filetype,
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        linesToSkip);
    // -----------------------------------------------------------------------
    const crossValidator: CrossValidator =
        mainCrossValidatorWithData(
            data,
            numberOfCrossValidationFolds,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    // -----------------------------------------------------------------------
    const evaluationJsonReportResult: {
        "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
        "outputFilenames": string[],
        } = crossValidator.generateEvaluationJsonReportToFiles(
            outputReportFilenamePrefix);
    const evaluationDataArraysReportResult: {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        } = crossValidator.generateEvaluationDataArraysReportToFiles(
            outputReportFilenamePrefix);
    // -----------------------------------------------------------------------
    const dateTimeEndInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    Utility.debuggingLog(
        `dateTimeBeginInString=${dateTimeBeginInString}`);
    Utility.debuggingLog(
        `dateTimeEndInString=${dateTimeEndInString}`);
    // -----------------------------------------------------------------------
    return { evaluationJsonReportResult, evaluationDataArraysReportResult };
}

if (require.main === module) {
    mainCrossValidator().then(() => { return; });
}
