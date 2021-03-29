/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { Label } from "../../label_structure/Label";
import { PredictionStructureWithPluralEvaluationLabelObject } from "../../label_structure/PredictionStructureWithPluralEvaluationLabelObject";
import { PredictionStructureWithPluralEvaluationLabelString } from "../../label_structure/PredictionStructureWithPluralEvaluationLabelString";

import { IConfusionMatrixBaseMetrics } from "./IConfusionMatrixBaseMetrics";
import { IConfusionMatrixBaseMicroAverageMetrics } from "./IConfusionMatrixBaseMicroAverageMetrics";
import { IConfusionMatrixMeanDerivedMetrics } from "./IConfusionMatrixMeanDerivedMetrics";
import { IConfusionMatrixMeanMetrics } from "./IConfusionMatrixMeanMetrics";
import { IConfusionMatrixQuantileMetrics } from "./IConfusionMatrixQuantileMetrics";
import { IConfusionMatrixSummationMetrics } from "./IConfusionMatrixSummationMetrics";

import { BinaryConfusionMatrix } from "./BinaryConfusionMatrix";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { PerInstanceMultiLabelConfusionMatrix } from "./PerInstanceMultiLabelConfusionMatrix";
import { PerInstanceMultiLabelObjectConfusionMatrix } from "./PerInstanceMultiLabelObjectConfusionMatrix";
import { MultiLabelConfusionMatrix } from "./MultiLabelConfusionMatrix";
import { MultiLabelObjectConfusionMatrix } from "./MultiLabelObjectConfusionMatrix";
import { MultiLabelObjectConfusionMatrixExact } from "./MultiLabelObjectConfusionMatrixExact";
import { MultiLabelObjectConfusionMatrixSubset } from "./MultiLabelObjectConfusionMatrixSubset";

import { Utility } from "../../utility/Utility";

export class UtilityConfusionMatrix {
    public static readonly ColumnNamePerLabel: string =
        "Per-Label";

    public static readonly ColumnNamePerInstance: string =
        "Per-Instance";

    public static readonly ColumnNameMicroAverageRaw: string =
        "Micro-Average";

    public static readonly ColumnNameMicroAverage: string =
        Utility.getBolded(UtilityConfusionMatrix.ColumnNameMicroAverageRaw);

    public static readonly DescriptionMicroAverage: string = `
        This metric follows the micro-average metric defined in
        <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
        The computing process iterates through an array of per-label/per-instance binary confusion matrices and
        calculates the sums of per-label/per-instance "#TruePositives" and per-label/per-instance "Support", respectively.
        The "Support" sum is stored in this row's "Total" field and "#TruePositives" sum in the "#TruePositives" field.
        This metric is then the ratio of the "#TruePositives" sum over "Total."
        `;

    public static readonly ColumnNameMicroFirstQuartile: string =
        Utility.getBolded("Micro-First-Quartile");

    public static readonly DescriptionMicroFirstQuartile: string = `
        Average (or mean) is not a <a href="https://en.wikipedia.org/wiki/Robust_statistics">robust statistics</a> that
        average can be easily influenced by outliers. Therefore, we also compute robust quantile-based metrics in this report.
        For every metric in this row, e.g., precision, the computing process collects the per-label/per-instance precision
        metrics from an array of per-label/per-instance binary confusion matrices, sorts them,
        and then replicates each per-label/per-instance precision by the per-label support.
        It then finds the first quartile of the metric from the expanded metric series.
        These first-quartiles are the metrics' lower bound
        for the top 75% expanded binary confusion matrix entries.
        `;

    public static readonly ColumnNameMicroMedian: string =
        Utility.getBolded("Micro-Median");

    public static readonly DescriptionMicroMedian: string = `
        Similar to the previous row, but metrics in this row are the medians, another robust statistic.
        These medians are the metrics' lower bound
        for the top 50% expanded binary confusion matrix entries.
        `;

    public static readonly ColumnNameMicroThirdQuartile: string =
        "Micro-Third-Quartile";

    public static readonly DescriptionMicroThirdQuartile: string = `
        Similar to the previous rows, but metrics in this row are the third quartiles.
        These third-quartiles are the metrics' lower bound
        for the top 25% expanded binary confusion matrix entries.
        `;

    public static readonly ColumnNameMacroFirstQuartile: string =
        Utility.getBolded("Macro-First-Quartile");

    public static readonly DescriptionMacroFirstQuartile: string = `
        Above three quantile metrics are micro, i.e., they are calcuated on a metric series expanded by supports.
        Macro quantile metrics are calculated on the un-expanded series of metrics.
        The first quartiles are the metrics' lower bound
        for the top 75% binary confusion matrix entries.
        `;

    public static readonly ColumnNameMacroMedian: string =
        Utility.getBolded("Macro-Median");

    public static readonly DescriptionMacroMedian: string = `
        Similar to the previous row, but metrics in this row focuses on median.
        These medians are the metrics' lower bound
        for the top 50% expanded binary confusion matrix entries.
        `;

    public static readonly ColumnNameMacroThirdQuartile: string =
        "Macro-Third-Quartile";

    public static readonly DescriptionMacroThirdQuartile: string = `
        Similar to the previous row, but metrics in this row focuses on the third quartile.
        These third-quartiles are the metrics' lower bound
        for the top 25% expanded binary confusion matrix entries.
        `;

    public static readonly ColumnNameSummationMicroAverageRaw: string =
        `Summation ${UtilityConfusionMatrix.ColumnNameMicroAverageRaw}`;

    public static readonly ColumnNameSummationMicroAverage: string =
        Utility.getBolded(UtilityConfusionMatrix.ColumnNameSummationMicroAverageRaw);

    public static readonly DescriptionSummationMicroAverage: string = `
        The metrics in this row are a little bit different from those of ${UtilityConfusionMatrix.ColumnNameMicroAverage}.
        The computng process first sums up per-label/per-instance "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
        metrics, respectively, uses them to directly construct a binary confusion matrix, and calculates the other metrics, such as
        Precision, Recall, F1, Accuracy, etc.
        `;

    public static readonly ColumnNameMacroAverageRaw: string =
        "Macro-Average";

    public static readonly ColumnNameMacroAverage: string =
        Utility.getBolded(UtilityConfusionMatrix.ColumnNameMacroAverageRaw);

    public static readonly DescriptionMacroAverage: string = `
        This metric follows the macro-average metric defined in
        <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
        The computing process calcuates simple arithmetic means of the per-label/per-instance Precision, Recall, F1, and Accuracy
        metrics, repectively, from a series of binary confusion matrices.
        `;

