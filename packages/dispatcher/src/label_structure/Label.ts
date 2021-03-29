/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelType} from "./LabelType";
import {Span} from "./Span";

import {Utility} from "../utility/Utility";

export class Label {
    public static newIntentLabel(label: string, spanOffset: number = 0, spanLength: number = 0): Label {
        return Label.newLabel(LabelType.Intent, label, spanOffset, spanLength);
    }

    public static newEntityLabel(label: string, spanOffset: number = 0, spanLength: number = 0): Label {
        return Label.newLabel(LabelType.Entity, label, spanOffset, spanLength);
    }

    public static newLabel(labelType: LabelType, label: string, spanOffset: number = 0, spanLength: number = 0): Label {
        return new Label(labelType, label, new Span(spanOffset, spanLength));
    }

    public static newIntentLabelByPosition(
        label: string,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): Label {
        return Label.newLabelByPosition(LabelType.Intent, label, spanStartPosition, spanEndPosition);
    }

    public static newEntityLabelByPosition(
        label: string,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): Label {
        return Label.newLabelByPosition(LabelType.Entity, label, spanStartPosition, spanEndPosition);
    }

    public static newLabelByPosition(
        labelType: LabelType,
        label: string,
        spanStartPosition: number = 0,
        spanEndPosition: number = 0): Label {
        return new Label(labelType, label, new Span(spanStartPosition, spanEndPosition - spanStartPosition + 1));
    }

    public static sortFunction(a: Label, b: Label) {
        if (a.labeltype < b.labeltype) {
            return -1;
        }
        if (a.labeltype > b.labeltype) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        if (a.span < b.span) {
            return -1;
        }
        if (a.span > b.span) {
            return 1;
        }
        return 0;
    }

    public labeltype: LabelType;

    public name: string;

    public span: Span;

    constructor(labeltype: LabelType, name: string, span: Span) {
        this.labeltype = labeltype;
        this.name = name;
        this.span = span;
    }

    public toString(toObfuscate: boolean = false): string {
        if (toObfuscate) {
            return this.toObfuscatedString();
        }
        return this.toSimpleString();
    }
    public toSimpleString(): string {
        if (this.labeltype === LabelType.Intent) {
            return this.name;
        }
        return `${this.name}-${this.labeltype}-${this.span.offset}-${this.span.length}`;
    }
    public toObfuscatedString(): string {
        const nameObfuscated: string = Utility.obfuscateString(this.name);
        if (this.labeltype === LabelType.Intent) {
            return nameObfuscated;
        }
        const offsetObfuscated: number = Utility.obfuscateNumber(this.span.offset);
        const lengthObfuscated: number = Utility.obfuscateNumber(this.span.length);
        return `${nameObfuscated}-${this.labeltype}-${offsetObfuscated}-${lengthObfuscated}`;
    }

    public toObject(toObfuscate: boolean = false): {
        "name": string;
        "labeltype": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        if (toObfuscate) {
            return this.toObfuscatedObject();
        }
        return this.toSimpleObject();
    }
    public toSimpleObject(): {
        "name": string;
        "labeltype": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        return {
            name: this.name,
            labeltype: this.labeltype,
            span: this.span.toSimpleObject(),
        };
    }
    public toObfuscatedObject(): {
        "name": string;
        "labeltype": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        const nameObfuscated: string = Utility.obfuscateString(this.name);
        return {
            name: nameObfuscated,
            labeltype: this.labeltype,
            span: this.span.toObfuscatedObject(),
        };
    }

    public toAlternateObject(toObfuscate: boolean = false): {
        "name": string;
        "label_type": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        if (toObfuscate) {
            return this.toObfuscatedAlternateObject();
        }
        return this.toSimpleAlternateObject();
    }
    public toSimpleAlternateObject(): {
        "name": string;
        "label_type": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        return {
            name: this.name,
            label_type: this.labeltype,
            span: this.span.toSimpleObject(),
        };
    }
    public toObfuscatedAlternateObject(): {
        "name": string;
        "label_type": number;
        "span": {
            "offset": number;
            "length": number; }; } {
        const nameObfuscated: string = Utility.obfuscateString(this.name);
        return {
            name: nameObfuscated,
            label_type: this.labeltype,
            span: this.span.toObfuscatedObject(),
        };
    }

    public toEntityObject(toObfuscate: boolean = false): {
        "entity": string;
        "startPos": number;
        "endPos": number; } {
        if (toObfuscate) {
            return this.toObfuscatedEntityObject();
        }
        return this.toSimpleEntityObject();
    }
    public toSimpleEntityObject(): {
        "entity": string;
        "startPos": number;
        "endPos": number; } {
        return {
            entity: this.name,
            startPos: this.getStartPos(),
            endPos: this.getEndPos(),
        };
    }
    public toObfuscatedEntityObject(): {
        "entity": string;
        "startPos": number;
        "endPos": number; } {
        const nameObfuscated: string = Utility.obfuscateString(this.name);
        const startPosObfuscated: number = Utility.obfuscateNumber(this.getStartPos());
        const endPosObfuscated: number = Utility.obfuscateNumber(this.getEndPos());
        return {
            entity: nameObfuscated,
            startPos: startPosObfuscated,
            endPos: endPosObfuscated,
        };
    }

    public toEntityObjectWithText(utterance: string, toObfuscate: boolean = false): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "text": string; } {
        if (toObfuscate) {
            return this.toObfuscatedEntityObjectWithText(utterance);
        }
        return this.toSimpleEntityObjectWithText(utterance);
    }
    public toSimpleEntityObjectWithText(utterance: string): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "text": string; } {
        return {
            entity: this.name,
            startPos: this.getStartPos(),
            endPos: this.getEndPos(),
            text: utterance.substring(this.getStartPos(), this.getEndPos() + 1),
        };
    }
    public toObfuscatedEntityObjectWithText(utterance: string): {
        "entity": string;
        "startPos": number;
        "endPos": number;
        "text": string; } {
        const nameObfuscated: string = Utility.obfuscateString(this.name);
        const startPosObfuscated: number = Utility.obfuscateNumber(this.getStartPos());
        const endPosObfuscated: number = Utility.obfuscateNumber(this.getEndPos());
        const entityText: string = utterance.substring(this.getStartPos(), this.getEndPos() + 1);
        const entityTextObfuscated: string = Utility.obfuscateString(entityText);
        return {
            entity: nameObfuscated,
            startPos: startPosObfuscated,
            endPos: endPosObfuscated,
            text: entityTextObfuscated,
        };
    }

    public getStartPos(): number {
        return this.span.offset;
    }

    public getEndPos(): number {
        return this.span.offset + this.span.length - 1;
    }

    public equals(other: Label): boolean {
        if (other) {
            if (other.name !== this.name) {
                return false;
            }
            if (other.labeltype !== this.labeltype) {
                return false;
            }
            if (this.span) {
                if (!this.span.equals(other.span)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
}
