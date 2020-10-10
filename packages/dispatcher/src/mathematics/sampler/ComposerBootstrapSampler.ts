// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BootstrapSampler } from './BootstrapSampler';
import { Utility } from './../../utility/Utility';

export interface IUtterance {
  text: string;
  intent: string;
  entities: any[];
}

export class ComposerBootstrapSampler extends BootstrapSampler<number> {
  private _maxImbalanceRatio: number;
  private _sampleSizeConfiguration: number;
  private _utterances: IUtterance[] = [];

  public constructor(utterances: IUtterance[], maxImbalanceRatio: number, sampleSizeConfiguration: number) {
    super({}, true, sampleSizeConfiguration);
    this._utterances = utterances;
    this._maxImbalanceRatio = maxImbalanceRatio;
    this._sampleSizeConfiguration = sampleSizeConfiguration;

    utterances.forEach((e, index) => {
      this.addInstance(e.intent, index);
    });
  }

  public computeMaxBalanceNumber(): number {
    const numberInstancesPerLabelReduce: number = this.labels.reduce(
      (mini: number, key: string) => (this.instances[key].length < mini ? this.instances[key].length : mini),
      Number.MAX_SAFE_INTEGER
    );

    return this._maxImbalanceRatio * numberInstancesPerLabelReduce;
  }

  public computeSamplingNumberInstancesPerLabel(label = ''): number {
    return this.computeMaxBalanceNumber() * this._sampleSizeConfiguration;
  }

  public getSampledUtterances() {
    if (this._maxImbalanceRatio) {
      this.resetLabelsAndMap();

      const sampledIndexes = this.sampleInstances();

      const set = new Set([...sampledIndexes]);

      return Array.from(set).map((index) => this._utterances[index]);
    } else {
      return this._utterances;
    }
  }

  //do re-sample if the ratio is beigher than the maxImbalanceRatio
  public *sampleInstances() {
    for (const key in this.instances) {
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
