/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDictionaryStringIdGenericArray } from "../../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericValue } from "../../data_structure/IDictionaryStringIdGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { AbstractBaseReservoirSampler } from "./AbstractBaseReservoirSampler";

import { Utility } from "../../utility/Utility";

export class ReservoirSampler<T> extends
AbstractBaseReservoirSampler<T, IDictionaryStringIdGenericValue<number>, IDictionaryStringIdGenericArray<T>> {

    public constructor(
        instances: IDictionaryStringIdGenericArray<T> = {},
        toResetLabelsAndMap: boolean = true) {
            super(instances, toResetLabelsAndMap);
    }

    public addInstance(label: string, instance: T) {
        if (label in this.instances) {
            this.instances[label].push(instance);
        } else {
            this.instances[label] = [instance];
        }
    }

    public resetLabelsAndMap(): void {
        this.labels =
            Object.keys(this.instances);
        this.labelMap =
            DictionaryMapUtility.buildStringIdNumberValueDictionaryFromUniqueStringArray(this.labels);
        DictionaryMapUtility.validateStringArrayAndStringIdNumberValueDictionary(
            this.labels,
            this.labelMap);
    }

    public getNumberInstances(): number {
        let numberInstances: number = 0;
        for (const key in this.instances) {
            if (key) {
                // ---- side effect is to remove TSLint warning for
                // ---- 'in' statements must be filtered with an if statement.
                const instanceArray: T[] = this.instances[key];
                numberInstances += instanceArray.length;
            }
        }
        return numberInstances;
    }

    public createSampleInstancesGenerator(
        sampleSize: number,
        minNumberPerLabel: number = 1,
        toShuffle: boolean = true): Generator<T, void, unknown> {
        return this.sampleInstances(
            sampleSize,
            minNumberPerLabel,
            toShuffle);
    }

    public *sampleInstances(
        sampleSize: number,
        minNumberPerLabel: number = 1,
        toShuffle: boolean = true) {
        const numberInstances = this.getNumberInstances();
        if (numberInstances > 0) {
            const numberLabels = this.getNumberLabels();
            if (minNumberPerLabel <= 0) {
                minNumberPerLabel = 1;
                // ---- NOTE: need at least one sample per label.
            }
            let sumMinNumberPerLabel = minNumberPerLabel * numberLabels;
            if (sumMinNumberPerLabel > sampleSize) {
                minNumberPerLabel = Math.floor(sampleSize / numberLabels);
                sumMinNumberPerLabel = minNumberPerLabel * numberLabels;
            }
            if (minNumberPerLabel < 1) {
                minNumberPerLabel = 1;
                sumMinNumberPerLabel = numberLabels;
            }
            if (sampleSize < numberLabels) {
                sampleSize = numberLabels;
                // ---- NOTE: need at least one sample per label.
                minNumberPerLabel = 1;
                sumMinNumberPerLabel = numberLabels;
            }
            if (toShuffle) {
                for (const key in this.instances) {
                    if (key) {
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = this.instances[key];
                        Utility.shuffle(instanceArray);
                    }
                }
            }
            if (sampleSize >= numberInstances) {
                // ---- NOT: return every instance if sampleSize is bigger than the size of the instances.
                for (const key in this.instances) {
                    if (key) {
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = this.instances[key];
                        for (const instance of instanceArray) {
                            yield instance;
                        }
                    }
                }
            } else {
                let numberSampled: number = 0;
                for (const key in this.instances) {
                    if (key) {
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = this.instances[key];
                        const instanceArrayLength: number = instanceArray.length;
                        for (let index: number = 0; index < minNumberPerLabel; index++) {
                            if (index >= instanceArrayLength) {
                                break;
                            }
                            yield instanceArray[index];
                            numberSampled++;
                        }
                    }
                }
                sampleSize -= numberSampled;
                if (sampleSize > 0) {
                    let indexSampled: number = 0;
                    const sampledInstances: T[] = new Array(sampleSize);
                    for (const key in this.instances) {
                        if (key) {
                            // ---- side effect is to remove TSLint warning for
                            // ---- 'in' statements must be filtered with an if statement.
                            const instanceArray: T[] = this.instances[key];
                            const instanceArrayLength: number = instanceArray.length;
                            for (let index: number = minNumberPerLabel; index < instanceArrayLength; index++) {
                                if (indexSampled < sampleSize) {
                                    sampledInstances[indexSampled++] = instanceArray[index];
                                } else {
                                    const indexRandom = Utility.getRandomInt(++indexSampled);
                                    if (indexRandom < sampleSize) {
                                        sampledInstances[indexRandom] = instanceArray[index];
                                    }
                                }
                            }
                        }
                    }
                    for (const instance of sampledInstances) {
                        yield instance;
                    }
                }
            }
        }
    }
}
