/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDictionaryStringIdGenericArray } from "../../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericValue } from "../../data_structure/IDictionaryStringIdGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { AbstractBaseBootstrapSampler } from "./AbstractBaseBootstrapSampler";

import { Utility } from "../../utility/Utility";

export class BootstrapSampler<T> extends
AbstractBaseBootstrapSampler<T, IDictionaryStringIdGenericValue<number>, IDictionaryStringIdGenericArray<T>> {

    public constructor(
        instances: IDictionaryStringIdGenericArray<T> = {},
        toResetLabelsAndMap: boolean = true,
        sampleSizeConfiguration: number = 1) {
            super(instances, toResetLabelsAndMap, sampleSizeConfiguration);
    }

    public addInstance(label: string, instance: T): void {
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

    public computeSamplingNumberInstancesPerLabel(label: string = ""): number {
        // ---- NOTE: can be overridden in child class.
        let numberInstancesPerLabelReduce: number =
            this.labels.reduce(
                (maxValue: number, key: string) =>
                 this.instances[key].length > maxValue ? this.instances[key].length : maxValue,
                 0);
        Utility.debuggingLog(`numberInstancesPerLabel=` +
            `${numberInstancesPerLabelReduce}`);
        Utility.debuggingLog(`numberInstancesPerLabelSpread-BEFORE-adjustment=` +
            `${numberInstancesPerLabelReduce}`);
        numberInstancesPerLabelReduce =
            Utility.getRoundInteger(numberInstancesPerLabelReduce * this.getSampleSizeConfiguration());
        return numberInstancesPerLabelReduce;
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ---- const numberInstancesPerLabelSpreadArray: number[] =
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ----     [...this.instances].map((x) => x[1].length);
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ---- Utility.debuggingLog(`numberInstancesPerLabelSpreadArray=` +
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ----     `${[...numberInstancesPerLabelSpreadArray]}`);
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ---- const numberInstancesPerLabelSpread: number =
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ----     Math.max(...[...this.instances].map((x) => x[1].length));
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ---- Utility.debuggingLog(`numberInstancesPerLabelSpread=` +
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ----     `${numberInstancesPerLabelSpread}`);
        // ---- NOTE-NEED-UNIT-TEST-TO-CHECK ---- return numberInstancesPerLabelSpread;
    }

    public createSampleInstancesGenerator(): Generator<T, void, unknown> {
        return this.sampleInstances();
    }

    public *sampleInstances() {
        for (const key in this.instances) {
            if (key) {
                // ---- Utility.debuggingLog(`sampleInstances(): key=` +
                // ----     `${key}`);
                const instanceArray: T[] = this.instances[key];
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
