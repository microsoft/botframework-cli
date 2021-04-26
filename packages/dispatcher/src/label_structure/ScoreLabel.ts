/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelType} from "./LabelType";
import {Label} from "./Label";
import {Result} from "./Result";
import {Score} from "./Score";

export class ScoreLabel extends Score {
    public static newScoreLabel(
        labelType: LabelType,
        label: string,
        score: number,
        spanOffset: number = 0,
        spanLength: number = 0): ScoreLabel {
        return new ScoreLabel(
            Label.newLabel(
                labelType,
                label,
                spanOffset,
                spanLength),
            score);
    }

    public static newScoreLabelByPosition(
        labelType: LabelType,
        label: string,
        score: number,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): ScoreLabel {
        return new ScoreLabel(
            Label.newLabelByPosition(
                labelType,
                label,
                spanStartPosition,
                spanEndPosition),
            score);
    }

    public label: Label;

    constructor(label: Label, score: number) {
        super(score);
        this.label = label;
    }

    public toObject(): {
        "label": string;
        "offset": number;
        "length": number;
        "score": number; } {
        return {
            label: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: this.score,
        };
    }

    public toObjectByPosition(): {
        "label": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
            label: this.label.name,
            startPos: this.label.getStartPos(),
            endPos: this.label.getStartPos(),
            score: this.score,
        };
    }

    public toResult(): Result {
        return new Result(
            Label.newLabelByPosition(
                this.label.labeltype,
                this.label.name,
                this.label.getStartPos(),
                this.label.getEndPos()),
            this.score,
            "");
    }

    public equals(other: ScoreLabel): boolean {
        if (!super.equals(other)) {
            return false;
        }
        if (other) {
            if (!other.label.equals(this.label)) {
                return false;
            }
            return true;
        }
        return false;
    }
}
