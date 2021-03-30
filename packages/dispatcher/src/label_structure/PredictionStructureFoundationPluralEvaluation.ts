/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionTypeArrayOutputIndex } from "./PredictionType";

// import { Utility } from "../utility/Utility";

export class PredictionStructureFoundationPluralEvaluation {

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureFoundationPluralEvaluation object has
     *  an array of evaluation values that an evaluating algorithm can
     *  determine the values based on the information possibly from
     *  a PredictionStructureFoundation object.
     */
    public labelsPredictedEvaluationArray: number[];
    /** ---- NOTE-DOCUMENTATION ----
     *  labelsPredictedEvaluationArray cells are
     *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
     *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
     *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
     */

    constructor(
        labelsPredictedEvaluationArray: number[],
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluationArray cells are
         *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
         */
        ) {
        this.labelsPredictedEvaluationArray = labelsPredictedEvaluationArray;
    }

    public toObjectPredictionStructureFoundationPluralEvaluation(): {
        "labelsPredictedEvaluationArray": number[];
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluationArray cells are
         *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
         *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
         */
        } {
        return {
            labelsPredictedEvaluationArray: this.labelsPredictedEvaluationArray,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluationArray cells are
             *    index-PredictionTypeArrayOutputIndex.IndexForTruePositive(0): #TP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalsePositive(1): #FP
             *    index-PredictionTypeArrayOutputIndex.IndexForFalseNegative(2): #FN
             */
            };
    }

    public hasMisclassified(): boolean {
        return (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalsePositive] > 0) ||
          (this.labelsPredictedEvaluationArray[PredictionTypeArrayOutputIndex.IndexForFalseNegative] > 0);
    }
}
