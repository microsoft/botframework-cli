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
import { PredictionScoreLabelStringStructure } from "../../src/label_structure/PredictionScoreLabelStringStructure";
import { PredictionStructureForDisplay } from "../../src/label_structure/PredictionStructureForDisplay";
import { PredictionStructureScore } from "../../src/label_structure/PredictionStructureScore";

import {Utility} from "../../src/utility/Utility";
import {UnitTestHelper} from "../utility/Utility.test";

describe("Test Suite - scorestructure", () => {
  it("Test.0000 PredictionScoreLabelStringStructure - constructor()", function () {
    Utility.toPrintDebuggingLogToConsole = UnitTestHelper.getDefaultUnitTestDebuggingLogFlag();
    this.timeout(UnitTestHelper.getDefaultUnitTestTimeout());
    const utterance: string = "utterance";
    const labelsPredictedEvaluation: number = 0;
    // ---- NOTE ---- PredictionType.TruePositive(1):TP
    // ---- NOTE ---- PredictionType.FalsePositive(2):FP
    // ---- NOTE ---- PredictionType.FalseNegative(4):TN
    // ---- NOTE ---- PredictionType.TrueNegative(8):FN
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
    const scorestructure: PredictionScoreLabelStringStructure = new PredictionScoreLabelStringStructure(
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
      // ---- NOTE ---- PredictionType.TruePositive(1):TP
      // ---- NOTE ---- PredictionType.FalsePositive(2):FP
      // ---- NOTE ---- PredictionType.FalseNegative(4):FN
      // ---- NOTE ---- PredictionType.TrueNegative(8):TN
      "labelsIndexes": number[];
      "labelsPredictedIndexes": number[];
      "labels": string[];
      "labelsPredicted": string[];
      "predictionStructureForDisplay": PredictionStructureForDisplay;
      "predictionStructureScore": PredictionStructureScore;
    } = scorestructure.toObjectPredictionScoreStructure();
    assert.ok(scorestructureObject.text === "utterance");
  });
});