    public static readonly ColumnNameSummationMacroAverage: string =
        `Summation ${UtilityConfusionMatrix.ColumnNameMacroAverageRaw}`;

    public static readonly DescriptionSummationMacroAverage: string = `
        The calculating process for the metrics in this row is a little bit different from ${UtilityConfusionMatrix.ColumnNameMacroAverage}.
        It first calculates the averages of per-label/per-instance "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
        metrics, respectively, uses them to directly construct a binary confusion matrix, and calculates the other metrics, such as
        Precision, Recall, F1, Accuracy, etc.
        `;

    public static readonly ColumnNamePositiveSupportMacroAverage: string =
        `Positive-Support ${UtilityConfusionMatrix.ColumnNameMacroAverageRaw}`;

    public static readonly DescriptionPositiveSupportMacroAverage: string = `
        The metrics in this row are similar to those of ${UtilityConfusionMatrix.ColumnNameMacroAverage}.
        However, instead of averaging over all train-set labels, metrics in this rows are the averages of test-set labels,
        i.e., labels with a positive support in the test set.
        Even though one might expect every label (in the train-set) should have some test instances, but
        sometimes a test-set might just not have test instances for some train-set labels.
        "Positive-support" metrics put an focus on test-set labels.
        A test set might even contain instances whose labels are not in the train set. Those labels are renamed UNKNOWN for
        evaluation purpose.
        `;

    public static readonly ColumnNamePositiveSupportSummationMacroAverage: string =
        `Positive-Support ${UtilityConfusionMatrix.ColumnNameSummationMacroAverage}`;

    public static readonly DescriptionPositiveSupportSummationMacroAverage: string = `
        The metrics in this row are similar to those of ${UtilityConfusionMatrix.ColumnNameSummationMacroAverage}, but forcus on
        labels with test instances.
        `;

    public static readonly ColumnNameWeightedMacroAverage: string =
        `Weighted ${UtilityConfusionMatrix.ColumnNameMacroAverageRaw}`;

    public static readonly DescriptionWeightedMacroAverage: string = `
        This metric follows the weighted-average metric defined in
        <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">Scikit-Learn Classification Report</a>.
        The computing process calcuates support/prevalency-weighted means of the per-label/per-instance Precision, Recall, F1, and Accuracy
        metrics, repectively.
        `;

    public static readonly ColumnNameWeightedSummationMacroAverage: string =
        `Weighted ${UtilityConfusionMatrix.ColumnNameSummationMacroAverage}`;

    public static readonly DescriptionWeightedSummationMacroAverage: string = `
        The calculating process for the metrics in this row is a little bit different from ${UtilityConfusionMatrix.DescriptionWeightedMacroAverage}.
        It first calculates the weighted averages of per-label/per-instance "#TruePositives", "#FalsePositives", "#TrueNegatives", and "#FalseNegatives"
        metrics, respectively, then constructs a binary confusion matrix, and calculates the other metrics, such as
        Precision, Recall, F1, Accuracy, etc.
        `;

    public static readonly ColumnNameMultiLabelExactAggregate: string =
        Utility.getBolded("Multi-Label Exact Aggregate");

    public static readonly DescriptionMultiLabelExactAggregate: string = `
        This evaluation package also supports multi-label instances and predictions.
        In another word, a test instance can be labeled and predicted with more than
        one labels. The above metrics so far are calculated "per label," i.e., an instance can contribute to
        multiple positive predictions on different labels, thus the above metrics can encourage a model to predict more than one labels per test instances
        that may achieve better evaluation results.
        To counter such a behavior, metrics in this row are "per instance," i.e., an instance can only contribute to one positive prediction.
        The calcuating process does not rely on the per-label binary confusion matrices, but
        build just one binary confusion matrix in which a true positive prediction is an exact match between the prediction
        and the ground-truth label sets, otherwise it's a false positive. By the way, there is no negative prediction, so false-nagative
        and true-negative are both 0.
        `;

    public static readonly ColumnNameMultiLabelSubsetAggregate: string =
        Utility.getBolded("Multi-Label Subset Aggregate");

    public static readonly DescriptionMultiLabelSubsetAggregate: string = `
        Similar to the previous row, but the metric computing process is less strict. A prediction can be a true positive
        as long as the predicted label set is a subset of the ground-truth set.
        This subset rule makes sense as an action taking on a prediction can respond to one of the
        correctly predicted labels and the action is still proper.
        Of course, this subset rule can discourage a model from predicting more than one labels (one is the safest strategy),
        even though a test instance might be labeled with a large ground-truth label set.
        `;

