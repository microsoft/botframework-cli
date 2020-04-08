/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { Tester } from "./Tester";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

// tslint:disable-next-line: max-line-length
// import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

// import { ColumnarData } from "../../../data/ColumnarData";
// import { LuData } from "../../../data/LuData";
import { Data } from "../../../data/Data";
import { DataUtility } from "../../../data/DataUtility";

// import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";
import { LuData } from "../../../data/LuData";
import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";
import { ColumnarData } from "../../../data/ColumnarData";

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
        ["-t", "--filetype"],
        {
            help: "data file type",
            required: false,
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
        `args=${Utility.JSONstringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${Utility.JSONstringify(unknownArgs)}`);
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
        outputReportFilenamePrefix = Utility.getFilenameWithoutExtension(filename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    Utility.debuggingLog(
        `filename=${filename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    Utility.debuggingLog(
        `modelFilename=${modelFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
    // const outputModelFilename: string =
    //     args.outputModelFilename;
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
    const tester: Tester =
        new Tester(
            modelFilename,
            featurizerFilename);
    const featurizer: NgramSubwordFeaturizer =
        tester.getFeaturizer();
    // Utility.debuggingLog(
    //     `featurizer.getLabelMap()=${Utility.JSONstringify(featurizer.getLabelMap())}`);
    // -----------------------------------------------------------------------
    let intentsUtterancesWeights: {
        "intents": string[],
        "utterances": string[],
        "weights": number[] } = {
            intents: [],
            utterances: [],
            weights: [] };
    let intentLabelIndexArray: number[] = [];
    let utteranceFeatureIndexArrays: number[][] = [];
    const data: Data = await DataUtility.LoadData(
        filename,
        featurizer,
        false,
        filetype,
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        linesToSkip);
    intentsUtterancesWeights = data.getIntentsUtterancesWeights();
    intentLabelIndexArray = data.getIntentLabelIndexArray();
    utteranceFeatureIndexArrays = data.getUtteranceFeatureIndexArrays();
    // -----------------------------------------------------------------------
    tester.test(
        intentsUtterancesWeights.intents,
        intentsUtterancesWeights.utterances,
        intentsUtterancesWeights.weights,
        intentLabelIndexArray,
        utteranceFeatureIndexArrays);
    // -----------------------------------------------------------------------
    const evaluationJsonReportResult: {
        "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
        "outputFilenames": string[],
        } = tester.generateEvaluationJsonReportToFiles(
            outputReportFilenamePrefix);
    const evaluationDataArraysReportResult: {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        } = tester.generateEvaluationDataArraysReportToFiles(
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
    mainTester();
}
