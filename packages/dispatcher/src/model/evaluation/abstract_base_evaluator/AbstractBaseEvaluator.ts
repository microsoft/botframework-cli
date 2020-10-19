/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";

import { Utility } from "../../../utility/Utility";

export abstract class AbstractBaseEvaluator {

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        return {};
    }
    public abstract generateEvaluationDataArraysReportToFiles(
        outputReportFilenamePrefix: string,
        outputDataArraryHeaders: string[],
        columnDelimiter: string,
        recordDelimiter: string,
        encoding: string,
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string>): {
            "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
            "outputFilenames": string[],
            };

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        return {};
    }
    public abstract generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string,
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any>): {
            "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
            "outputFilenames": string[],
            };

    public generateEvaluationDirectReport(): IDictionaryStringIdGenericValue<string> {
        return {};
    }
    public abstract generateEvaluationDirectReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string,
        outputEvaluationReportDirect: IDictionaryStringIdGenericValue<string>):
        IDictionaryStringIdGenericValue<string>;

    public dumpEvaluationJsonReportToFile(
        outputReportFilename: string,
        outputReportContent: any,
        encoding: string): string {
        if (Utility.isEmptyString(outputReportFilename)) {
            Utility.debuggingThrow("outputReportFilename is empty");
        }
        return Utility.dumpFile(
            outputReportFilename,
            Utility.jsonStringify(outputReportContent),
            encoding);
    }
    public dumpEvaluationDirectReportToFile(
        outputReportFilename: string,
        outputReportContent: any,
        encoding: string): string {
        if (Utility.isEmptyString(outputReportFilename)) {
            Utility.debuggingThrow("outputReportFilename is empty");
        }
        return Utility.dumpFile(
            outputReportFilename,
            outputReportContent,
            encoding);
    }
}
