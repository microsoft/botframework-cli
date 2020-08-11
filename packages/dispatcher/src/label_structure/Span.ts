/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Span {
    public offset: number;

    public length: number;

    constructor(offset: number, length: number) {
        this.offset = offset;
        this.length = length;
    }

    public toObject(): {
        "offset": number;
        "length": number; } {
        return {
            offset: this.offset,
            length: this.length,
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
