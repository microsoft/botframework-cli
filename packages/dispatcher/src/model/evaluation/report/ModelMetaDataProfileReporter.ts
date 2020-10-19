/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { AbstractBaseModelFeaturizerEvaluator } from "../abstract_base_evaluator/AbstractBaseModelFeaturizerEvaluator";

import { BinaryConfusionMatrix } from "../../../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ListArrayUtility } from "../../../utility/ListArrayUtility";

import { Data } from "../../../data/Data";

import { IDictionaryStringIdGenericArrays } from "../../../data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericValue } from "../../../data_structure/IDictionaryStringIdGenericValue";
import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { Utility } from "../../../Utility/Utility";

export class ModelMetaDataProfileReporter extends AbstractBaseModelFeaturizerEvaluator {

    constructor(
        modelFilename: string,
        featurizerFilename: string,
        modelNullable: SoftmaxRegressionSparse|null,
        featurizerNullable: NgramSubwordFeaturizer|null,
        labels: string[],
        labelMap: Map<string, number>) {
        super(
            modelFilename,
            featurizerFilename,
            modelNullable,
            featurizerNullable,
            labels,
            labelMap);
    }

    public generateEvaluationDataArraysReport(): IDictionaryStringIdGenericArrays<string> {
        const outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {};
        {
            const outputEvaluationReportDataArraysLabelBiases: string[][] = [];
            const labels: string[] =
                this.getLabels();
            const modelBiases: number[] =
                this.getModel().getModelBiases();
            for (let labelIndex: number = 0; labelIndex < modelBiases.length; labelIndex++) {
                const label: string = labels[labelIndex];
                const bias: number = modelBiases[labelIndex];
                outputEvaluationReportDataArraysLabelBiases.push([label, bias.toString()]);
            }
            outputEvaluationReportDataArrays.ModelMetaDataProfileLabelBiases =
                outputEvaluationReportDataArraysLabelBiases;
        }
        return outputEvaluationReportDataArrays;
    }
    public generateEvaluationDataArraysReportToFiles(
        outputReportFilenamePrefix: string,
        outputDataArraryHeaders: string[] = [],
        columnDelimiter: string = "\t",
        recordDelimiter: string = "\n",
        encoding: string = "utf8",
        outputEvaluationReportDataArrays: IDictionaryStringIdGenericArrays<string> = {}): {
            "outputEvaluationReportDataArrays": IDictionaryStringIdGenericArrays<string>,
            "outputFilenames": string[],
            } {
        if (DictionaryMapUtility.isEmptyStringIdGenericArraysDictionary(outputEvaluationReportDataArrays)) {
            outputEvaluationReportDataArrays =
                this.generateEvaluationDataArraysReport();
        }
        {
            let outputFilename: string =
                `${outputReportFilenamePrefix}_ModelMetaDataProfileLabelBiases.txt`;
            outputFilename = Utility.storeDataArraysToTsvFile(
                outputFilename,
                outputEvaluationReportDataArrays.ModelMetaDataProfileLabelBiases,
                outputDataArraryHeaders,
                columnDelimiter,
                recordDelimiter,
                encoding);
            const outputFilenames: string[] =
                [outputFilename];
            return { outputEvaluationReportDataArrays, outputFilenames };
        }
    }

    public generateEvaluationJsonReport(): IDictionaryStringIdGenericValue<any> {
        return {}; // ---- NOTE: nothing to report here.
    }
    public generateEvaluationJsonReportToFiles(
        outputReportFilenamePrefix: string,
        encoding: string = "utf8",
        outputEvaluationReportJson: IDictionaryStringIdGenericValue<any>= {}): {
            "outputEvaluationReportJson": IDictionaryStringIdGenericValue<any>,
            "outputFilenames": string[],
            } {
        const outputFilenames: string[] = [];
        // ---- NOTE: nothing to report here.
        return {
            outputEvaluationReportJson,
            outputFilenames,
            };
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
