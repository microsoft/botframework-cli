/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelType} from "./LabelType";
import {Label} from "./Label";
import {Result} from "./Result";
import {Score} from "./Score";

import { Utility } from "../Utility/Utility";

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
        "offset": number;
        "length": number;
        "score": number; } {
        return {
            entity: this.entity.name,
            offset: this.entity.span.offset,
            length: this.entity.span.length,
            score: this.score,
        };
    }

    public toObjectByPosition(): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
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
            "");
    }

    public equals(other: ScoreEntity): boolean {
        if (!super.equals(other)) {
            return false;
        }
        if (other) {
            if (!other.entity.equals(this.entity)) {
                return false;
            }
            return true;
        }
        return false;
    }
}
