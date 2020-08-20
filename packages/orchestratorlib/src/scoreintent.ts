/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from './label';
import {Result} from './result';
import {Score} from './score';

export class ScoreIntent extends Score {
  public static newScoreIntent(
    intentLabel: string,
    score: number): ScoreIntent {
    return new ScoreIntent(
      intentLabel,
      score);
  }

  public intent: string;

  constructor(intent: string, score: number) {
    super(score);
    this.intent = intent;
  }

  public toObject(): {
    'intent': string;
    'score': number; } {
    return {
      intent: this.intent,
      score: this.score,
    };
  }

  public toResult(): Result {
    return new Result(
      Label.newIntentLabelByPosition(
        this.intent,
        0,
        0),
      this.score,
      '');
  }

  public equals(other: ScoreIntent): boolean {
    if (!super.equals(other)) {
      return false;
    }
    if (other) {
      if (other.intent !== this.intent) {
        return false;
      }
      return true;
    }
    return false;
  }
}
