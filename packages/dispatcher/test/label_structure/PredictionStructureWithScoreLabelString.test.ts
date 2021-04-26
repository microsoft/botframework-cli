/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import {} from "mocha";

import { Label } from "../../src/label_structure/Label";
import { LabelType } from "../../src/label_structure/LabelType";
import { Span } from "../../src/label_structure/Span";
import { Result } from "../../src/label_structure/Result";
import { PredictionStructureWithScoreLabelString } from "../../src/label_structure/PredictionStructureWithScoreLabelString";
import { PredictionStructureFoundationDisplay } from "../../src/label_structure/PredictionStructureFoundationDisplay";
import { PredictionScoreStructureFoundation } from "../../src/label_structure/PredictionScoreStructureFoundation";

import {Utility} from "../../src/utility/Utility";
import {UnitTestHelper} from "../utility/Utility.test";

describe("Test Suite - PredictionStructureWithScoreLabelString", () => {
  it("Test.0000 PredictionStructureWithScoreLabelString - constructor()", function() {
    Utility.resetFlagToPrintDebuggingLogToConsole(UnitTestHelper.getDefaultUnitTestDebuggingLogFlag());
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = "utterance";
    const labelsPredictedEvaluation: number = 0;
    /** ---- NOTE-DOCUMENTATION ----
     *  labelsPredictedEvaluation can be of following:
     *    PredictionType.TruePositive(1):TP
     *    PredictionType.FalsePositive(2):FP
     *    PredictionType.FalseNegative(4):FN
     *    PredictionType.TrueNegative(8):TN
     */
    const labels: string[] = ["label"];
    const labelsConcatenated: string = "label";
    const labelsConcatenatedToHtmlTable: string =
      "<p><strong>Label</strong></p><table class=\"table\"><tr><td>Label</td></tr></table>";
    const labelsIndexes: number[] = [0];
    const labelsPredicted: string[] = ["label"];
    const labelsPredictedConcatenated: string = "label";
    const labelsPredictedConcatenatedToHtmlTable: string =
      "<p><strong>Label</strong></p><table class=\"table\"><tr><td>Label</td></tr></table>";
    const labelsPredictedScore: number = 0.99;
    const labelsPredictedIndexes: number[] = [0];
    const labelsPredictedClosestText: string[] = ["utterance"];
    const scoreResultArray: Result[] = [new Result(new Label(LabelType.Intent, "label", new Span(0, 0)), 0.99, "utterance")];
    const scoreArray: number[] = [0.99];
    const predictedScoreStructureHtmlTable: string = "nothing-for-now";
    const labelsScoreStructureHtmlTable: string = "nothing-for-now";
    const scorestructure: PredictionStructureWithScoreLabelString = new PredictionStructureWithScoreLabelString(
      utterance,
      labelsPredictedEvaluation,
      labels,
      labelsConcatenated,
      labelsConcatenatedToHtmlTable,
      labelsIndexes,
      labelsPredicted,
      labelsPredictedConcatenated,
      labelsPredictedConcatenatedToHtmlTable,
      labelsPredictedIndexes,
      labelsPredictedScore,
      labelsPredictedClosestText,
      scoreResultArray,
      scoreArray,
      predictedScoreStructureHtmlTable,
      labelsScoreStructureHtmlTable);
    Utility.debuggingLog(`scorestructure=${Utility.jsonStringify(scorestructure)}`);
    const scorestructureObject: {
      "text": string;
      "labelsPredictedEvaluation": number;
      /** ---- NOTE-DOCUMENTATION ----
       *  labelsPredictedEvaluation can be of following:
       *    PredictionType.TruePositive(1):TP
       *    PredictionType.FalsePositive(2):FP
       *    PredictionType.FalseNegative(4):FN
       *    PredictionType.TrueNegative(8):TN
       */
      "labelsIndexes": number[];
      "labelsPredictedIndexes": number[];
      "labels": string[];
      "labelsPredicted": string[];
      "predictionStructureFoundationDisplay": PredictionStructureFoundationDisplay;
      "predictionScoreStructureFoundation": PredictionScoreStructureFoundation;
    } = scorestructure.toObjectPredictionStructureWithScore();
    assert.ok(scorestructureObject.text === "utterance");
  });
});
