/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Utility} from "../utility/Utility";

export class Span {
    public offset: number;

    public length: number;

    constructor(offset: number, length: number) {
        this.offset = offset;
        this.length = length;
    }

    public toObject(toObfuscate: boolean = false): {
        "offset": number;
        "length": number; } {
        if (toObfuscate) {
            return this.toObfuscatedObject();
        }
        return this.toSimpleObject();
    }
    public toSimpleObject(): {
        "offset": number;
        "length": number; } {
        return {
            offset: this.offset,
            length: this.length,
        };
    }
    public toObfuscatedObject(): {
        "offset": number;
        "length": number; } {
        const offsetObfuscated: number = Utility.obfuscateNumber(this.offset);
        const lengthObfuscated: number = Utility.obfuscateNumber(this.length);
        return {
            offset: offsetObfuscated,
            length: lengthObfuscated,
        };
    }

    public equals(other: Span): boolean {
        if (other) {
            if (other.offset !== this.offset) {
                return false;
            }
            if (other.length !== this.length) {
                return false;
            }
            return true;
        }
        return false;
    }
}
