/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { ArgumentParser } from "argparse";

import { AutoActiveLearner } from "./AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "../neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../neural_network/learner/SoftmaxRegressionSparse";

import { ColumnarData } from "../../../../data/ColumnarData";
import { LuData } from "../../../../data/LuData";

import { NgramSubwordFeaturizer } from "../../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../../utility/Utility";

export async function exampleFunctionAutoActiveLearnerWithLuContent(
    luContent: string,
    doAutoActiveLearning: boolean =
        AutoActiveLearner.defaultDoAutoActiveLearning,
    aalLimitInitialNumberOfInstancesPerCategory: number =
        AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
    aalNumberOfInstancesPerIteration: number =
        AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
    aalInstanceSelectionThreshold: number =
        AutoActiveLearner.defaultAalInstanceSelectionThreshold,
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
        true):
    Promise<{
        "newLuData": LuData,
        "learner": SoftmaxRegressionSparse,
        }> {
    // -----------------------------------------------------------------------
    const luData: LuData =
        await LuData.createLuData(
            luContent,
            new NgramSubwordFeaturizer());
    // -----------------------------------------------------------------------
    const results =
        luData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
        results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    const remainingUtteranceIndexSet: Set<number> =
        results.remainingUtteranceIndexSet;
    Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
        `${Utility.setToJsonSerialization(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet=` +
        `${Utility.setToJsonSerialization(remainingUtteranceIndexSet)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!doAutoActiveLearning) {
        aalLimitInitialNumberOfInstancesPerCategory = -1;
    }
    const resultsInitialSampling =
        luData.collectUtteranceIndexSetSeedingIntentTrainingSet(
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            remainingUtteranceIndexSet,
            aalLimitInitialNumberOfInstancesPerCategory);
    const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const candidateUtteranceIndexSetSampled: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetSampled;
    const candidateUtteranceIndexSetRemaining: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetSampled)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetRemaining)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
        `${candidateUtteranceIndexSetSampled.size}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
        `${candidateUtteranceIndexSetRemaining.size}`);
    const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    const seedingUtteranceIndexArray: number[] =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
        `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
    const intentLabelIndexArray: number[] =
        luData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        luData.getUtteranceFeatureIndexArrays();
    const autoActiveLearner: AutoActiveLearner =
        new AutoActiveLearner(
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const learned: {
        "seedingInstanceIndexArray": number[],
        "learner": SoftmaxRegressionSparse,
        } = autoActiveLearner.learn(
        luData.getFeaturizerLabels(),
        luData.getFeaturizerLabelMap(),
        luData.getFeaturizer().getNumberLabels(),
        luData.getFeaturizer().getNumberFeatures(),
        intentLabelIndexArray,
        utteranceFeatureIndexArrays,
        seedingUtteranceIndexArray,
        Array.from(candidateUtteranceIndexSetRemaining));
    const aalSampledInstanceIndexArray: number[] =
        learned.seedingInstanceIndexArray;
    const learner: SoftmaxRegressionSparse =
        learned.learner;
    const newLuData: LuData = await LuData.createLuDataFromFilteringExistingLuDataUtterances(
        luData,
        new Set<number>(aalSampledInstanceIndexArray));
    return { newLuData, learner };
    // -----------------------------------------------------------------------
}

export function exampleFunctionAutoActiveLearnerWithColumnarContent(
    columnarContent: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    linesToSkip: number,
    doAutoActiveLearning: boolean =
        AutoActiveLearner.defaultDoAutoActiveLearning,
    aalLimitInitialNumberOfInstancesPerCategory: number =
        AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
    aalNumberOfInstancesPerIteration: number =
        AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
    aalInstanceSelectionThreshold: number =
        AutoActiveLearner.defaultAalInstanceSelectionThreshold,
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
        true): {
        "newColumnarData": ColumnarData,
        "learner": SoftmaxRegressionSparse,
        } {
    // -----------------------------------------------------------------------
    const columnarData: ColumnarData =
        ColumnarData.createColumnarData(
            columnarContent,
            new NgramSubwordFeaturizer(),
            labelColumnIndex,
            textColumnIndex,
            linesToSkip);
    // -----------------------------------------------------------------------
    const results =
        columnarData.collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels();
    const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        results.smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels;
    const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
        results.smallUtteranceIndexSetCoveringAllIntentEntityLabels;
    const remainingUtteranceIndexSet: Set<number> =
        results.remainingUtteranceIndexSet;
    Utility.debuggingLog(`smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels=` +
        `${Utility.setToJsonSerialization(smallUtteranceIndexSetCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet=` +
        `${Utility.setToJsonSerialization(remainingUtteranceIndexSet)}`);
    Utility.debuggingLog(`smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
    Utility.debuggingLog(`remainingUtteranceIndexSet.size=` +
        `${remainingUtteranceIndexSet.size}`);
    // -------------------------------------------------------------------
    if (!doAutoActiveLearning) {
        aalLimitInitialNumberOfInstancesPerCategory = -1;
    }
    const resultsInitialSampling =
        columnarData.collectUtteranceIndexSetSeedingIntentTrainingSet(
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            remainingUtteranceIndexSet,
            aalLimitInitialNumberOfInstancesPerCategory);
    const seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
        resultsInitialSampling.seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels;
    const candidateUtteranceIndexSetSampled: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetSampled;
    const candidateUtteranceIndexSetRemaining: Set<number> =
        resultsInitialSampling.candidateUtteranceIndexSetRemaining;
    Utility.debuggingLog(`seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${Utility.stringMapSetToJson(seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetSampled)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining=` +
        `${Utility.setToJsonSerialization(candidateUtteranceIndexSetRemaining)}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetSampled.size=` +
        `${candidateUtteranceIndexSetSampled.size}`);
    Utility.debuggingLog(`candidateUtteranceIndexSetRemaining.size=` +
        `${candidateUtteranceIndexSetRemaining.size}`);
    const countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: number =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number, entry: [string, Set<number>]) => accumulation + entry[1].size, 0);
    Utility.debuggingLog(`countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels=` +
        `${countSeedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels}`);
    // -------------------------------------------------------------------
    const seedingUtteranceIndexArray: number[] =
        [...seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels].reduce(
            (accumulation: number[], entry: [string, Set<number>]) => accumulation.concat(Array.from(entry[1])), []);
    Utility.debuggingLog(`seedingUtteranceIndexArray.length=` +
        `${seedingUtteranceIndexArray.length}`);
    // -------------------------------------------------------------------
    const intentLabelIndexArray: number[] =
        columnarData.getIntentLabelIndexArray();
    const utteranceFeatureIndexArrays: number[][] =
        columnarData.getUtteranceFeatureIndexArrays();
    const autoActiveLearner: AutoActiveLearner =
        new AutoActiveLearner(
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
    const learned: {
        "seedingInstanceIndexArray": number[],
        "learner": SoftmaxRegressionSparse,
        } = autoActiveLearner.learn(
        columnarData.getFeaturizerLabels(),
        columnarData.getFeaturizerLabelMap(),
        columnarData.getFeaturizer().getNumberLabels(),
        columnarData.getFeaturizer().getNumberFeatures(),
        intentLabelIndexArray,
        utteranceFeatureIndexArrays,
        seedingUtteranceIndexArray,
        Array.from(candidateUtteranceIndexSetRemaining));
    const aalSampledInstanceIndexArray: number[] =
        learned.seedingInstanceIndexArray;
    const learner: SoftmaxRegressionSparse =
        learned.learner;
    const newColumnarData: ColumnarData =  ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
        columnarData,
        labelColumnIndex,
        textColumnIndex,
        linesToSkip,
        new Set<number>(aalSampledInstanceIndexArray));
    return { newColumnarData, learner };
    // -----------------------------------------------------------------------
}

