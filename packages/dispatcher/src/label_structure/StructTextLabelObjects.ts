/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";

export class StructTextLabelObjects {
    public text: string;
    public labels: Label[];

    constructor(text: string, labels: Label[]) {
        this.text = text;
        this.labels = labels;
    }
}
