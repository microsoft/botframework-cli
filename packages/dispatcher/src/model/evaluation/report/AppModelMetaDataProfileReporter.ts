/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { ModelMetaDataProfileReporter } from "./ModelMetaDataProfileReporter";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

import { DataUtility } from "../../../data/DataUtility";

import { Data } from "../../../data/Data";

import { Utility } from "../../../Utility/Utility";

export function mainModelMetaDataProfileReporter(): void {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppModelMetaDataProfileReporter",
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
            help: "output report file name",
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
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-li", "--labelColumnIndex"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         defaultValue: 0,
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "label column index",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-ti", "--textColumnIndex"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         defaultValue: 1,
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "text/utterance column index",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-wi", "--weightColumnIndex"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         defaultValue: -1,
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "weight column index",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
    // ---- NOTE-TODO-PLACEHOLDER ---- parser.addArgument(
    // ---- NOTE-TODO-PLACEHOLDER ----     ["-ls", "--linesToSkip"],
    // ---- NOTE-TODO-PLACEHOLDER ----     {
    // ---- NOTE-TODO-PLACEHOLDER ----         defaultValue: 0,
    // ---- NOTE-TODO-PLACEHOLDER ----         help: "number of lines to skip from the input file",
    // ---- NOTE-TODO-PLACEHOLDER ----         required: false,
    // ---- NOTE-TODO-PLACEHOLDER ----     },
    // ---- NOTE-TODO-PLACEHOLDER ---- );
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
    // ---- NOTE-TODO-PLACEHOLDER ---- const filename: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.filename;
    // ---- NOTE-TODO-PLACEHOLDER ---- if (!Utility.exists(filename)) {
    // ---- NOTE-TODO-PLACEHOLDER ----     Utility.debuggingThrow(
    // ---- NOTE-TODO-PLACEHOLDER ----         `The input score file ${filename} does not exist! ` +
    // ---- NOTE-TODO-PLACEHOLDER ----         `process.cwd()=${process.cwd()}`);
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
    // ---- NOTE-TODO-PLACEHOLDER ---- const labelColumnIndex: number = +args.labelColumnIndex;
    // ---- NOTE-TODO-PLACEHOLDER ---- const textColumnIndex: number = +args.textColumnIndex;
    // ---- NOTE-TODO-PLACEHOLDER ---- const weightColumnIndex: number = +args.weightColumnIndex;
    // ---- NOTE-TODO-PLACEHOLDER ---- const linesToSkip: number = +args.linesToSkip;
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `filename=${filename}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `filetype=${filetype}`);
    Utility.debuggingLog(
        `modelFilename=${modelFilename}`);
    Utility.debuggingLog(
        `featurizerFilename=${featurizerFilename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `labelColumnIndex=${labelColumnIndex}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `textColumnIndex=${textColumnIndex}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `weightColumnIndex=${weightColumnIndex}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `linesToSkip=${linesToSkip}`);
    // -----------------------------------------------------------------------
    const modelMetaDataProfileReporter: ModelMetaDataProfileReporter =
        new ModelMetaDataProfileReporter(
            modelFilename,
            featurizerFilename,
            null,
            null,
            [],
            new Map<string, number>());
    // -----------------------------------------------------------------------
    const evaluationDataArraysReportResult: {
        "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
        "outputFilenames": string[],
        } = modelMetaDataProfileReporter.generateEvaluationDataArraysReportToFiles(
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
    mainModelMetaDataProfileReporter();
}
