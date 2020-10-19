/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { ThresholdReporter } from "../report/ThresholdReporter";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

import { Utility } from "../../../Utility/Utility";

import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

export function mainThresholdReporter(): void {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppThresholdReporter",
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
            defaultValue: "",
            help: "an input label file",
            required: false,
        },
    );
    parser.addArgument(
        ["-x", "--featurizerFilename"],
        {
            defaultValue: "",
            help: "serialized featurizer file, we can use the label information from a featurizer if provided",
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
            defaultValue: -1,
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
    const featurizerFilename: string =
        args.featurizerFilename;
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ---- if (!Utility.exists(featurizerFilename)) {
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ----     Utility.debuggingThrow(
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ----         `The input featurizer file ${featurizerFilename}` +
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ----         ` does not exist! ` +
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ----         `process.cwd()=${process.cwd()}`);
    // ---- NOTE-MAY-NOT-NEED-A-FEATURIZER-FOR-labelMap ---- }
    let outputReportFilenamePrefix: string = args.outputReportFilenamePrefix;
    if (Utility.isEmptyString(outputReportFilenamePrefix)) {
        outputReportFilenamePrefix = Utility.getFilenameWithoutExtension(scoreFilename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    Utility.debuggingLog(
        `scoreFilename=${scoreFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
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
    let labels: string[] = [];
    let labelMap: Map<string, number> = new  Map<string, number>();
    if (!Utility.isEmptyString(labelFilename)) {
        const labelsAndLabelMap: { "stringArray": string[], "stringMap": Map<string, number> } =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArrayFile(labelFilename);
        labels = labelsAndLabelMap.stringArray;
        labelMap = labelsAndLabelMap.stringMap;
    }
    // -----------------------------------------------------------------------
    const thresholdReporter: ThresholdReporter =
        new ThresholdReporter(
            "",
            featurizerFilename,
            null,
            null,
            labels,
            labelMap);
    // -----------------------------------------------------------------------
    thresholdReporter.loadScoreFileAndPopulate(
        scoreFilename,
        labelColumnIndex,
        textColumnIndex,
        weightColumnIndex,
        scoreColumnBeginIndex,
        identifierColumnIndex,
        predictedLabelColumnIndex,
        revisedTextColumnIndex,
        lineIndexToStart);
    const evaluationDataArraysReportResult: {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        } = thresholdReporter.generateEvaluationDataArraysReportToFiles(
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
    mainThresholdReporter();
}
