/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapStringKeyGenericArray } from "../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../data_structure/TMapStringKeyGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { AbstractBaseBootstrapSampler } from "./AbstractBaseBootstrapSampler";

import { Utility } from "../../Utility/Utility";

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

    public computeSamplingNumberInstancesPerLabel(label: string = ""): number {
        // ---- NOTE: can be overridden in child class.
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ---- const numberInstancesPerLabelReduce: number =
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ----     this.labels.reduce(
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ----         (maxValue: number, key: string) =>
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ----         (this.instances.get(key) as T[]).length > maxValue ? (this.instances.get(key) as T[]).length : maxValue,
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ----         0);
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ---- Utility.debuggingLog(`numberInstancesPerLabelReduce=` +
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ----     `${numberInstancesPerLabelReduce}`);
        // ---- NOTE-DOES-NOT-WORK-NEED-TO-CHECK ---- return numberInstancesPerLabelReduce;
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