export async function exampleFunctionAutoActiveLearner(): Promise<void> {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "app_auto_active_learning",
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
        ["-m", "--outputModelFilename"],
        {
            help: "output serialized model file",
            required: false,
        },
    );
    parser.addArgument(
        ["-x", "--outputFeaturizerFilename"],
        {
            help: "output serialized featurizer file",
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
        ["-aal", "--doAutoActiveLearning"],
        {
            defaultValue: AutoActiveLearner.defaultDoAutoActiveLearning,
            help: "whether to activate auto active learning or not",
            required: false,
        },
    );
    parser.addArgument(
        ["-aali", "--aalLimitInitialNumberOfInstancesPerCategory"],
        {
            defaultValue: AutoActiveLearner.defaultAalLimitInitialNumberOfInstancesPerCategory,
            help: "initial number of data instances per category for auto active learning",
            required: false,
        },
    );
    parser.addArgument(
        ["-aaln", "--aalNumberOfInstancesPerIteration"],
        {
            defaultValue: AutoActiveLearner.defaultAalNumberOfInstancesPerIteration,
            help: "number of data instances per iteration for auto active learning",
            required: false,
        },
    );
    parser.addArgument(
        ["-aalt", "--aalInstanceSelectionThreshold"],
        {
            defaultValue: AutoActiveLearner.defaultAalInstanceSelectionThreshold,
            help: "prediction threshold for selecting a new training instance from a candidate set",
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
    let outputFilename: string = args.outputFilename;
    if (outputFilename == null) {
        outputFilename = filename + ".json";
    }
    const doAutoActiveLearning: boolean =
        args.doAutoActiveLearning;
    const aalLimitInitialNumberOfInstancesPerCategory: number =
        +args.aalLimitInitialNumberOfInstancesPerCategory;
    const aalNumberOfInstancesPerIteration: number =
        +args.aalNumberOfInstancesPerIteration;
    const aalInstanceSelectionThreshold: number =
        +args.aalInstanceSelectionThreshold;
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
        `doAutoActiveLearning=${doAutoActiveLearning}`);
    Utility.debuggingLog(
        `aalLimitInitialNumberOfInstancesPerCategory=${aalLimitInitialNumberOfInstancesPerCategory}`);
    Utility.debuggingLog(
        `aalNumberOfInstancesPerIteration=${aalNumberOfInstancesPerIteration}`);
    Utility.debuggingLog(
        `aalInstanceSelectionThreshold=${aalInstanceSelectionThreshold}`);
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
    const outputModelFilename: string =
        args.outputModelFilename;
    const outputFeaturizerFilename: string =
        args.outputFeaturizerFilename;
    const content: string =
        Utility.loadFile(filename);
    if (filename.endsWith(".lu")) {
        const aalResult: {
            "newLuData": LuData,
            "learner": SoftmaxRegressionSparse,
            } = await exampleFunctionAutoActiveLearnerWithLuContent(
            content,
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
            learnerParameterToCalculateOverallLossAfterEpoch);
        const luData: LuData =
            aalResult.newLuData;
        const learner: SoftmaxRegressionSparse =
            aalResult.learner;
        luData.dumpLuJsonStructure(
            outputFilename, undefined, 4);
        if (!Utility.isEmptyString(outputModelFilename)) {
            Utility.dumpFile(
                outputModelFilename,
                learner.serializeToJsonString(undefined, 4));
        }
        if (!Utility.isEmptyString(outputFeaturizerFilename)) {
            Utility.dumpFile(
                outputFeaturizerFilename,
                luData.getFeaturizer().serializeToJsonString(undefined, 4));
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
        const aalResult: {
            "newColumnarData": ColumnarData,
            "learner": SoftmaxRegressionSparse,
            }  = exampleFunctionAutoActiveLearnerWithColumnarContent(
            content,
            labelColumnIndex,
            textColumnIndex,
            linesToSkip,
            doAutoActiveLearning,
            aalLimitInitialNumberOfInstancesPerCategory,
            aalNumberOfInstancesPerIteration,
            aalInstanceSelectionThreshold,
            learnerParameterEpochs,
            learnerParameterMiniBatchSize,
            learnerParameterL1Regularization,
            learnerParameterL2Regularization,
            learnerParameterLossEarlyStopRatio,
            learnerParameterLearningRate,
             learnerParameterToCalculateOverallLossAfterEpoch);
        const columnarData: ColumnarData =
            aalResult.newColumnarData;
        const learner: SoftmaxRegressionSparse =
            aalResult.learner;
        columnarData.dumpLuJsonStructure(
            outputFilename, undefined, 4);
        if (!Utility.isEmptyString(outputModelFilename)) {
            Utility.dumpFile(
                outputModelFilename,
                learner.serializeToJsonString(undefined, 4));
        }
        if (!Utility.isEmptyString(outputFeaturizerFilename)) {
            Utility.dumpFile(
                outputFeaturizerFilename,
                columnarData.getFeaturizer().serializeToJsonString(undefined, 4));
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
    exampleFunctionAutoActiveLearner().then(() => { return; });
}
