/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

import { Utility } from "../utility/Utility";

export class PredictionStructureFoundationSingularEvaluation {

    /** ---- NOTE-DOCUMENTATION ----
     *  A PredictionStructureFoundationSingularEvaluation object has
     *  a single evaluation that an evaluating algorithm can
     *  determine the value based on the information possibly from
     *  a PredictionStructureFoundation object.
     */
    public labelsPredictedEvaluation: number;
    /** ---- NOTE-DOCUMENTATION ----
     *  labelsPredictedEvaluation can be of following:
     *    PredictionType.TruePositive(1):TP
     *    PredictionType.FalsePositive(2):FP
     *    PredictionType.FalseNegative(4):FN
     *    PredictionType.TrueNegative(8):TN
     */

    constructor(
        labelsPredictedEvaluation: number,
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
         ) {
        this.labelsPredictedEvaluation = labelsPredictedEvaluation;
    }

    public toObjectPredictionStructureFoundationSingularEvaluation(): {
        "labelsPredictedEvaluation": number;
        /** ---- NOTE-DOCUMENTATION ----
         *  labelsPredictedEvaluation can be of following:
         *    PredictionType.TruePositive(1):TP
         *    PredictionType.FalsePositive(2):FP
         *    PredictionType.FalseNegative(4):FN
         *    PredictionType.TrueNegative(8):TN
         */
        } {
        return {
            labelsPredictedEvaluation: this.labelsPredictedEvaluation,
            /** ---- NOTE-DOCUMENTATION ----
             *  labelsPredictedEvaluation can be of following:
             *    PredictionType.TruePositive(1):TP
             *    PredictionType.FalsePositive(2):FP
             *    PredictionType.FalseNegative(4):FN
             *    PredictionType.TrueNegative(8):TN
             */
            };
    }

    public isCorrectPrediction(): boolean {
        return (this.labelsPredictedEvaluation === PredictionType.TruePositive) ||
            (this.labelsPredictedEvaluation === PredictionType.TrueNegative);
    }

    public isMisclassified(): boolean {
        return (this.labelsPredictedEvaluation === PredictionType.FalsePositive) ||
            (this.labelsPredictedEvaluation === PredictionType.FalseNegative);
    }
}
