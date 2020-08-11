/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";

export class Result {
    public label: Label;

    public score: number;

    public closesttext: string;

    constructor(label: Label, score: number, closesttext: string) {
        this.label = label;
        this.score = score;
        this.closesttext = closesttext;
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
}
