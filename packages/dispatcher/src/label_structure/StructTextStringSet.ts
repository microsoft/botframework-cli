/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class StructTextStringSet {
    public text: string;
    public stringSet: Set<string>;

    constructor(text: string, stringSet: Set<string>) {
        this.text = text;
        this.stringSet = stringSet;
    }
}