    public static generateAssessmentLabelObjectConfusionMatrixMetricsAndHtmlTable(
        predictionStructures: PredictionStructureWithPluralEvaluationLabelObject[],
        labelArrayAndMap: {
            "stringArray": string[];
            "stringMap": Map<string, number>;
        },
        toIncludeTrueNegatives: boolean = false,
        toObfuscate: boolean = false, // ---- NOTE: most likely applicable to entity evaluation, where TF is not used.
        quantileConfiguration: number = 4): {
            multiLabelObjectConfusionMatrix:
                MultiLabelObjectConfusionMatrix;
            multiLabelObjectConfusionMatrixEvaluation: {
                "binaryConfusionMatrices": BinaryConfusionMatrix[];
                "confusionMatrixOutputLines": string[][];
                "confusionMatrixMetricsHtml": string;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            multiLabelObjectConfusionMatrixExactEvaluation: {
                "multiLabelObjectConfusionMatrixExact": MultiLabelObjectConfusionMatrixExact;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            multiLabelObjectConfusionMatrixSubsetEvaluation: {
                "multiLabelObjectConfusionMatrixSubset": MultiLabelObjectConfusionMatrixSubset;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            perInstanceMultiLabelObjectConfusionMatrix:
                PerInstanceMultiLabelObjectConfusionMatrix;
            perInstanceMultiLabelObjectConfusionMatrixEvaluation: {
                "binaryConfusionMatrices": BinaryConfusionMatrix[];
                "confusionMatrixOutputLines": string[][];
                "confusionMatrixMetricsHtml": string;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
        } {
        // ---- NOTE-DEPRECATED ---- if (Utility.isEmptyArrays(labels)) {
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow("labels is empty");
        // ---- NOTE-DEPRECATED ---- }
        // ---- NOTE-DEPRECATED ---- if (Utility.isEmptyArrays(labelsPredicted)) {
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow("labelsPredicted is empty");
        // ---- NOTE-DEPRECATED ---- }
        const numberInstances: number = predictionStructures.length;
        // ---- NOTE-DEPRECATED ---- if (labelsPredicted.length !== numberInstances) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow(`labelsPredicted.length|${labelsPredicted.length}| != numberInstances|${numberInstances}|`);
        // ---- NOTE-DEPRECATED ---- }
        const multiLabelObjectConfusionMatrix: MultiLabelObjectConfusionMatrix =
            new MultiLabelObjectConfusionMatrix(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact =
            new MultiLabelObjectConfusionMatrixExact(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset =
            new MultiLabelObjectConfusionMatrixSubset(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const perInstanceMultiLabelObjectConfusionMatrix: PerInstanceMultiLabelObjectConfusionMatrix =
            new PerInstanceMultiLabelObjectConfusionMatrix(
                numberInstances,
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        for (let i = 0; i < numberInstances; i++) {
            multiLabelObjectConfusionMatrix.addInstanceByLabelObjects(
                predictionStructures[i].labels,
                predictionStructures[i].labelsPredicted);
            multiLabelObjectConfusionMatrixExact.addInstanceByLabelObjects(
                predictionStructures[i].labels,
                predictionStructures[i].labelsPredicted);
            multiLabelObjectConfusionMatrixSubset.addInstanceByLabelObjects(
                predictionStructures[i].labels,
                predictionStructures[i].labelsPredicted);
            perInstanceMultiLabelObjectConfusionMatrix.addInstanceByLabelObjects(
                i,
                predictionStructures[i].labels,
                predictionStructures[i].labelsPredicted);
        }
        const multiLabelObjectConfusionMatrixEvaluation: {
            "binaryConfusionMatrices": BinaryConfusionMatrix[];
            "confusionMatrixOutputLines": string[][];
            "confusionMatrixMetricsHtml": string;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(
            multiLabelObjectConfusionMatrix.getBinaryConfusionMatrices(),
            labelArrayAndMap,
            [],
            [],
            [],
            UtilityConfusionMatrix.ColumnNamePerLabel + " ",
            toObfuscate,
            quantileConfiguration);
        const multiLabelObjectConfusionMatrixExactEvaluation: {
            "multiLabelObjectConfusionMatrixExact": MultiLabelObjectConfusionMatrixExact;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateMultiLabelObjectConfusionMatrixExactIntoEvaluationOutputs(
            multiLabelObjectConfusionMatrixExact,
            labelArrayAndMap,
            [],
            []);
        const multiLabelObjectConfusionMatrixSubsetEvaluation: {
            "multiLabelObjectConfusionMatrixSubset": MultiLabelObjectConfusionMatrixSubset;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateMultiLabelObjectConfusionMatrixSubsetIntoEvaluationOutputs(
            multiLabelObjectConfusionMatrixSubset,
            labelArrayAndMap,
            [],
            []);
        const perInstanceMultiLabelObjectConfusionMatrixEvaluation: {
            "binaryConfusionMatrices": BinaryConfusionMatrix[];
            "confusionMatrixOutputLines": string[][];
            "confusionMatrixMetricsHtml": string;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(
            perInstanceMultiLabelObjectConfusionMatrix.getBinaryConfusionMatrices(),
            labelArrayAndMap,
            [],
            [],
            [],
            UtilityConfusionMatrix.ColumnNamePerInstance + " ",
            toObfuscate,
            quantileConfiguration);
        return {
            multiLabelObjectConfusionMatrix,
            multiLabelObjectConfusionMatrixEvaluation,
            multiLabelObjectConfusionMatrixExactEvaluation,
            multiLabelObjectConfusionMatrixSubsetEvaluation,
            perInstanceMultiLabelObjectConfusionMatrix,
            perInstanceMultiLabelObjectConfusionMatrixEvaluation,
        };
    }

    public static generateAssessmentLabelStringConfusionMatrixMetricsAndHtmlTable(
        predictionStructures: PredictionStructureWithPluralEvaluationLabelString[],
        labelArrayAndMap: {
            "stringArray": string[];
            "stringMap": Map<string, number>;
        },
        toIncludeTrueNegatives: boolean = true,
        toObfuscate: boolean = false,
        quantileConfiguration: number = 4): {
            multiLabelConfusionMatrix:
                MultiLabelConfusionMatrix;
            multiLabelConfusionMatrixEvaluation: {
                "binaryConfusionMatrices": BinaryConfusionMatrix[];
                "confusionMatrixOutputLines": string[][];
                "confusionMatrixMetricsHtml": string;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            multiLabelObjectConfusionMatrixExactEvaluation: {
                "multiLabelObjectConfusionMatrixExact": MultiLabelObjectConfusionMatrixExact;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            multiLabelObjectConfusionMatrixSubsetEvaluation: {
                "multiLabelObjectConfusionMatrixSubset": MultiLabelObjectConfusionMatrixSubset;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
            perInstanceMultiLabelConfusionMatrix:
                PerInstanceMultiLabelConfusionMatrix;
            perInstanceMultiLabelConfusionMatrixEvaluation: {
                "binaryConfusionMatrices": BinaryConfusionMatrix[];
                "confusionMatrixOutputLines": string[][];
                "confusionMatrixMetricsHtml": string;
                "confusionMatrixAverageOutputLines": string[][];
                "confusionMatrixAverageMetricsHtml": string;
                "confusionMatrixAverageDescriptionOutputLines": string[][];
                "confusionMatrixAverageDescriptionMetricsHtml": string;
            };
        } {
        // ---- NOTE-DEPRECATED ---- if (Utility.isEmptyNumberArrays(labelsIndexes)) {
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow("labelsIndexes is empty");
        // ---- NOTE-DEPRECATED ---- }
        // ---- NOTE-DEPRECATED ---- if (Utility.isEmptyNumberArrays(labelsPredictedIndexes)) {
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow("labelsPredictedIndexes is empty");
        // ---- NOTE-DEPRECATED ---- }
        const numberInstances: number = predictionStructures.length;
        // ---- NOTE-DEPRECATED ---- if (labelsPredictedIndexes.length !== numberInstances) {
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-DEPRECATED ----     Utility.debuggingThrow(`labelsPredictedIndexes.length|${labelsPredictedIndexes.length}| != numberInstances|${numberInstances}|`);
        // ---- NOTE-DEPRECATED ---- }
        const multiLabelConfusionMatrix: MultiLabelConfusionMatrix =
            new MultiLabelConfusionMatrix(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact =
            new MultiLabelObjectConfusionMatrixExact(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset =
            new MultiLabelObjectConfusionMatrixSubset(
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        const perInstanceMultiLabelConfusionMatrix: PerInstanceMultiLabelConfusionMatrix =
            new PerInstanceMultiLabelConfusionMatrix(
                numberInstances,
                labelArrayAndMap.stringArray,
                labelArrayAndMap.stringMap,
                toIncludeTrueNegatives);
        for (let i = 0; i < numberInstances; i++) {
            multiLabelConfusionMatrix.addInstanceByLabelIndexes(
                predictionStructures[i].labelsIndexes,
                predictionStructures[i].labelsPredictedIndexes);
            multiLabelObjectConfusionMatrixExact.addInstanceByLabelIndexes(
                predictionStructures[i].labelsIndexes,
                predictionStructures[i].labelsPredictedIndexes);
            multiLabelObjectConfusionMatrixSubset.addInstanceByLabelIndexes(
                predictionStructures[i].labelsIndexes,
                predictionStructures[i].labelsPredictedIndexes);
            perInstanceMultiLabelConfusionMatrix.addInstanceByLabelIndexes(
                i,
                predictionStructures[i].labelsIndexes,
                predictionStructures[i].labelsPredictedIndexes);
        }
        const multiLabelConfusionMatrixEvaluation: {
            "binaryConfusionMatrices": BinaryConfusionMatrix[];
            "confusionMatrixOutputLines": string[][];
            "confusionMatrixMetricsHtml": string;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(
            multiLabelConfusionMatrix.getBinaryConfusionMatrices(),
            labelArrayAndMap,
            [],
            [],
            [],
            UtilityConfusionMatrix.ColumnNamePerLabel + " ",
            toObfuscate,
            quantileConfiguration);
        const multiLabelObjectConfusionMatrixExactEvaluation: {
            "multiLabelObjectConfusionMatrixExact": MultiLabelObjectConfusionMatrixExact;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateMultiLabelObjectConfusionMatrixExactIntoEvaluationOutputs(
            multiLabelObjectConfusionMatrixExact,
            labelArrayAndMap,
            [],
            []);
        const multiLabelObjectConfusionMatrixSubsetEvaluation: {
            "multiLabelObjectConfusionMatrixSubset": MultiLabelObjectConfusionMatrixSubset;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateMultiLabelObjectConfusionMatrixSubsetIntoEvaluationOutputs(
            multiLabelObjectConfusionMatrixSubset,
            labelArrayAndMap,
            [],
            []);
        const perInstanceMultiLabelConfusionMatrixEvaluation: {
            "binaryConfusionMatrices": BinaryConfusionMatrix[];
            "confusionMatrixOutputLines": string[][];
            "confusionMatrixMetricsHtml": string;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } = UtilityConfusionMatrix.aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(
            perInstanceMultiLabelConfusionMatrix.getBinaryConfusionMatrices(),
            labelArrayAndMap,
            [],
            [],
            [],
            UtilityConfusionMatrix.ColumnNamePerInstance + " ",
            toObfuscate,
            quantileConfiguration);
        return {
            multiLabelConfusionMatrix,
            multiLabelConfusionMatrixEvaluation,
            multiLabelObjectConfusionMatrixExactEvaluation,
            multiLabelObjectConfusionMatrixSubsetEvaluation,
            perInstanceMultiLabelConfusionMatrix,
            perInstanceMultiLabelConfusionMatrixEvaluation,
        };
    }

    public static aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(
        binaryConfusionMatrices: BinaryConfusionMatrix[],
        labelArrayAndMap: {
            "stringArray": string[];
            "stringMap": Map<string, number>;
        },
        confusionMatrixOutputLines: string[][],
        confusionMatrixAverageOutputLines: string[][],
        confusionMatrixAverageDescriptionOutputLines: string[][],
        columnNamePreffix: string,
        toObfuscate: boolean = false,
        quantileConfiguration: number = 4): {
            "binaryConfusionMatrices": BinaryConfusionMatrix[];
            "confusionMatrixOutputLines": string[][];
            "confusionMatrixMetricsHtml": string;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } {
        // -----------------------------------------------------------------------
        const confusionMatrix: ConfusionMatrix =
            new ConfusionMatrix(labelArrayAndMap.stringArray, labelArrayAndMap.stringMap);
        // -----------------------------------------------------------------------
        if (Utility.isEmptyArray(confusionMatrixOutputLines)) {
            confusionMatrixOutputLines = [];
        }
        if (Utility.isEmptyArray(confusionMatrixAverageOutputLines)) {
            confusionMatrixAverageOutputLines = [];
        }
        if (Utility.isEmptyArray(confusionMatrixAverageDescriptionOutputLines)) {
            confusionMatrixAverageDescriptionOutputLines = [];
        }
        // -----------------------------------------------------------------------
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices.length=${binaryConfusionMatrices.length}`);
        for (let i: number = 0; i < binaryConfusionMatrices.length; i++) {
            const label: string = Utility.carefullyAccessStringArray(labelArrayAndMap.stringArray, i);
            const precision: number = Utility.round(binaryConfusionMatrices[i].getPrecision());
            const recall: number = Utility.round(binaryConfusionMatrices[i].getRecall());
            const f1: number = Utility.round(binaryConfusionMatrices[i].getF1Measure());
            const accuracy: number = Utility.round(binaryConfusionMatrices[i].getAccuracy());
            const truePositives: number = binaryConfusionMatrices[i].getTruePositives();
            const falsePositives: number = binaryConfusionMatrices[i].getFalsePositives();
            const trueNegatives: number = binaryConfusionMatrices[i].getTrueNegatives();
            const falseNegatives: number = binaryConfusionMatrices[i].getFalseNegatives();
            const support: number = binaryConfusionMatrices[i].getSupport();
            const total: number = binaryConfusionMatrices[i].getTotal();
            const confusionMatrixOutputLine: any[] = [
                Utility.outputString(label, toObfuscate),
                precision,
                recall,
                f1,
                accuracy,
                truePositives,
                falsePositives,
                trueNegatives,
                falseNegatives,
                support,
                total,
            ];
            confusionMatrixOutputLines.push(confusionMatrixOutputLine);
            Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices[${i}].getTotal()         =${binaryConfusionMatrices[i].getTotal()}`);
            Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices[${i}].getTruePositives() =${binaryConfusionMatrices[i].getTruePositives()}`);
            Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices[${i}].getFalsePositives()=${binaryConfusionMatrices[i].getFalsePositives()}`);
            Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices[${i}].getTrueNegatives() =${binaryConfusionMatrices[i].getTrueNegatives()}`);
            Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), binaryConfusionMatrices[${i}].getFalseNegatives()=${binaryConfusionMatrices[i].getFalseNegatives()}`);
        }
        const confusionMatrixMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Confusion matrix metrics",
            confusionMatrixOutputLines,
            ["Label", "Precision", "Recall", "F1", "Accuracy", "#TruePositives", "#FalsePositives", "#TrueNegatives", "#FalseNegatives", "Support", "Total"]);
        // -----------------------------------------------------------------------
        const microAverageMetrics: IConfusionMatrixBaseMicroAverageMetrics =
            confusionMatrix.getMicroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineMicroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameMicroAverage,
            "N/A", // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
            "N/A", // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
            // tslint:disable-next-line: max-line-length
            "N/A", // ---- Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
            // tslint:disable-next-line: max-line-length
            Utility.getBolded(Utility.round(microAverageMetrics.averagePrecisionRecallF1Accuracy)), // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
            microAverageMetrics.truePositives,
            "N/A", // ---- NOTE ---- in multi-class, there is no negative, so calculation of precision is equal to that of recall.
            "N/A",
            microAverageMetrics.falseNegatives,
            "N/A",
            microAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMicroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMicroAverage,
            UtilityConfusionMatrix.DescriptionMicroAverage,
        ]);
        // -----------------------------------------------------------------------
        const microQuantileMetrics: IConfusionMatrixQuantileMetrics =
            confusionMatrix.getMicroQuantileMetrics(binaryConfusionMatrices, quantileConfiguration);
        const confusionMatrixOutputLineMicroQuantile1: any[] = [
            UtilityConfusionMatrix.ColumnNameMicroFirstQuartile,
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 1) ?
                Utility.round(microQuantileMetrics.quantilesPrecisions[1]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 1) ?
                Utility.round(microQuantileMetrics.quantilesRecalls[1]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 1) ?
                Utility.getBolded(Utility.round(microQuantileMetrics.quantilesF1Scores[1])) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 1) ?
                Utility.getBolded(Utility.round(microQuantileMetrics.quantilesAccuracies[1])) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 1) ?
                microQuantileMetrics.quantilesTruePositives[1] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 1) ?
                microQuantileMetrics.quantilesFalsePositives[1] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 1) ?
                microQuantileMetrics.quantilesTrueNegatives[1] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 1) ?
                microQuantileMetrics.quantilesFalseNegatives[1] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 1) ?
                microQuantileMetrics.quantilesSupports[1] : "N/A",
            microQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMicroQuantile1);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMicroFirstQuartile,
            UtilityConfusionMatrix.DescriptionMicroFirstQuartile,
        ]);
        const confusionMatrixOutputLineMicroQuantile2: any[] = [
            UtilityConfusionMatrix.ColumnNameMicroMedian,
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 2) ?
                Utility.round(microQuantileMetrics.quantilesPrecisions[2]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 2) ?
                Utility.round(microQuantileMetrics.quantilesRecalls[2]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 2) ?
                Utility.getBolded(Utility.round(microQuantileMetrics.quantilesF1Scores[2])) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 2) ?
                Utility.getBolded(Utility.round(microQuantileMetrics.quantilesAccuracies[2])) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 2) ?
                microQuantileMetrics.quantilesTruePositives[2] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 2) ?
                microQuantileMetrics.quantilesFalsePositives[2] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 2) ?
                microQuantileMetrics.quantilesTrueNegatives[2] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 2) ?
                microQuantileMetrics.quantilesFalseNegatives[2] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 2) ?
                microQuantileMetrics.quantilesSupports[2] : "N/A",
            microQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMicroQuantile2);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMicroMedian,
            UtilityConfusionMatrix.DescriptionMicroMedian,
        ]);
        const confusionMatrixOutputLineMicroQuantile3: any[] = [
            UtilityConfusionMatrix.ColumnNameMicroThirdQuartile,
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesPrecisions, 3) ?
                Utility.round(microQuantileMetrics.quantilesPrecisions[3]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesRecalls, 3) ?
                Utility.round(microQuantileMetrics.quantilesRecalls[3]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesF1Scores, 3) ?
                Utility.round(microQuantileMetrics.quantilesF1Scores[3]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesAccuracies, 3) ?
                Utility.round(microQuantileMetrics.quantilesAccuracies[3]) : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTruePositives, 3) ?
                microQuantileMetrics.quantilesTruePositives[3] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalsePositives, 3) ?
                microQuantileMetrics.quantilesFalsePositives[3] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesTrueNegatives, 3) ?
                microQuantileMetrics.quantilesTrueNegatives[3] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesFalseNegatives, 3) ?
                microQuantileMetrics.quantilesFalseNegatives[3] : "N/A",
            Utility.canAccessNumberArray(microQuantileMetrics.quantilesSupports, 3) ?
                microQuantileMetrics.quantilesSupports[3] : "N/A",
            microQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMicroQuantile3);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMicroThirdQuartile,
            UtilityConfusionMatrix.DescriptionMicroThirdQuartile,
        ]);
        // -----------------------------------------------------------------------
        const macroQuantileMetrics: IConfusionMatrixQuantileMetrics =
            confusionMatrix.getMacroQuantileMetrics(binaryConfusionMatrices, quantileConfiguration);
        const confusionMatrixOutputLineMacroQuantile1: any[] = [
            UtilityConfusionMatrix.ColumnNameMacroFirstQuartile,
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 1) ?
                Utility.round(macroQuantileMetrics.quantilesPrecisions[1]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 1) ?
                Utility.round(macroQuantileMetrics.quantilesRecalls[1]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 1) ?
                Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesF1Scores[1])) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 1) ?
                Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesAccuracies[1])) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 1) ?
                macroQuantileMetrics.quantilesTruePositives[1] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 1) ?
                macroQuantileMetrics.quantilesFalsePositives[1] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 1) ?
                macroQuantileMetrics.quantilesTrueNegatives[1] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 1) ?
                macroQuantileMetrics.quantilesFalseNegatives[1] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 1) ?
                macroQuantileMetrics.quantilesSupports[1] : "N/A",
            macroQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMacroQuantile1);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMacroFirstQuartile,
            UtilityConfusionMatrix.DescriptionMacroFirstQuartile,
        ]);
        const confusionMatrixOutputLineMacroQuantile2: any[] = [
            UtilityConfusionMatrix.ColumnNameMacroMedian,
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 2) ?
                Utility.round(macroQuantileMetrics.quantilesPrecisions[2]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 2) ?
                Utility.round(macroQuantileMetrics.quantilesRecalls[2]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 2) ?
                Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesF1Scores[2])) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 2) ?
                Utility.getBolded(Utility.round(macroQuantileMetrics.quantilesAccuracies[2])) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 2) ?
                macroQuantileMetrics.quantilesTruePositives[2] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 2) ?
                macroQuantileMetrics.quantilesFalsePositives[2] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 2) ?
                macroQuantileMetrics.quantilesTrueNegatives[2] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 2) ?
                macroQuantileMetrics.quantilesFalseNegatives[2] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 2) ?
                macroQuantileMetrics.quantilesSupports[2] : "N/A",
            macroQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMacroQuantile2);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMacroMedian,
            UtilityConfusionMatrix.DescriptionMacroMedian,
        ]);
        const confusionMatrixOutputLineMacroQuantile3: any[] = [
            UtilityConfusionMatrix.ColumnNameMacroThirdQuartile,
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesPrecisions, 3) ?
                Utility.round(macroQuantileMetrics.quantilesPrecisions[3]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesRecalls, 3) ?
                Utility.round(macroQuantileMetrics.quantilesRecalls[3]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesF1Scores, 3) ?
                Utility.round(macroQuantileMetrics.quantilesF1Scores[3]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesAccuracies, 3) ?
                Utility.round(macroQuantileMetrics.quantilesAccuracies[3]) : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTruePositives, 3) ?
                macroQuantileMetrics.quantilesTruePositives[3] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalsePositives, 3) ?
                macroQuantileMetrics.quantilesFalsePositives[3] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesTrueNegatives, 3) ?
                macroQuantileMetrics.quantilesTrueNegatives[3] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesFalseNegatives, 3) ?
                macroQuantileMetrics.quantilesFalseNegatives[3] : "N/A",
            Utility.canAccessNumberArray(macroQuantileMetrics.quantilesSupports, 3) ?
                macroQuantileMetrics.quantilesSupports[3] : "N/A",
            macroQuantileMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMacroQuantile3);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMacroThirdQuartile,
            UtilityConfusionMatrix.DescriptionMacroThirdQuartile,
        ]);
        // -----------------------------------------------------------------------
        const summationMicroAverageMetrics: IConfusionMatrixSummationMetrics =
            confusionMatrix.getSummationMicroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineSummationMicroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameSummationMicroAverage,
            Utility.round(summationMicroAverageMetrics.summationPrecision),
            Utility.round(summationMicroAverageMetrics.summationRecall),
            Utility.getBolded(Utility.round(summationMicroAverageMetrics.summationF1Score)),
            Utility.getBolded(Utility.round(summationMicroAverageMetrics.summationAccuracy)),
            Utility.round(summationMicroAverageMetrics.summationTruePositives),
            Utility.round(summationMicroAverageMetrics.summationFalsePositives),
            Utility.round(summationMicroAverageMetrics.summationTrueNegatives),
            Utility.round(summationMicroAverageMetrics.summationFalseNegatives),
            Utility.round(summationMicroAverageMetrics.summationSupport),
            "N/A", // ---- summationMicroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineSummationMicroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameSummationMicroAverage,
            UtilityConfusionMatrix.DescriptionSummationMicroAverage,
        ]);
        // -----------------------------------------------------------------------
        const macroAverageMetrics: IConfusionMatrixMeanMetrics =
            confusionMatrix.getMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameMacroAverage,
            Utility.round(macroAverageMetrics.averagePrecision),
            Utility.round(macroAverageMetrics.averageRecall),
            Utility.getBolded(Utility.round(macroAverageMetrics.averageF1Score)),
            Utility.getBolded(Utility.round(macroAverageMetrics.averageAccuracy)),
            "N/A", // ---- Utility.round(macroAverageMetrics.averageTruePositives),
            "N/A", // ---- Utility.round(macroAverageMetrics.averageFalsePositives),
            "N/A", // ---- Utility.round(macroAverageMetrics.averageTrueNegatives),
            "N/A", // ---- Utility.round(macroAverageMetrics.averageFalseNegatives),
            "N/A", // ---- Utility.round(macroAverageMetrics.averageSupport),
            "N/A", // ---- macroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameMacroAverage,
            UtilityConfusionMatrix.DescriptionMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        const summationMacroAverageMetrics: IConfusionMatrixMeanMetrics =
            confusionMatrix.getSummationMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineSummationMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameSummationMacroAverage,
            Utility.round(summationMacroAverageMetrics.averagePrecision),
            Utility.round(summationMacroAverageMetrics.averageRecall),
            Utility.round(summationMacroAverageMetrics.averageF1Score),
            Utility.round(summationMacroAverageMetrics.averageAccuracy),
            Utility.round(summationMacroAverageMetrics.averageTruePositives),
            Utility.round(summationMacroAverageMetrics.averageFalsePositives),
            Utility.round(summationMacroAverageMetrics.averageTrueNegatives),
            Utility.round(summationMacroAverageMetrics.averageFalseNegatives),
            Utility.round(summationMacroAverageMetrics.averageSupport),
            "N/A", // ---- summationMacroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(confusionMatrixOutputLineSummationMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameSummationMacroAverage,
            UtilityConfusionMatrix.DescriptionSummationMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        const positiveSupportLabelMacroAverageMetrics: IConfusionMatrixMeanMetrics =
            confusionMatrix.getPositiveSupportLabelMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLinePositiveSupportLabelMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNamePositiveSupportMacroAverage,
            Utility.round(positiveSupportLabelMacroAverageMetrics.averagePrecision),
            Utility.round(positiveSupportLabelMacroAverageMetrics.averageRecall),
            Utility.round(positiveSupportLabelMacroAverageMetrics.averageF1Score),
            Utility.round(positiveSupportLabelMacroAverageMetrics.averageAccuracy),
            "N/A", // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageTruePositives),
            "N/A", // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageFalsePositives),
            "N/A", // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageTrueNegatives),
            "N/A", // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageFalseNegatives),
            "N/A", // ---- Utility.round(positiveSupportLabelMacroAverageMetrics.averageSupport),
            "N/A", // ---- positiveSupportLabelMacroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(
            confusionMatrixOutputLinePositiveSupportLabelMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNamePositiveSupportMacroAverage,
            UtilityConfusionMatrix.DescriptionPositiveSupportMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        const positiveSupportLabelSummationMacroAverageMetrics: IConfusionMatrixMeanMetrics =
            confusionMatrix.getPositiveSupportLabelSummationMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNamePositiveSupportSummationMacroAverage,
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averagePrecision),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageRecall),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageF1Score),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageAccuracy),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageTruePositives),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageFalsePositives),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageTrueNegatives),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageFalseNegatives),
            Utility.round(positiveSupportLabelSummationMacroAverageMetrics.averageSupport),
            "N/A", // ---- positiveSupportLabelSummationMacroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(
            confusionMatrixOutputLinePositiveSupportLabelSummationMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNamePositiveSupportSummationMacroAverage,
            UtilityConfusionMatrix.DescriptionPositiveSupportSummationMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        const weightedMacroAverageMetrics: IConfusionMatrixMeanDerivedMetrics =
            confusionMatrix.getWeightedMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineWeightedMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameWeightedMacroAverage,
            Utility.round(weightedMacroAverageMetrics.averagePrecision),
            Utility.round(weightedMacroAverageMetrics.averageRecall),
            Utility.round(weightedMacroAverageMetrics.averageF1Score),
            Utility.round(weightedMacroAverageMetrics.averageAccuracy),
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A", // ---- weightedMacroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(
            confusionMatrixOutputLineWeightedMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameWeightedMacroAverage,
            UtilityConfusionMatrix.DescriptionWeightedMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        const summationWeightedMacroAverageMetrics: IConfusionMatrixMeanMetrics =
            confusionMatrix.getSummationWeightedMacroAverageMetrics(binaryConfusionMatrices);
        const confusionMatrixOutputLineSummationWeightedMacroAverage: any[] = [
            UtilityConfusionMatrix.ColumnNameWeightedSummationMacroAverage,
            Utility.round(summationWeightedMacroAverageMetrics.averagePrecision),
            Utility.round(summationWeightedMacroAverageMetrics.averageRecall),
            Utility.round(summationWeightedMacroAverageMetrics.averageF1Score),
            Utility.round(summationWeightedMacroAverageMetrics.averageAccuracy),
            Utility.round(summationWeightedMacroAverageMetrics.averageTruePositives),
            Utility.round(summationWeightedMacroAverageMetrics.averageFalsePositives),
            Utility.round(summationWeightedMacroAverageMetrics.averageTrueNegatives),
            Utility.round(summationWeightedMacroAverageMetrics.averageFalseNegatives),
            Utility.round(summationWeightedMacroAverageMetrics.averageSupport),
            "N/A", // ---- summationWeightedMacroAverageMetrics.total,
        ];
        confusionMatrixAverageOutputLines.push(
            confusionMatrixOutputLineSummationWeightedMacroAverage);
        confusionMatrixAverageDescriptionOutputLines.push([
            columnNamePreffix + UtilityConfusionMatrix.ColumnNameWeightedSummationMacroAverage,
            UtilityConfusionMatrix.DescriptionWeightedSummationMacroAverage,
        ]);
        // -----------------------------------------------------------------------
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), confusionMatrix.getMicroAverageMetrics()=        ${Utility.jsonStringify(confusionMatrix.getMicroAverageMetrics(binaryConfusionMatrices))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), confusionMatrix.getMacroAverageMetrics()=        ${Utility.jsonStringify(confusionMatrix.getMacroAverageMetrics(binaryConfusionMatrices))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), confusionMatrix.getWeightedMacroAverageMetrics()=${Utility.jsonStringify(confusionMatrix.getWeightedMacroAverageMetrics(binaryConfusionMatrices))}`);
        // -----------------------------------------------------------------------
        const confusionMatrixAverageMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metrics",
            confusionMatrixAverageOutputLines,
            ["Type", "Precision", "Recall", "F1", "Accuracy", "#TruePositives", "#FalsePositives", "#TrueNegatives", "#FalseNegatives", "Support", "Total"]);
        const confusionMatrixAverageDescriptionMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metric descriptions",
            confusionMatrixAverageDescriptionOutputLines,
            ["Type", "Description"]);
        // -----------------------------------------------------------------------
        return {
            binaryConfusionMatrices,
            confusionMatrixOutputLines,
            confusionMatrixMetricsHtml,
            confusionMatrixAverageOutputLines,
            confusionMatrixAverageMetricsHtml,
            confusionMatrixAverageDescriptionOutputLines,
            confusionMatrixAverageDescriptionMetricsHtml,
        };
        // -----------------------------------------------------------------------
    }

    /**
     * Aggregate an input MultiLabelObjectConfusionMatrixExact object into
     * a collection of evaluation output objects with the help of some
     * auxiliary objects.
     *
     * @param multiLabelObjectConfusionMatrixExact
     * @param labelArrayAndMap
     * @param confusionMatrixAverageOutputLines
     * @param confusionMatrixAverageDescriptionOutputLines
     */
    public static aggregateMultiLabelObjectConfusionMatrixExactIntoEvaluationOutputs(
        multiLabelObjectConfusionMatrixExact: MultiLabelObjectConfusionMatrixExact,
        labelArrayAndMap: {
            "stringArray": string[];
            "stringMap": Map<string, number>;
        },
        confusionMatrixAverageOutputLines: string[][],
        confusionMatrixAverageDescriptionOutputLines: string[][]): {
            "multiLabelObjectConfusionMatrixExact": MultiLabelObjectConfusionMatrixExact;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } {
        // -----------------------------------------------------------------------
        const confusionMatrix: ConfusionMatrix =
            new ConfusionMatrix(labelArrayAndMap.stringArray, labelArrayAndMap.stringMap);
        // -----------------------------------------------------------------------
        if (Utility.isEmptyArray(confusionMatrixAverageOutputLines)) {
            confusionMatrixAverageOutputLines = [];
        }
        if (Utility.isEmptyArray(confusionMatrixAverageDescriptionOutputLines)) {
            confusionMatrixAverageDescriptionOutputLines = [];
        }
        // -----------------------------------------------------------------------
        const exactMacroAggregateMetrics: IConfusionMatrixMeanMetrics =
            multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics([]);
        if (exactMacroAggregateMetrics.total > 0) {
            const confusionMatrixOutputLineExactMacroAggregate: any[] = [
                UtilityConfusionMatrix.ColumnNameMultiLabelExactAggregate,
                Utility.round(exactMacroAggregateMetrics.averagePrecision),
                Utility.round(exactMacroAggregateMetrics.averageRecall),
                Utility.getBolded(Utility.round(exactMacroAggregateMetrics.averageF1Score)),
                Utility.getBolded(Utility.round(exactMacroAggregateMetrics.averageAccuracy)),
                Utility.round(exactMacroAggregateMetrics.averageTruePositives),
                Utility.round(exactMacroAggregateMetrics.averageFalsePositives),
                Utility.round(exactMacroAggregateMetrics.averageTrueNegatives),
                Utility.round(exactMacroAggregateMetrics.averageFalseNegatives),
                Utility.round(exactMacroAggregateMetrics.averageSupport),
                exactMacroAggregateMetrics.total,
            ];
            confusionMatrixAverageOutputLines.push(
                confusionMatrixOutputLineExactMacroAggregate);
            confusionMatrixAverageDescriptionOutputLines.push([
                UtilityConfusionMatrix.ColumnNameMultiLabelExactAggregate,
                UtilityConfusionMatrix.DescriptionMultiLabelExactAggregate,
            ]);
        }
        // -----------------------------------------------------------------------
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getMicroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getMicroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getMacroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getWeightedMacroAverageMetrics()=              ${Utility.jsonStringify(multiLabelObjectConfusionMatrixExact.getWeightedMacroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()=         ${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTotal()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives() =${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTruePositives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalsePositives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getTrueNegatives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelObjectConfusionMatrixExact.getBinaryConfusionMatrix().getFalseNegatives()}`);
        // -----------------------------------------------------------------------
        const confusionMatrixAverageMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metrics",
            confusionMatrixAverageOutputLines,
            ["Type", "Precision", "Recall", "F1", "Accuracy", "#TruePositives", "#FalsePositives", "#TrueNegatives", "#FalseNegatives", "Support", "Total"]);
        const confusionMatrixAverageDescriptionMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metric descriptions",
            confusionMatrixAverageDescriptionOutputLines,
            ["Type", "Description"]);
        // -----------------------------------------------------------------------
        return {
            multiLabelObjectConfusionMatrixExact,
            confusionMatrixAverageOutputLines,
            confusionMatrixAverageMetricsHtml,
            confusionMatrixAverageDescriptionOutputLines,
            confusionMatrixAverageDescriptionMetricsHtml,
        };
        // -----------------------------------------------------------------------
    }

    /**
     * Aggregate an input MultiLabelObjectConfusionMatrixSubset object into
     * a collection of evaluation output objects with the help of some
     * auxiliary objects.
     *
     * @param multiLabelObjectConfusionMatrixSubset
     * @param labelArrayAndMap
     * @param confusionMatrixAverageOutputLines
     * @param confusionMatrixAverageDescriptionOutputLines
     */
    public static aggregateMultiLabelObjectConfusionMatrixSubsetIntoEvaluationOutputs(
        multiLabelObjectConfusionMatrixSubset: MultiLabelObjectConfusionMatrixSubset,
        labelArrayAndMap: {
            "stringArray": string[];
            "stringMap": Map<string, number>;
        },
        confusionMatrixAverageOutputLines: string[][],
        confusionMatrixAverageDescriptionOutputLines: string[][]): {
            "multiLabelObjectConfusionMatrixSubset": MultiLabelObjectConfusionMatrixSubset;
            "confusionMatrixAverageOutputLines": string[][];
            "confusionMatrixAverageMetricsHtml": string;
            "confusionMatrixAverageDescriptionOutputLines": string[][];
            "confusionMatrixAverageDescriptionMetricsHtml": string;
        } {
        // -----------------------------------------------------------------------
        const confusionMatrix: ConfusionMatrix =
            new ConfusionMatrix(labelArrayAndMap.stringArray, labelArrayAndMap.stringMap);
        // -----------------------------------------------------------------------
        if (Utility.isEmptyArray(confusionMatrixAverageOutputLines)) {
            confusionMatrixAverageOutputLines = [];
        }
        if (Utility.isEmptyArray(confusionMatrixAverageDescriptionOutputLines)) {
            confusionMatrixAverageDescriptionOutputLines = [];
        }
        // -----------------------------------------------------------------------
        const subsetMacroAggregateMetrics: IConfusionMatrixMeanMetrics =
            multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics([]);
        if (subsetMacroAggregateMetrics.total > 0) {
            const confusionMatrixOutputLineSubsetMacroAggregate: any[] = [
                UtilityConfusionMatrix.ColumnNameMultiLabelSubsetAggregate,
                Utility.round(subsetMacroAggregateMetrics.averagePrecision),
                Utility.round(subsetMacroAggregateMetrics.averageRecall),
                Utility.getBolded(Utility.round(subsetMacroAggregateMetrics.averageF1Score)),
                Utility.getBolded(Utility.round(subsetMacroAggregateMetrics.averageAccuracy)),
                Utility.round(subsetMacroAggregateMetrics.averageTruePositives),
                Utility.round(subsetMacroAggregateMetrics.averageFalsePositives),
                Utility.round(subsetMacroAggregateMetrics.averageTrueNegatives),
                Utility.round(subsetMacroAggregateMetrics.averageFalseNegatives),
                Utility.round(subsetMacroAggregateMetrics.averageSupport),
                subsetMacroAggregateMetrics.total,
            ];
            confusionMatrixAverageOutputLines.push(
                confusionMatrixOutputLineSubsetMacroAggregate);
            confusionMatrixAverageDescriptionOutputLines.push([
                UtilityConfusionMatrix.ColumnNameMultiLabelSubsetAggregate,
                UtilityConfusionMatrix.DescriptionMultiLabelSubsetAggregate,
            ]);
        }
        // -----------------------------------------------------------------------
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getMicroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getMicroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics()=                      ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getMacroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getWeightedMacroAverageMetrics()=              ${Utility.jsonStringify(multiLabelObjectConfusionMatrixSubset.getWeightedMacroAverageMetrics([]))}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()=         ${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTotal()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives() =${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTruePositives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()=${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalsePositives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives() =${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getTrueNegatives()}`);
        Utility.debuggingLog(`aggregateBinaryConfusionMatrixArrayIntoEvaluationOutputs(), multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()=${multiLabelObjectConfusionMatrixSubset.getBinaryConfusionMatrix().getFalseNegatives()}`);
        // -----------------------------------------------------------------------
        const confusionMatrixAverageMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metrics",
            confusionMatrixAverageOutputLines,
            ["Type", "Precision", "Recall", "F1", "Accuracy", "#TruePositives", "#FalsePositives", "#TrueNegatives", "#FalseNegatives", "Support", "Total"]);
        const confusionMatrixAverageDescriptionMetricsHtml: string = Utility.convertDataArraysToIndexedHtmlTable(
            "Average confusion matrix metric descriptions",
            confusionMatrixAverageDescriptionOutputLines,
            ["Type", "Description"]);
        // -----------------------------------------------------------------------
        return {
            multiLabelObjectConfusionMatrixSubset,
            confusionMatrixAverageOutputLines,
            confusionMatrixAverageMetricsHtml,
            confusionMatrixAverageDescriptionOutputLines,
            confusionMatrixAverageDescriptionMetricsHtml,
        };
        // -----------------------------------------------------------------------
    }
}
