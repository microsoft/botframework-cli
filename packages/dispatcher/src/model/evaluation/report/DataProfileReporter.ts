/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { AbstractBaseDataProfileEvaluator } from "../abstract_base_evaluator/AbstractBaseDataProfileEvaluator";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ListArrayUtility } from "../../../utility/ListArrayUtility";

import { Data } from "../../../data/Data";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { Utility } from "../../../utility/Utility";

export class DataProfileReporter extends AbstractBaseDataProfileEvaluator {

    constructor(
        data: Data) {
        super(data);
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const outputEvaluationReportLabelDistributionDataArrays: string[][] = [];
            const intentInstanceIndexMapArray: Map<string, number[]> =
                this.getData().getIntentInstanceIndexMapArray();
            for (const entry of intentInstanceIndexMapArray.entries()) {
                const entryKey: string = entry[0];
                const entryValueLength: number = entry[1].length;
                outputEvaluationReportLabelDistributionDataArrays.push([entryKey, entryValueLength.toString()]);
            }
            outputEvaluationReportDataArrays.DataProfileIntentLabelDistribution =
                outputEvaluationReportLabelDistributionDataArrays;
        }
        {
            const outputEvaluationReportLabelDistributionDataArrays: string[][] = [];
            const entityTypeInstanceIndexMapArray: Map<string, number[]> =
                this.getData().getEntityTypeInstanceIndexMapArray();
            for (const entry of entityTypeInstanceIndexMapArray.entries()) {
                const entryKey: string = entry[0];
                const entryValueLength: number = entry[1].length;
                outputEvaluationReportLabelDistributionDataArrays.push([entryKey, entryValueLength.toString()]);
            }
            outputEvaluationReportDataArrays.DataProfileEntityTypeLabelDistribution =
                outputEvaluationReportLabelDistributionDataArrays;
        }
        return outputEvaluationReportDataArrays;
    }
    public generateEvaluationDataArraysReportToFiles(
        outputReportFilenamePrefix: string,
        outputDataArraryHeaders: string[] = [],
        columnDelimiter: string = "\t",
        recordDelimiter: string = "\n",
        encoding: string = "utf8",
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}):
        IDictionaryStringIdGenericArrays<string> {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_DataProfileIntentLabelDistribution.txt`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.DataProfileIntentLabelDistribution,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        {
            const outputFilename: string =
                `${outputReportFilenamePrefix}_DataProfileEntityTypeLabelDistribution.txt`;
            Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.DataProfileEntityTypeLabelDistribution,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
        }
        return outputEvaluationReportDataArrays;
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any>= {}):
        IDictionaryStringIdGenericValue<any> {
        // ---- NOTE: nothing to report here.
        return outputEvaluationReportJson;
    }

    public generateEvaluationDirectReport(): IDictionaryStringIdGenericValue<string> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationDirectReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string,
        outputEvaluationReportDirect: IDictionaryStringIdGenericValue<string> = {}):
        IDictionaryStringIdGenericValue<string> {
        // ---- NOTE: nothing to report here.
        return outputEvaluationReportDirect;
    }
}
