/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export class Score {
  public score: number;

  constructor(score: number) {
    this.score = score;
  }

  public toObject(): {
    'score': number; } {
    return {
      score: this.score,
    };
  }

  public equals(other: Score): boolean {
    if (other) {
      if (other.score !== this.score) {
        return false;
      }
      return true;
    }
    return false;
  }
}
