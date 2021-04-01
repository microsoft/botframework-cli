/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IResult } from "./IResult";
import { IResultAlternate } from "./IResultAlternate";
import { IScoreIntent } from "./IScoreIntent";
import { IScoreLabel } from "./IScoreLabel";
import { IScoreLabelByPosition } from "./IScoreLabelByPosition";
import { IScoreEntity } from "./IScoreEntity";
import { IScoreEntityByPosition } from "./IScoreEntityByPosition";
import { Label } from "./Label";
import { LabelType } from "./LabelType";

import { Utility } from "../utility/Utility";

export class Result {
    public static utilityRound(score: number, digits: number): number {
        return score; // ---- NOTE ---- default logic per request for see the original, raw score that is not rounded.
        // ---- NOTE-FOR-REFERENCE-ALTERNATIVE-PLACE-HOLDER ---- return Utility.round(score, digits);
    }

    public label: Label;

    public score: number;

    public closesttext: string;

    constructor(label: Label, score: number, closesttext: string) {
        this.label = label;
        this.score = score;
        this.closesttext = closesttext;
    }

    public equals(other: Result): boolean {
        if (other) {
            if (this.label) {
                if (!this.label.equals(other.label)) {
                    return false;
                }
            } else {
                if (other.label) {
                    return false;
                }
            }
            if (other.score !== this.score) {
                return false;
            }
            if (other.closesttext !== this.closesttext) {
                return false;
            }
            return true;
        }
        return false;
    }

    public toObject(): IResult {
        return {
            label: this.label.toObject(),
            score: this.score,
            closesttext: this.closesttext,
        };
    }
    public toObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): IResult {
        if (toObfuscate) {
            return this.toObfuscatedObjectFormatted(digits);
        }
        return this.toSimpleObjectFormatted(digits);
    }
    public toSimpleObjectFormatted(digits: number = 10000): IResult {
        return {
            label: this.label.toObject(),
            score: Result.utilityRound(this.score, digits),
            closesttext: this.closesttext,
        };
    }
    public toObfuscatedObjectFormatted(digits: number = 10000): IResult {
        return {
            label: this.label.toObfuscatedObject(),
            score: Result.utilityRound(this.score, digits),
            closesttext: Utility.obfuscateString(this.closesttext),
        };
    }

    public toAlternateObject(): IResultAlternate {
        return {
            label: this.label.toAlternateObject(),
            score: this.score,
            closest_text: this.closesttext,
        };
    }
    public toAlternateObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): IResultAlternate {
        if (toObfuscate) {
            return this.toObfuscatedAlternateObjectFormatted(digits);
        }
        return this.toSimpleAlternateObjectFormatted(digits);
    }
    public toSimpleAlternateObjectFormatted(digits: number = 10000): IResultAlternate {
        return {
            label: this.label.toAlternateObject(),
            score: Result.utilityRound(this.score, digits),
            closest_text: this.closesttext,
        };
    }
    public toObfuscatedAlternateObjectFormatted(digits: number = 10000): IResultAlternate {
        return {
            label: this.label.toObfuscatedAlternateObject(),
            score: Result.utilityRound(this.score, digits),
            closest_text: Utility.obfuscateString(this.closesttext),
        };
    }

    public toScoreLabelObject(): IScoreLabel {
        return {
            label: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: this.score,
        };
    }
    public toScoreLabelObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): IScoreLabel {
        if (toObfuscate) {
            return this.toObfuscatedScoreLabelObjectFormatted(digits);
        }
        return this.toSimpleScoreLabelObjectFormatted(digits);
    }
    public toSimpleScoreLabelObjectFormatted(digits: number = 10000): IScoreLabel {
        return {
            label: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreLabelObjectFormatted(digits: number = 10000): IScoreLabel {
        return {
            label: Utility.obfuscateString(this.label.name),
            offset: Utility.obfuscateNumber(this.label.span.offset),
            length: Utility.obfuscateNumber(this.label.span.length),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreLabelObjectByPosition(): IScoreLabelByPosition {
        return {
            label: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: this.score,
        };
    }
    public toScoreLabelObjectByPositionFormatted(
        toObfuscate: boolean = false,
        digits: number = 10000): IScoreLabelByPosition {
        if (toObfuscate) {
            return this.toObfuscatedScoreLabelObjectByPositionFormatted(digits);
        }
        return this.toSimpleScoreLabelObjectByPositionFormatted(digits);
    }
    public toSimpleScoreLabelObjectByPositionFormatted(digits: number = 10000): IScoreLabelByPosition {
        return {
            label: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreLabelObjectByPositionFormatted(digits: number = 10000): IScoreLabelByPosition {
        return {
            label: Utility.obfuscateString(this.label.name),
            startPos: Utility.obfuscateNumber(this.label.span.offset),
            endPos: Utility.obfuscateNumber(this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreEntityObject(): IScoreEntity {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: this.score,
        };
    }
    public toScoreEntityObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): IScoreEntity {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreEntityObjectFormatted(digits);
        }
        return this.toSimpleScoreEntityObjectFormatted(digits);
    }
    public toSimpleScoreEntityObjectFormatted(digits: number = 10000): IScoreEntity {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreEntityObjectFormatted(digits: number = 10000): IScoreEntity {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: Utility.obfuscateString(this.label.name),
            offset: Utility.obfuscateNumber(this.label.span.offset),
            length: Utility.obfuscateNumber(this.label.span.length),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreEntityObjectByPosition(): IScoreEntityByPosition {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: this.score,
        };
    }
    public toScoreEntityObjectByPositionFormatted(
        toObfuscate: boolean = false,
        digits: number = 10000): IScoreEntityByPosition {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreEntityObjectByPositionFormatted(digits);
        }
        return this.toSimpleScoreEntityObjectByPositionFormatted(digits);
    }
    public toSimpleScoreEntityObjectByPositionFormatted(digits: number = 10000): IScoreEntityByPosition {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreEntityObjectByPositionFormatted(digits: number = 10000): IScoreEntityByPosition {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        return {
            entity: Utility.obfuscateString(this.label.name),
            startPos: Utility.obfuscateNumber(this.label.span.offset),
            endPos: Utility.obfuscateNumber(this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreIntentObject(): IScoreIntent {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: this.label.name,
            score: this.score,
        };
    }
    public toScoreIntentObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): IScoreIntent {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreIntentObjectFormatted(digits);
        }
        return this.toSimpleScoreIntentObjectFormatted(digits);
    }
    public toSimpleScoreIntentObjectFormatted(digits: number = 10000): IScoreIntent {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: this.label.name,
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreIntentObjectFormatted(digits: number = 10000): IScoreIntent {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: Utility.obfuscateString(this.label.name),
            score: Result.utilityRound(this.score, digits),
        };
    }
}
