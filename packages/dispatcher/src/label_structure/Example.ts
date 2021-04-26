/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ILabel } from "./ILabel";
import { ILabelAlternate } from "./ILabelAlternate";
import { Label } from "./Label";

export class Example {
    public static newIntentExample(
        text: string,
        labels: string[],
        spanOffset: number = 0,
        spanLength: number = 0): Example {
        return new Example(text, labels.map((x: string) => Label.newIntentLabel(x, spanOffset, spanLength)));
    }

    public static sortFunction(a: Example, b: Example) {
        if (a.text < b.text) {
            return -1;
        }
        if (a.text > b.text) {
            return 1;
        }
        if (a.labels.length > b.labels.length) {
            return -1;
        }
        if (a.labels.length < b.labels.length) {
            return 1;
        }
        a.labels.sort(Label.sortFunction);
        b.labels.sort(Label.sortFunction);
        for (let i = 0; i < a.labels.length; i++) {
            const compareLabel = Label.sortFunction(a.labels[i], b.labels[i]);
            if (compareLabel !== 0) {
                return compareLabel;
            }
        }
        return 0;
    }

    public text: string;

    public labels: Label[];

    constructor(text: string, labels: Label[]) {
        this.text = text;
        this.labels = labels;
    }

    public toObject(): {
        "text": string;
        "labels": ILabel[]; } {
        return {
          text: this.text,
          labels: this.labels.map((x: Label) => x.toObject()),
        };
    }

    public toAlternateObject(): {
        "text": string;
        "labels": ILabelAlternate[]; } {
        return {
          text: this.text,
          labels: this.labels.map((x: Label) => x.toAlternateObject()),
        };
    }
}
