/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePredictionWithScoreEntity } from "./IUtterancePredictionWithScoreEntity";
import { IUtterancePredictionWithScoreEntityByPosition } from "./IUtterancePredictionWithScoreEntityByPosition";
import { Label } from "./Label";
import { Result } from "./Result";
import { ScoreEntity } from "./ScoreEntity";
import { PredictionType } from "./PredictionType";

export class ScoreEntityUtterancePrediction extends ScoreEntity {
    public static newScoreEntityUtterancePrediction(
        utterance: string,
        predictionType: PredictionType,
        entityLabel: string,
        score: number,
        spanOffset: number = 0,
        spanLength: number = 0): ScoreEntityUtterancePrediction {
        return new ScoreEntityUtterancePrediction(
            utterance,
            predictionType,
            Label.newEntityLabel(
                entityLabel,
                spanOffset,
                spanLength),
            score);
    }

    public static newScoreEntityUtterancePredictionByPosition(
        utterance: string,
        predictionType: PredictionType,
        entityLabel: string,
        score: number,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): ScoreEntityUtterancePrediction {
        return new ScoreEntityUtterancePrediction(
            utterance,
            predictionType,
            Label.newEntityLabelByPosition(
                entityLabel,
                spanStartPosition,
                spanEndPosition),
            score);
    }

    public utterance: string;
    public predictionType: PredictionType;

    constructor(utterance: string, predictionType: PredictionType, entity: Label, score: number) {
        super(entity, score);
        this.utterance = utterance;
        this.predictionType = predictionType;
    }

    public toObject(): IUtterancePredictionWithScoreEntity {
        return {
            utterance: this.utterance,
            predictionType: this.predictionType,
            entity: this.entity.name,
            offset: this.entity.span.offset,
            length: this.entity.span.length,
            score: this.score,
        };
    }

    public toObjectByPosition(): IUtterancePredictionWithScoreEntityByPosition {
        return {
            utterance: this.utterance,
            predictionType: this.predictionType,
            entity: this.entity.name,
            startPos: this.entity.getStartPos(),
            endPos: this.entity.getEndPos(),
            score: this.score,
        };
    }

    public toResult(): Result {
        return new Result(
            Label.newEntityLabelByPosition(
                this.entity.name,
                this.entity.getStartPos(),
                this.entity.getEndPos()),
            this.score,
            this.utterance);
    }

    public equals(other: ScoreEntityUtterancePrediction): boolean {
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
