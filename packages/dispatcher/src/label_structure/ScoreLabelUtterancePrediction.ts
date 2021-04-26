/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePredictionWithScoreLabel } from "./IUtterancePredictionWithScoreLabel";
import { IUtterancePredictionWithScoreLabelByPosition } from "./IUtterancePredictionWithScoreLabelByPosition";
import { LabelType } from "./LabelType";
import { Label } from "./Label";
import { Result } from "./Result";
import { ScoreLabel } from "./ScoreLabel";
import { PredictionType } from "./PredictionType";

export class ScoreLabelUtterancePrediction extends ScoreLabel {
    public static newScoreLabelUtterancePrediction(
        utterance: string,
        predictionType: PredictionType,
        labelType: LabelType,
        label: string,
        score: number,
        spanOffset: number = 0,
        spanLength: number = 0): ScoreLabelUtterancePrediction {
        return new ScoreLabelUtterancePrediction(
            utterance,
            predictionType,
            Label.newLabel(
                labelType,
                label,
                spanOffset,
                spanLength),
            score);
    }

    public static newScoreLabelUtterancePredictionByPosition(
        utterance: string,
        predictionType: PredictionType,
        labelType: LabelType,
        label: string,
        score: number,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): ScoreLabelUtterancePrediction {
        return new ScoreLabelUtterancePrediction(
            utterance,
            predictionType,
            Label.newLabelByPosition(
                labelType,
                label,
                spanStartPosition,
                spanEndPosition),
            score);
    }

    public utterance: string;
    public predictionType: PredictionType;

    constructor(utterance: string, predictionType: PredictionType, label: Label, score: number) {
        super(label, score);
        this.utterance = utterance;
        this.predictionType = predictionType;
    }

    public toObject(): IUtterancePredictionWithScoreLabel {
        return {
            utterance: this.utterance,
            predictionType: this.predictionType,
            label: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: this.score,
        };
    }

    public toObjectByPosition(): IUtterancePredictionWithScoreLabelByPosition {
        return {
            utterance: this.utterance,
            predictionType: this.predictionType,
            label: this.label.name,
            startPos: this.label.getStartPos(),
            endPos: this.label.getStartPos(),
            score: this.score,
        };
    }

    public toResult(): Result {
        return new Result(
            Label.newLabel(
                this.label.labeltype,
                this.label.name,
                this.label.span.offset,
                this.label.span.length),
            this.score,
            this.utterance);
    }

    public equals(other: ScoreLabelUtterancePrediction): boolean {
        if (!super.equals(other)) {
            return false;
        }
        if (other) {
            if (other.utterance !== this.utterance) {
                return false;
            }
            if (other.predictionType !== this.predictionType) {
                return false;
            }
            return true;
        }
        return false;
    }
}
