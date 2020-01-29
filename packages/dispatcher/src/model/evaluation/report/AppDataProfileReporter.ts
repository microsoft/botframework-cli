/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ArgumentParser } from "argparse";

// import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ConfusionMatrix } from "../../../mathematics/confusion_matrix/ConfusionMatrix";

import { DataProfileReporter } from "../report/DataProfileReporter";

import { DataUtility } from "../../../data/DataUtility";
import { Data } from "../../../data/Data";

import { Utility } from "../../../utility/Utility";

export function mainDataProfileReporter(): void {
    // -----------------------------------------------------------------------
    const dateTimeBeginInString: string = (new Date()).toISOString();
    // -----------------------------------------------------------------------
    const parser = new ArgumentParser({
        addHelp: true,
        description: "AppDataProfileReporter",
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
        `args=${JSON.stringify(args)}`);
    Utility.debuggingLog(
        `unknownArgs=${JSON.stringify(unknownArgs)}`);
    const debugFlag: boolean = Utility.toBoolean(args.debug);
    Utility.toPrintDebuggingLogToConsole = debugFlag;
    // ---- NOTE-FOR-DEBUGGING ----  console.dir(args);
    // -----------------------------------------------------------------------
    const filename: string =
        args.filename;
    if (!Utility.exists(filename)) {
        Utility.debuggingThrow(
            `The input score file ${filename} does not exist! process.cwd()=${process.cwd()}`);
    }
    const filetype: string =
        args.filetype;
    // ---- NOTE-TODO-PLACEHOLDER ---- const featurizerFilename: string =
    // ---- NOTE-TODO-PLACEHOLDER ----     args.featurizerFilename;
    // ---- NOTE-TODO-PLACEHOLDER ---- if (!Utility.exists(featurizerFilename)) {
    // ---- NOTE-TODO-PLACEHOLDER ----     Utility.debuggingThrow(
    // ---- NOTE-TODO-PLACEHOLDER ----         `The input featurizer file ${featurizerFilename} ` +
    // ---- NOTE-TODO-PLACEHOLDER ----         `does not exist! process.cwd()=${process.cwd()}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- }
    let outputReportFilenamePrefix: string = args.outputReportFilenamePrefix;
    if (Utility.isEmptyString(outputReportFilenamePrefix)) {
        outputReportFilenamePrefix = Utility.getFileBasename(filename);
        // Utility.debuggingThrow(
        //     `The output file ${outputReportFilenamePrefix} is empty! process.cwd()=${process.cwd()}`);
    }
    const labelColumnIndex: number = +args.labelColumnIndex;
    const textColumnIndex: number = +args.textColumnIndex;
    const linesToSkip: number = +args.linesToSkip;
    Utility.debuggingLog(
        `filename=${filename}`);
    // ---- NOTE-TODO-PLACEHOLDER ---- Utility.debuggingLog(
    // ---- NOTE-TODO-PLACEHOLDER ----     `featurizerFilename=${featurizerFilename}`);
    Utility.debuggingLog(
        `outputReportFilenamePrefix=${outputReportFilenamePrefix}`);
    Utility.debuggingLog(
        `labelColumnIndex=${labelColumnIndex}`);
    Utility.debuggingLog(
        `textColumnIndex=${textColumnIndex}`);
    Utility.debuggingLog(
        `linesToSkip=${linesToSkip}`);
    // -----------------------------------------------------------------------
    DataUtility.LoadData(
        filename,
        filetype,
        labelColumnIndex,
        textColumnIndex,
        linesToSkip).then((data) => {
            // ---------------------------------------------------------------
            const thresholdReporter: DataProfileReporter =
                new DataProfileReporter(data);
            // ---------------------------------------------------------------
            thresholdReporter.generateEvaluationDataArraysReportToFiles(outputReportFilenamePrefix);
            // ---------------------------------------------------------------
        });
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
    mainDataProfileReporter();
}
