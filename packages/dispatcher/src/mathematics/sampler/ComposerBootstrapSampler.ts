// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BootstrapSampler } from "./BootstrapSampler";
import { Utility } from "./../../Utility/Utility";

export interface IUtterance {
  text: string;
  intent: string;
  entities: any[];
}

export class ComposerBootstrapSampler extends BootstrapSampler<number> {
  private maxImbalanceRatio: number;
  private sampleSize: number;
  private utterances: IUtterance[] = [];

  public constructor(utterances: IUtterance[], maxImbalanceRatio: number, sampleSize: number) {
    super({}, true, sampleSize);
    this.utterances = utterances;
    this.maxImbalanceRatio = maxImbalanceRatio;
    this.sampleSize = sampleSize;

    utterances.forEach((e, index) => {
      this.addInstance(e.intent, index);
    });
  }

  public computeMaxBalanceNumber(): number {
    const numberInstancesPerLabelReduce: number = this.labels.reduce(
      (mini: number, key: string) => (this.instances[key].length < mini ? this.instances[key].length : mini),
      Number.MAX_SAFE_INTEGER,
    );

    return this.maxImbalanceRatio * numberInstancesPerLabelReduce;
  }

  public computeSamplingNumberInstancesPerLabel(label = ""): number {
    return this.computeMaxBalanceNumber() * this.sampleSize;
  }

  public getSampledUtterances() {
    if (this.maxImbalanceRatio) {
      this.resetLabelsAndMap();

      const sampledIndexes = this.sampleInstances();

      const set = new Set([...sampledIndexes]);

      return Array.from(set).map((index) => this.utterances[index]);
    } else {
      return this.utterances;
    }
  }

  // do re-sample if the ratio is beigher than the maxImbalanceRatio
  public *sampleInstances() {
    for (const key in this.instances) {
      if (this.instances.hasOwnProperty(key)) {
        const instanceArray: number[] = this.instances[key];
        const numberInstancesPerLabel: number = instanceArray.length;
        const maxBalanceNumber: number = this.computeMaxBalanceNumber();
        if (numberInstancesPerLabel > maxBalanceNumber) {
          const numberSamplingInstancesPerLabel: number = this.computeSamplingNumberInstancesPerLabel(key);
          for (let i = 0; i < numberSamplingInstancesPerLabel; i++) {
            const indexRandom = Utility.getRandomInt(numberInstancesPerLabel);
            yield instanceArray[indexRandom];
          }
        } else {
          for (let i = 0; i < numberInstancesPerLabel; i++) {
            yield instanceArray[i];
          }
        }
      }
    }
  }
}
