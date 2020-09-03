/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";
import {Result} from "./Result";
import {ScoreIntent} from "./ScoreIntent";
import {PredictionType} from "./PredictionType";

export class ScoreIntentUtterancePrediction extends ScoreIntent {
    public static newScoreIntentUtterancePrediction(
        utterance: string,
        predictionType: PredictionType,
        intentLabel: string,
        score: number): ScoreIntentUtterancePrediction {
        return new ScoreIntentUtterancePrediction(
            utterance,
            predictionType,
            intentLabel,
            score);
    }

    public utterance: string;
    public predictionType: PredictionType;

    constructor(utterance: string, predictionType: PredictionType, intent: string, score: number) {
        super(intent, score);
        this.utterance = utterance;
        this.predictionType = predictionType;
    }

    public toObject(): {
        "utterance": string,
        "predictionType": PredictionType,
        "intent": string;
        "score": number; } {
        return {
            utterance: this.utterance,
            predictionType: this.predictionType,
            intent: this.intent,
            score: this.score,
        };
    }

    public toResult(): Result {
        return new Result(
            Label.newIntentLabel(
                this.intent,
                0,
                0),
            this.score,
            this.utterance);
    }

    public equals(other: ScoreIntentUtterancePrediction): boolean {
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
