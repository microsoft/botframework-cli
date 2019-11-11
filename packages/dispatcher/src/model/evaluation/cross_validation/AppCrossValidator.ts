/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ArgumentParser } from "argparse";

import { CrossValidator } from "./CrossValidator";

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

// import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";

import { ColumnarData } from "../../../data/ColumnarData";

import { LuData } from "../../../data/LuData";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

export async function exampleFunctionCrossValidatorWithLuContent(
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
        true): Promise<ConfusionMatrix> {
    // -----------------------------------------------------------------------
    const luData: LuData =
        await LuData.createLuData(
            luContent,
            new NgramSubwordFeaturizer());
    // -----------------------------------------------------------------------
    // const results =
    //     luData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    // const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
    //     results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    // const remainingUtteranceIndexSet: Set<number> =
    //     results.remainingUtteranceIndexSet;
    // Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
    //     `${Utility.setToJson(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet=` +
    //     `${Utility.setToJson(remainingUtteranceIndexSet)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
    //     `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // const resultsInitialSampling =
    //     luData.collectUtteranceIndexSetSeedingIntentTrainingSet(
    //         smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
    //         remainingUtteranceIndexSet,
    //         numberOfCrossValidationFolds);
    // const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const candidateUtteranceIndexSetSampled: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetSampled;
    // const candidateUtteranceIndexSetRemaining: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    // Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetSampled)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetRemaining)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
    //     `${candidateUtteranceIndexSetSampled.size}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
    //     `${candidateUtteranceIndexSetRemaining.size}`);
    // const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    // Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    // const seedingUtteranceIndexArray: number[] =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    // Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
    //     `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
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
    const confusionMatrixCrossValidation: ConfusionMatrix =
        crossValidator.crossValidate(
            luData.getFeaturizerLabels(),
            luData.getFeaturizerLabelMap(),
            luData.getFeaturizer().getNumberLabels(),
            luData.getFeaturizer().getNumberFeatures(),
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            luData.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}`);
    return confusionMatrixCrossValidation;
    // -----------------------------------------------------------------------
}

export function exampleFunctionCrossValidatorWithColumnarContent(
    columnarContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
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
        true): ConfusionMatrix {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            linesToSkip);
    // -----------------------------------------------------------------------
    // const results =
    //     columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    // const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    // const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
    //     results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    // const remainingUtteranceIndexSet: Set<number> =
    //     results.remainingUtteranceIndexSet;
    // Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
    //     `${Utility.setToJson(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet=` +
    //     `${Utility.setToJson(remainingUtteranceIndexSet)}`);
    // Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    // Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
    //     `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!numberOfCrossValidationFolds) {
        numberOfCrossValidationFolds = CrossValidator.defaultNumberOfCrossValidationFolds;
    }
    // const resultsInitialSampling =
    //     columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
    //         smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
    //         remainingUtteranceIndexSet,
    //         numberOfCrossValidationFolds);
    // const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
    //     resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    // const candidateUtteranceIndexSetSampled: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetSampled;
    // const candidateUtteranceIndexSetRemaining: Set<number> =
    //     resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    // Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetSampled)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
    //     `${Utility.setToJson(candidateUtteranceIndexSetRemaining)}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
    //     `${candidateUtteranceIndexSetSampled.size}`);
    // Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
    //     `${candidateUtteranceIndexSetRemaining.size}`);
    // const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    // Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
    //     `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    // const seedingUtteranceIndexArray: number[] =
    //     [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
    //         (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    // Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
    //     `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
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
    const confusionMatrixCrossValidation: ConfusionMatrix =
        crossValidator.crossValidate(
            columnarData.getFeaturizerLabels(),
            columnarData.getFeaturizerLabelMap(),
            columnarData.getFeaturizer().getNumberLabels(),
            columnarData.getFeaturizer().getNumberFeatures(),
            intentLabelIndexArray,
            utteranceFeatureIndexArrays,
            columnarData.getIntentInstanceIndexMapArray());
    Utility.debuggingLog(
        `confusionMatrixCrossValidation.getMicroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getMacroAverageMetrics()}` +
        `,confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()=` +
        `${confusionMatrixCrossValidation.getWeightedMacroAverageMetrics()}`);
    return confusionMatrixCrossValidation;
    // -----------------------------------------------------------------------
}

export async function exampleFunctionCrossValidator(): Promise<void> {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "app_cross_validator",
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
    // parser.addArgument(
    //     ["-m", "--outputModelFilename"],
    //     {
    //         help: "output model file",
    //         required: false,
    //     },
    // );
    // parser.addArgument(
    //     ["-x", "--outputFeaturizerFilename"],
    //     {
    //         help: "output serialized featurizer file",
    //         required: false,
    //     },
    // );
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
    const filename: string =
        args.filename;
    if (!Utility.exists(filename)) {
        Utility.debuggingThrow(
            `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
    }
    let outputFilename: string = args.outputFilename;
    if (outputFilename == null) {
        outputFilename = filename + ".metrics.json";
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
        `outputFilename=${outputFilename}`);
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
    // const outputModelFilename: string =
    //     args.outputModelFilename;
    const content: string =
        Utility.loadFile(filename);
    if (filename.endsWith(".lu")) {
        const confusionMatrixCrossValidation: ConfusionMatrix =
            await exampleFunctionCrossValidatorWithLuContent(
                content,
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        if (!Utility.isEmptyString(outputFilename)) {
            Utility.dumpFile(
                outputFilename,
                JSON.stringify(confusionMatrixCrossValidation, undefined, 4));
        }
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
        const confusionMatrixCrossValidation: ConfusionMatrix =
            exampleFunctionCrossValidatorWithColumnarContent(
                content,
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        if (!Utility.isEmptyString(outputFilename)) {
            Utility.dumpFile(
                outputFilename,
                JSON.stringify(confusionMatrixCrossValidation, undefined, 4));
        }
    }
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
    exampleFunctionCrossValidator().then(() => { return; });
}
