/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapStringKeyGenericArray } from "../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../data_structure/TMapStringKeyGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { AbstractBaseBootstrapSampler } from "./AbstractBaseBootstrapSampler";

import { Utility } from "../../utility/Utility";

export class BootstrapSamplerKeyMap<T> extends
AbstractBaseBootstrapSampler<T, TMapStringKeyGenericValue<number>, TMapStringKeyGenericArray<T>> {

    public constructor(
        instances: TMapStringKeyGenericArray<T> =
            DictionaryMapUtility.newTMapStringKeyGenericArray<T>(),
        toResetLabelsAndMap: boolean = true,
        sampleSizeConfiguration: number = 1) {
            super(instances, toResetLabelsAndMap, sampleSizeConfiguration);
    }

    public addInstance(label: string, instance: T): void {
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
                /** ---- NOTE ---- need an if statement to remove a TSLint warning for using "in"
                 *  Utility.debuggingLog(`sampleInstances(): entry=` +
                 *      `${entry}`);
                 */
                const instanceArray: T[] = entry[1];
                numberInstances += instanceArray.length;
            }
        }
        return numberInstances;
    }

    public computeSamplingNumberInstancesPerLabel(label: string = ""): number {
        // ---- NOTE: can be overridden in child class.
        /** ---- NOTE-FOR-REFERENCE-IMPLEMENTATION-DOES-NOT-WORK-NEED-TO-DOUBLE-CHECK ----
         *  const numberInstancesPerLabelReduce: number =
         *      this.labels.reduce(
         *          (maxValue: number, key: string) =>
         *            ((this.instances.get(key) as T[]).length > maxValue) ?
         *            (this.instances.get(key) as T[]).length :
         *            maxValue,
         *          0);
         *  Utility.debuggingLog(`numberInstancesPerLabelReduce=` +
         *      `${numberInstancesPerLabelReduce}`);
         *  return numberInstancesPerLabelReduce;
         */
        const numberInstancesPerLabelSpreadArray: number[] =
            [...this.instances].map((x) => x[1].length);
        Utility.debuggingLog(`numberInstancesPerLabelSpreadArray=` +
            `${[...numberInstancesPerLabelSpreadArray]}`);
        let numberInstancesPerLabelSpread: number =
            Math.max(...[...this.instances].map((x) => x[1].length));
        Utility.debuggingLog(`numberInstancesPerLabelSpread-BEFORE-adjustment=` +
            `${numberInstancesPerLabelSpread}`);
        numberInstancesPerLabelSpread =
            Utility.getRoundInteger(numberInstancesPerLabelSpread * this.getSampleSizeConfiguration());
        Utility.debuggingLog(`numberInstancesPerLabelSpread=` +
            `${numberInstancesPerLabelSpread}`);
        return numberInstancesPerLabelSpread;
    }

    public createSampleInstancesGenerator(): Generator<T, void, unknown> {
        return this.sampleInstances();
    }

    public *sampleInstances() {
        for (const entry of this.instances) {
            if (entry) {
                // ---- Utility.debuggingLog(`sampleInstances(): entry=` +
                // ----     `${entry}`);
                const key: string = entry[0];
                const instanceArray: T[] = entry[1];
                const numberInstancesPerLabel: number = instanceArray.length;
                if (numberInstancesPerLabel > 0) {
                    const numberSamplingInstancesPerLabel: number =
                        this.computeSamplingNumberInstancesPerLabel(key);
                    for (let i: number = 0; i < numberSamplingInstancesPerLabel; i++) {
                        const indexRandom =
                            Utility.getRandomInt(numberInstancesPerLabel);
                        yield instanceArray[indexRandom];
                    }
                }
            }
        }
    }
}
