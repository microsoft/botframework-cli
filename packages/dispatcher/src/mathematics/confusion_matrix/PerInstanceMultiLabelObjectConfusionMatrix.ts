/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase } from "./PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase";

import { Label } from "../../label_structure/Label";

export class PerInstanceMultiLabelObjectConfusionMatrix
extends PerInstanceMultiLabelObjectConfusionMatrixWithBinaryArrayBase {

    constructor(
        numberInstances: number,
        labels: string[],
        labelMap: Map<string, number>,
        populateTrueNegatives: boolean) {
        super(numberInstances, labels, labelMap, populateTrueNegatives);
    }

    public addInstanceByLabelObjects(
        instanceIndex: number,
        groundTrueLabels: Label[],
        predictedLabels: Label[],
        value: number = 1): void {
        this.validateInstanceId(instanceIndex);
        this.validateLabelObjects(groundTrueLabels);
        this.validateLabelObjects(predictedLabels);
        for (const predictedLabel of predictedLabels) {
            const predictedIsInGroundTruth: boolean = this.isLabelObjectInArray(groundTrueLabels, predictedLabel);
            if (predictedIsInGroundTruth) {
                this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(value, false);
            } else {
                this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(value, false);
            }
        }
        for (const groundTrueLabel of groundTrueLabels) {
            const groundTruthIsInPredicted: boolean = this.isLabelObjectInArray(predictedLabels, groundTrueLabel);
            if (!groundTruthIsInPredicted) {
                this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(value, false);
            }
        }
        this.getBinaryConfusionMatrices()[instanceIndex].calculateDerivedCells();
    }

    public addInstanceByLabelIndexes(
        instanceIndex: number,
        groundTrueLabelIds: number[],
        predictedLabelIds: number[],
        value: number = 1): void {
        this.validateInstanceId(instanceIndex);
        this.validateLabelIds(groundTrueLabelIds);
        this.validateLabelIds(predictedLabelIds);
        /** ---- NOTE ---- implementation 1 - does not avoid redundant label predictions
         *                 can be faster with many labels.
         */
        let numberTruePositives: number  = 0;
        let numberOfFalsePositives: number = 0;
        for (const predictedLabelId of predictedLabelIds) {
            const isInGroundTruthLabelIds: boolean = this.isLabelIdInArray(groundTrueLabelIds, predictedLabelId);
            if (isInGroundTruthLabelIds) {
                numberTruePositives++;
            } else {
                numberOfFalsePositives++;
            }
        }
        let numberOfFalseNegatives: number = 0;
        for (const groundTrueLabelId of groundTrueLabelIds) {
            const isInPredictedLabelIds: boolean = this.isLabelIdInArray(predictedLabelIds, groundTrueLabelId);
            if (!isInPredictedLabelIds) {
                numberOfFalseNegatives++;
            }
        }
        this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(numberTruePositives * value, false);
        this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(numberOfFalseNegatives * value, false);
        this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(numberOfFalsePositives * value, false);
        if (this.doesPopulateTrueNegatives()) {
            const numberOfTrueNegatives: number =
                this.getNumberLabels() - numberTruePositives - numberOfFalsePositives - numberOfFalseNegatives;
            this.getBinaryConfusionMatrices()[instanceIndex].addToTrueNegatives(numberOfTrueNegatives * value, false);
        }
        /** ---- NOTE ---- implementation 2 - filter out redundant label predictions.
         *  for (let labelId: number = 0; labelId < this.getNumberLabels(); labelId++) {
         *      const isInGroundTruthLabelIds: boolean = this.isLabelIdInArray(groundTrueLabelIds, labelId);
         *      const isInPredictedLabelIds: boolean = this.isLabelIdInArray(predictedLabelIds, labelId);
         *      if (isInGroundTruthLabelIds) {
         *          if (isInPredictedLabelIds) {
         *              this.getBinaryConfusionMatrices()[instanceIndex].addToTruePositives(value, false);
         *          } else {
         *              this.getBinaryConfusionMatrices()[instanceIndex].addToFalseNegatives(value, false);
         *          }
         *      } else {
         *          if (isInPredictedLabelIds) {
         *              this.getBinaryConfusionMatrices()[instanceIndex].addToFalsePositives(value, false);
         *          } else {
         *              if (this.doesPopulateTrueNegatives()) {
         *                  this.getBinaryConfusionMatrices()[instanceIndex].addToTrueNegatives(value, false);
         *              }
         *          }
         *      }
         *  }
         */
        this.getBinaryConfusionMatrices()[instanceIndex].calculateDerivedCells();
    }
}
