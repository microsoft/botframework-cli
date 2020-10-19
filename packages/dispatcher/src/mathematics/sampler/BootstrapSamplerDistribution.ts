/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDictionaryStringIdGenericArray } from "../../data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericValue } from "../../data_structure/IDictionaryStringIdGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { BootstrapSampler } from "./BootstrapSampler";

import { Utility } from "../../Utility/Utility";

export class BootstrapSamplerDistribution<T> extends
BootstrapSampler<T> {

    protected distribution: IDictionaryStringIdGenericValue<number> = {};

    public constructor(
        distribution: IDictionaryStringIdGenericValue<number> = {},
        instances: IDictionaryStringIdGenericArray<T> = {},
        toResetLabelsAndMap: boolean = true,
        sampleSizeConfiguration: number = 1) {
            super(instances, toResetLabelsAndMap, sampleSizeConfiguration);
            this.distribution = distribution;
    }

    public getDistribution(): IDictionaryStringIdGenericValue<number> {
        return this.distribution;
    }

    public computeSamplingNumberInstancesPerLabel(label: string = ""): number {
        const distribution: IDictionaryStringIdGenericValue<number> =
            this.getDistribution();
        if (DictionaryMapUtility.isEmptyStringIdGenericValueDictionary(distribution)) {
            return super.computeSamplingNumberInstancesPerLabel(label);
        }
        if (!(label in distribution)) {
            return 0;
        }
        let numberInstancesPerLabel: number =
            distribution[label];
        Utility.debuggingLog(`numberInstancesPerLabel-BEFORE-adjustment=` +
            `${numberInstancesPerLabel}`);
        numberInstancesPerLabel =
            Utility.getRoundInteger(numberInstancesPerLabel * this.getSampleSizeConfiguration());
        return numberInstancesPerLabel;
    }
}
