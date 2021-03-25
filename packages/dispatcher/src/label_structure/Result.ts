/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";
import { LabelType } from "./LabelType";

import { Utility } from "../utility/Utility";

export class Result {
    public static utilityRound(score: number, digits: number): number {
        return score; // ---- NOTE ---- null logic, per request to see the original score, not rounded one.
        // ---- NOTE-FOR-REFERENCE-PLACE-HOLDER ---- return Utility.round(score, digits);
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

    public toObject(): {
        "label": {
            "name": string;
            "labeltype": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closesttext": string; } {
        return {
            label: this.label.toObject(),
            score: this.score,
            closesttext: this.closesttext,
        };
    }
    public toObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "label": {
            "name": string;
            "labeltype": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closesttext": string; } {
        if (toObfuscate) {
            return this.toObfuscatedObjectFormatted(digits);
        }
        return this.toSimpleObjectFormatted(digits);
    }
    public toSimpleObjectFormatted(digits: number = 10000): {
        "label": {
            "name": string;
            "labeltype": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closesttext": string; } {
        return {
            label: this.label.toObject(),
            score: Result.utilityRound(this.score, digits),
            closesttext: this.closesttext,
        };
    }
    public toObfuscatedObjectFormatted(digits: number = 10000): {
        "label": {
            "name": string;
            "labeltype": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closesttext": string; } {
        return {
            label: this.label.toObfuscatedObject(),
            score: Result.utilityRound(this.score, digits),
            closesttext: Utility.obfuscateString(this.closesttext),
        };
    }

    public toAlternateObject(): {
        "label": {
            "name": string;
            "label_type": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closest_text": string; } {
        return {
            label: this.label.toAlternateObject(),
            score: this.score,
            closest_text: this.closesttext,
        };
    }
    public toAlternateObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "label": {
            "name": string;
            "label_type": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closest_text": string; } {
        if (toObfuscate) {
            return this.toObfuscatedAlternateObjectFormatted(digits);
        }
        return this.toSimpleAlternateObjectFormatted(digits);
    }
    public toSimpleAlternateObjectFormatted(digits: number = 10000): {
        "label": {
            "name": string;
            "label_type": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closest_text": string; } {
        return {
            label: this.label.toAlternateObject(),
            score: Result.utilityRound(this.score, digits),
            closest_text: this.closesttext,
        };
    }
    public toObfuscatedAlternateObjectFormatted(digits: number = 10000): {
        "label": {
            "name": string;
            "label_type": number;
            "span": {
                "offset": number;
                "length": number; }; };
        "score": number;
        "closest_text": string; } {
        return {
            label: this.label.toObfuscatedAlternateObject(),
            score: Result.utilityRound(this.score, digits),
            closest_text: Utility.obfuscateString(this.closesttext),
        };
    }

    public toScoreLabelObject(): {
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
    public toScoreLabelObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "label": string;
        "offset": number;
        "length": number;
        "score": number; } {
        if (toObfuscate) {
            return this.toObfuscatedScoreLabelObjectFormatted(digits);
        }
        return this.toSimpleScoreLabelObjectFormatted(digits);
    }
    public toSimpleScoreLabelObjectFormatted(digits: number = 10000): {
        "label": string;
        "offset": number;
        "length": number;
        "score": number; } {
        return {
            label: this.label.name,
            offset: this.label.span.offset,
            length: this.label.span.length,
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreLabelObjectFormatted(digits: number = 10000): {
        "label": string;
        "offset": number;
        "length": number;
        "score": number; } {
        return {
            label: Utility.obfuscateString(this.label.name),
            offset: Utility.obfuscateNumber(this.label.span.offset),
            length: Utility.obfuscateNumber(this.label.span.length),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreLabelObjectByPosition(): {
        "label": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
            label: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: this.score,
        };
    }
    public toScoreLabelObjectByPositionFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "label": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        if (toObfuscate) {
            return this.toObfuscatedScoreLabelObjectByPositionFormatted(digits);
        }
        return this.toSimpleScoreLabelObjectByPositionFormatted(digits);
    }
    public toSimpleScoreLabelObjectByPositionFormatted(digits: number = 10000): {
        "label": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
            label: this.label.name,
            startPos: this.label.span.offset,
            endPos: (this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreLabelObjectByPositionFormatted(digits: number = 10000): {
        "label": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        return {
            label: Utility.obfuscateString(this.label.name),
            startPos: Utility.obfuscateNumber(this.label.span.offset),
            endPos: Utility.obfuscateNumber(this.label.span.offset + this.label.span.length - 1),
            score: Result.utilityRound(this.score, digits),
        };
    }

    public toScoreEntityObject(): {
        "entity": string;
        "offset": number;
        "length": number;
        "score": number; } {
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
    public toScoreEntityObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "entity": string;
        "offset": number;
        "length": number;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreEntityObjectFormatted(digits);
        }
        return this.toSimpleScoreEntityObjectFormatted(digits);
    }
    public toSimpleScoreEntityObjectFormatted(digits: number = 10000): {
        "entity": string;
        "offset": number;
        "length": number;
        "score": number; } {
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
    public toObfuscatedScoreEntityObjectFormatted(digits: number = 10000): {
        "entity": string;
        "offset": number;
        "length": number;
        "score": number; } {
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

    public toScoreEntityObjectByPosition(): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
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
    public toScoreEntityObjectByPositionFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Entity) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Entity|${LabelType.Entity}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreEntityObjectByPositionFormatted(digits);
        }
        return this.toSimpleScoreEntityObjectByPositionFormatted(digits);
    }
    public toSimpleScoreEntityObjectByPositionFormatted(digits: number = 10000): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
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
    public toObfuscatedScoreEntityObjectByPositionFormatted(digits: number = 10000): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "score": number; } {
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

    public toScoreIntentObject(): {
        "intent": string;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: this.label.name,
            score: this.score,
        };
    }
    public toScoreIntentObjectFormatted(toObfuscate: boolean = false, digits: number = 10000): {
        "intent": string;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        if (toObfuscate) {
            return this.toObfuscatedScoreIntentObjectFormatted(digits);
        }
        return this.toSimpleScoreIntentObjectFormatted(digits);
    }
    public toSimpleScoreIntentObjectFormatted(digits: number = 10000): {
        "intent": string;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: this.label.name,
            score: Result.utilityRound(this.score, digits),
        };
    }
    public toObfuscatedScoreIntentObjectFormatted(digits: number = 10000): {
        "intent": string;
        "score": number; } {
        if (this.label.labeltype !== LabelType.Intent) {
            Utility.debuggingThrow(`this.label.labeltype|${this.label.labeltype}| !== LabelType.Intent|${LabelType.Intent}|`);
        }
        return {
            intent: Utility.obfuscateString(this.label.name),
            score: Result.utilityRound(this.score, digits),
        };
    }
}
