/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";
import { ConfusionMatrix } from "./ConfusionMatrix";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { Utility } from "../../utility/Utility";

export function mainConfusionMatrixFunction(
    scoreFilename: string,
    labelFilename: string,
    labelColumnIndex: number,
    textColumnIndex: number,
    weightColumnIndex: number,
    identifierColumnIndex: number,
    scoreColumnBeginIndex: number,
    predictedLabelColumnIndex: number,
    revisedTextColumnIndex: number,
    lineIndexToStart: number): {
        "labels": string[],
        "labelMap": Map<string, number>,
        "binaryConfusionMatrices": BinaryConfusionMatrix[],
        "confusionMatrix": ConfusionMatrix } {
    // -----------------------------------------------------------------------
    if (Utility.isEmptyString(scoreFilename)) {
        throw new Error("scoreFilename is empty");
    }
    if (Utility.isEmptyString(labelFilename)) {
        throw new Error("labelFilename is empty");
    }
    // -----------------------------------------------------------------------
    let labels: string[] = [];
    let labelMap: Map<string, number> = new  Map<string, number>();
    if (!Utility.isEmptyString(labelFilename)) {
        const labelsAndLabelMap: { "stringArray": string[], "stringMap": Map<string, number> } =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArrayFile(labelFilename);
        labels = labelsAndLabelMap.stringArray;
        labelMap = labelsAndLabelMap.stringMap;
    }
    if (Utility.isEmptyStringArray(labels)) {
        throw new Error("labels is empty");
    }
    // -----------------------------------------------------------------------
    const confusionMatrix = new ConfusionMatrix(labels, labelMap);
    // -----------------------------------------------------------------------
    const scoreDataStructure: {
        "labels": string[],
        "texts": string[],
        "weights": number[],
        "identifiers": string[],
        "scoreArrays": number[][],
        "predictedLabels": string[],
        "revisedTexts": string[] } =
        Utility.loadLabelTextScoreFile(
            scoreFilename,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            scoreColumnBeginIndex,
            labels.length,
            identifierColumnIndex,
            predictedLabelColumnIndex,
            revisedTextColumnIndex,
            lineIndexToStart);
    const numberInstances: number = scoreDataStructure.labels.length;
    let numberMatches: number = 0;
    for (let i = 0; i < numberInstances; i++) {
        const label: string = scoreDataStructure.labels[i];
        // const text: string = scoreDataStructure.texts[i];
        // const weight: number  = scoreDataStructure.weights[i];
        // const identifier: string = scoreDataStructure.identifiers[i];
        // const scoreArray: number[] = scoreDataStructure.scoreArrays[i];
        // const labelId: number = labelMap[label];
        // const weight: number = scoreDataStructure.weights[i];
        const predictedLabel: string = scoreDataStructure.predictedLabels[i];
        // const revisedText: string = scoreDataStructure.revisedTexts[i];
        // Utility.debuggingLog(
        //     "label=" + label);
        // Utility.debuggingLog(
        //     "predictedLabel=" + predictedLabel);
        if (label === predictedLabel) {
            numberMatches++;
        }
        confusionMatrix.addInstanceByLabel(label, predictedLabel);
    }
    // -----------------------------------------------------------------------
    Utility.debuggingLog(
        "numberMatches=" + numberMatches);
    Utility.debuggingLog(
        "numberInstances=" + numberInstances);
    Utility.debuggingLog(
        "accuracy=" + numberMatches / numberInstances);
    // -----------------------------------------------------------------------
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
    Utility.debuggingLog(
        Utility.jsonStringify(confusionMatrix.getLabelMap()));
    Utility.debuggingLog(
        "rows=" + confusionMatrix.getConfusionMatrixRows());
    Utility.debuggingLog(
        "columns=" + confusionMatrix.getConfusionMatrixColumns());
    Utility.debuggingLog(
        "total=" + confusionMatrix.getConfusionMatrixTotal());
    const binaryConfusionMatrices: BinaryConfusionMatrix[] = confusionMatrix.getBinaryConfusionMatrices();
    const confusionMatrixLabels: string[] = confusionMatrix.getLabels();
    for (let i = 0; i < binaryConfusionMatrices.length; i++) {
        const binaryConfusionMatrix = binaryConfusionMatrices[i];
        const label: string = confusionMatrixLabels[i];
        Utility.debuggingLog(
            label + ":" + i + ", precision = " + binaryConfusionMatrix.getPrecision());
        Utility.debuggingLog(
            label + ":" + i + ", recall    = " + binaryConfusionMatrix.getRecall());
        Utility.debuggingLog(
            label + ":" + i + ", F1        = " + binaryConfusionMatrix.getF1Score());
        Utility.debuggingLog(
            label + ":" + i + ", support   = " + binaryConfusionMatrix.getSupport());
        Utility.debuggingLog(
            label + ":" + i + ", total     = " + binaryConfusionMatrix.getTotal());
    }
    Utility.debuggingLog(
        "micro-quantile metrics = " + confusionMatrix.getMicroQuantileMetrics());
    Utility.debuggingLog(
        "macro-quantile metrics = " + confusionMatrix.getMacroQuantileMetrics());
    Utility.debuggingLog(
        "micro-average metrics = " + confusionMatrix.getMicroAverageMetrics());
    Utility.debuggingLog(
        "summation-micro-average metrics = " + confusionMatrix.getSummationMicroAverageMetrics());
    Utility.debuggingLog(
        "macro-average metrics = " + confusionMatrix.getMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-macro-average metrics = " + confusionMatrix.getSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-summation-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "weighted-macro-average metrics = " + confusionMatrix.getWeightedMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-weighted-macro-average metrics = " + confusionMatrix.getSummationWeightedMacroAverageMetrics());
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
    // -----------------------------------------------------------------------
    return {
        labels,
        labelMap,
        binaryConfusionMatrices,
        confusionMatrix };
    // -----------------------------------------------------------------------
}
export function mainConfusionMatrix(): void {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppConfusionMatrix",
        version: "0.0.1",
    });
    parser.addArgument(
        ["-f", "--scoreFilename"],
        {
            help: "an input score file",
            required: true,
        },
    );
    parser.addArgument(
        ["-si", "--scoreColumnBeginIndex"],
        {
            help: "score column begin index",
            required: true,
        },
    );
    parser.addArgument(
        ["-l", "--labelFilename"],
        {
            help: "an input label file",
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
        ["-ii", "--identifierColumnIndex"],
        {
            defaultValue: 2,
            help: "identifier column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-pli", "--predictedLabelColumnIndex"],
        {
            defaultValue: -1,
            help: "predicted label column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-rti", "--revisedTextColumnIndex"],
        {
            defaultValue: -1,
            help: "revised text/utterance column index",
            required: false,
        },
    );
    parser.addArgument(
        ["-ls", "--lineIndexToStart"],
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
    const scoreFilename: string =
        args.scoreFilename;
    if (!Utility.exists(scoreFilename)) {
        Utility.debuggingThrow(
            `The input score file ${scoreFilename} does not exist! process.cwd()=${process.cwd()}`);
    }
    let outputReportFilenamePrefix: string = args.outputReportFilenamePrefix;
    if (Utility.isEmptyString(outputReportFilenamePrefix)) {
        outputReportFilenamePrefix = Utility.getFilenameWithoutExtension(scoreFilename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    Utility.debuggingLog(
        `scoreFilename=${scoreFilename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    // -----------------------------------------------------------------------
    const labelFilename: string =
        args.labelFilename;
    Utility.debuggingLog(
        `labelFilename=${labelFilename}`);
    // -----------------------------------------------------------------------
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const weightColumnIndex: number = +args.weightColumnIndex;
    const identifierColumnIndex: number = +args.identifierColumnIndex;
    const scoreColumnBeginIndex: number = +args.scoreColumnBeginIndex;
    const predictedLabelColumnIndex: number = +args.predictedLabelColumnIndex;
    const revisedTextColumnIndex: number = +args.revisedTextColumnIndex;
    const lineIndexToStart: number = +args.lineIndexToStart;
    Utility.debuggingLog(
        `labelColumnIndex=${labelColumnIndex}`);
    Utility.debuggingLog(
        `textColumnIndex=${textColumnIndex}`);
    Utility.debuggingLog(
        `weightColumnIndex=${weightColumnIndex}`);
    Utility.debuggingLog(
        `identifierColumnIndex=${identifierColumnIndex}`);
    Utility.debuggingLog(
        `scoreColumnBeginIndex=${scoreColumnBeginIndex}`);
    Utility.debuggingLog(
        `predictedLabelColumnIndex=${predictedLabelColumnIndex}`);
    Utility.debuggingLog(
        `revisedTextColumnIndex=${revisedTextColumnIndex}`);
    Utility.debuggingLog(
        `lineIndexToStart=${lineIndexToStart}`);
    // -----------------------------------------------------------------------
    const mainConfusionMatrixFunctionResult: {
        "labels": string[],
        "labelMap": Map<string, number>,
        "confusionMatrix": ConfusionMatrix } = mainConfusionMatrixFunction(
        scoreFilename,
        labelFilename,
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        identifierColumnIndex,
        scoreColumnBeginIndex,
        predictedLabelColumnIndex,
        revisedTextColumnIndex,
        lineIndexToStart);
    // -----------------------------------------------------------------------
    const dateTimeEndInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    Utility.debuggingLog(
        `dateTimeBeginInString=${dateTimeBeginInString}`);
    Utility.debuggingLog(
        `dateTimeEndInString=${dateTimeEndInString}`);
    // -----------------------------------------------------------------------
}

export function exampleFunctionConfusionMatrix(): void {
    const labels: string[] = [ "label0", "label1", "label2" ];
    const labelMap: Map<string, number> = new Map<string, number>();
    labelMap.set("label0", 0);
    labelMap.set("label1", 1);
    labelMap.set("label2", 2);
    const confusionMatrix = new ConfusionMatrix(labels, labelMap);
    confusionMatrix.addInstanceByLabel("label0", "label0");
    confusionMatrix.addInstanceByLabel("label0", "label1");
    confusionMatrix.addInstanceByLabel("label0", "label2");
    confusionMatrix.addInstanceByLabel("label1", "label0");
    confusionMatrix.addInstanceByLabel("label1", "label1");
    confusionMatrix.addInstanceByLabel("label1", "label2");
    confusionMatrix.addInstanceByLabel("label2", "label0");
    confusionMatrix.addInstanceByLabel("label2", "label1");
    confusionMatrix.addInstanceByLabel("label2", "label2");
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
    Utility.debuggingLog(
        Utility.jsonStringify(confusionMatrix.getLabelMap()));
    Utility.debuggingLog(
        "rows=" + confusionMatrix.getConfusionMatrixRows());
    Utility.debuggingLog(
        "columns=" + confusionMatrix.getConfusionMatrixColumns());
    Utility.debuggingLog(
        "total=" + confusionMatrix.getConfusionMatrixTotal());
    const binaryConfusionMatrices = confusionMatrix.getBinaryConfusionMatrices();
    const confusionMatrixLabels: string[] = confusionMatrix.getLabels();
    for (let i = 0; i < binaryConfusionMatrices.length; i++) {
        const binaryConfusionMatrix = binaryConfusionMatrices[i];
        const label: string = confusionMatrixLabels[i];
        Utility.debuggingLog(
            label + ":" + i + ", precision = " + binaryConfusionMatrix.getPrecision());
        Utility.debuggingLog(
            label + ":" + i + ", recall    = " + binaryConfusionMatrix.getRecall());
        Utility.debuggingLog(
            label + ":" + i + ", F1        = " + binaryConfusionMatrix.getF1Score());
        Utility.debuggingLog(
            label + ":" + i + ", support   = " + binaryConfusionMatrix.getSupport());
        Utility.debuggingLog(
            label + ":" + i + ", total     = " + binaryConfusionMatrix.getTotal());
    }
    Utility.debuggingLog(
        "micro-quantile metrics = " + confusionMatrix.getMicroQuantileMetrics());
    Utility.debuggingLog(
        "macro-quantile metrics = " + confusionMatrix.getMacroQuantileMetrics());
    Utility.debuggingLog(
        "micro-average metrics = " + confusionMatrix.getMicroAverageMetrics());
    Utility.debuggingLog(
        "summation-micro-average metrics = " + confusionMatrix.getSummationMicroAverageMetrics());
    Utility.debuggingLog(
        "macro-average metrics = " + confusionMatrix.getMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-macro-average metrics = " + confusionMatrix.getSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelMacroAverageMetrics());
    Utility.debuggingLog(
        "positive-support-label-summation-macro-average metrics = " +
        confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics());
    Utility.debuggingLog(
        "weighted-macro-average metrics = " + confusionMatrix.getWeightedMacroAverageMetrics());
    Utility.debuggingLog(
        "summation-weighted-macro-average metrics = " + confusionMatrix.getSummationWeightedMacroAverageMetrics());
    Utility.debuggingLog(
        "labels=" + confusionMatrix.getLabels());
}

if (require.main === module) {
    mainConfusionMatrix();
    // ---- exampleFunctionConfusionMatrix();
}
