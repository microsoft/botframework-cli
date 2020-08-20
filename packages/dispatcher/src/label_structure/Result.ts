/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";
import {ScoreIntent} from "./ScoreIntent";
import {ScoreEntity} from "./ScoreEntity";
import { LabelType } from "./LabelType";

import { Utility } from "../utility/Utility";

export class Result {
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

    public toScoreEntityObject(): {
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
}
