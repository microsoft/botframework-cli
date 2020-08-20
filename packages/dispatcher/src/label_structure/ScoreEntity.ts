/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelType} from "./LabelType";
import {Label} from "./Label";
import {Result} from "./Result";
import {Score} from "./Score";

import { Utility } from "../utility/Utility";

export class ScoreEntity extends Score {
    public static newScoreEntity(
        entityLabel: string,
        score: number,
        spanOffset: number = 0,
        spanLength: number = 0): ScoreEntity {
        return new ScoreEntity(
            Label.newEntityLabel(
                entityLabel,
                spanOffset,
                spanLength),
            score);
    }

    public static newScoreEntityByPosition(
        entityLabel: string,
        score: number,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): ScoreEntity {
        return new ScoreEntity(
            Label.newEntityLabelByPosition(
                entityLabel,
                spanStartPosition,
                spanEndPosition),
            score);
    }

    public entity: Label;

    constructor(entity: Label, score: number) {
        super(score);
        if (entity.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`entity.labeltype|${entity.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        this.entity = entity;
    }

    public toObject(): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
            entity: this.entity.name,
            startPos: this.entity.span.offset,
            endPos: (this.entity.span.offset + this.entity.span.length - 1),
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
            "");
    }

    public equals(other: ScoreEntity): boolean {
        if (!super.equals(other)) {
            return false;
        }
        if (this.entity) {
            if (!this.entity.equals(other.entity)) {
                return false;
            }
            return true;
        }
        return false;
    }
}
