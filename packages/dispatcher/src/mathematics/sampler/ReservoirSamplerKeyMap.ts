/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapStringKeyGenericArray } from "../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../data_structure/TMapStringKeyGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { AbstractBaseReservoirSampler } from "./AbstractBaseReservoirSampler";

import { Utility } from "../../utility/Utility";

export class ReservoirSamplerKeyMap<T> extends
AbstractBaseReservoirSampler<T, TMapStringKeyGenericValue<number>, TMapStringKeyGenericArray<T>> {

    public constructor(
        instances: TMapStringKeyGenericArray<T> = DictionaryMapUtility.newTMapStringKeyGenericArray<T>(),
        toResetLabelsAndMap: boolean = true) {
            super(instances, toResetLabelsAndMap);
    }

    public addInstance(label: string, instance: T) {
        if (this.instances.has(label)) {
            (this.instances.get(label) as T[]).push(instance);
        } else {
            this.instances.set(label, [instance]);
        }
    }

    public resetLabelsAndMap(): void {
        this.labels =
            Object.keys(this.instances);
        this.labelMap =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromUniqueStringArray(this.labels);
        DictionaryMapUtility.validateStringArrayAndStringKeyNumberValueMap(
            this.labels,
            this.labelMap);
    }

    public getNumberInstances(): number {
        let numberInstances: number = 0;
        for (const entry of this.instances) {
            if (entry) {
                // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                // ----     `${entry}`);
                // ---- side effect is to remove TSLint warning for
                // ---- 'in' statements must be filtered with an if statement.
                const instanceArray: T[] = entry[1];
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
                for (const entry of this.instances) {
                    if (entry) {
                        // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                        // ----     `${entry}`);
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = entry[1];
                        Utility.shuffle(instanceArray);
                    }
                }
            }
            if (sampleSize >= numberInstances) {
                // ---- NOT: return every instance if sampleSize is bigger than the size of the instances.
                for (const entry of this.instances) {
                    if (entry) {
                        // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                        // ----     `${entry}`);
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = entry[1];
                        for (const instance of instanceArray) {
                            yield instance;
                        }
                    }
                }
            } else {
                let numberSampled: number = 0;
                for (const entry of this.instances) {
                    if (entry) {
                        // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                        // ----     `${entry}`);
                        // ---- side effect is to remove TSLint warning for
                        // ---- 'in' statements must be filtered with an if statement.
                        const instanceArray: T[] = entry[1];
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
                    for (const entry of this.instances) {
                        if (entry) {
                            // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                            // ----     `${entry}`);
                            // ---- side effect is to remove TSLint warning for
                            // ---- 'in' statements must be filtered with an if statement.
                            const instanceArray: T[] = entry[1];
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
