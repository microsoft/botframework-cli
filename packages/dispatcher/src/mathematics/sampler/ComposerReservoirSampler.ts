// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ReservoirSampler } from "./ReservoirSampler";

import { IUtterance } from "./ComposerBootstrapSampler";

export class ComposerReservoirSampler extends ReservoirSampler<number> {
  private utterances: IUtterance[] = [];
  private maxUtteranceAllowed: number;

  public constructor(utterances: IUtterance[], maxUtteranceAllowed: number) {
    super({});
    this.utterances = utterances;
    this.maxUtteranceAllowed = maxUtteranceAllowed;
    utterances.forEach((e, index) => {
      this.addInstance(e.intent, index);
    });
  }

  public getSampledUtterances() {
    if (this.maxUtteranceAllowed && this.utterances.length > this.maxUtteranceAllowed) {
      this.resetLabelsAndMap();

      const sampledIndexes = this.sampleInstances(this.maxUtteranceAllowed);

      const set = new Set([...sampledIndexes]);

      return Array.from(set).map((index) => this.utterances[index]);
    } else {
      return this.utterances;
    }
  }
}
