/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// ---- NOTE ---- the following eslint disable should not have had needed.
// eslint-disable-next-line unicorn/filename-case
export class Span {
  constructor(offset: number, length: number) {
    this.offset = offset;
    this.length = length;
  }

  public toObject(): {
    'offset': number;
    'length': number; } {
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

  public offset: number;

  public length: number;
}
