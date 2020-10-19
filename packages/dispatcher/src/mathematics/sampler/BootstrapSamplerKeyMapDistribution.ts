/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TMapStringKeyGenericArray } from "../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../data_structure/TMapStringKeyGenericValue";

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { BootstrapSamplerKeyMap } from "./BootstrapSamplerKeyMap";

import { Utility } from "../../Utility/Utility";

export class BootstrapSamplerKeyMapDistribution<T> extends
BootstrapSamplerKeyMap<T> {

    protected distribution: TMapStringKeyGenericValue<number> =
        DictionaryMapUtility.newTMapStringKeyGenericValue<number>();

    public constructor(
        distribution: TMapStringKeyGenericValue<number>,
        instances: TMapStringKeyGenericArray<T> = DictionaryMapUtility.newTMapStringKeyGenericArray<T>(),
        toResetLabelsAndMap: boolean = true,
        sampleSizeConfiguration: number = 1) {
            super(instances, toResetLabelsAndMap, sampleSizeConfiguration);
            this.distribution = distribution;
    }

    public getDistribution(): TMapStringKeyGenericValue<number> {
        return this.distribution;
    }

    public computeSamplingNumberInstancesPerLabel(label: string = ""): number {
        const distribution: TMapStringKeyGenericValue<number> =
            this.getDistribution();
        if (DictionaryMapUtility.isEmptyStringKeyGenericValueMap(distribution)) {
            return super.computeSamplingNumberInstancesPerLabel(label);
        }
        if (!distribution.has(label)) {
            return 0;
        }
        let numberInstancesPerLabel: number =
            distribution.get(label) as number;
        Utility.debuggingLog(`numberInstancesPerLabel-BEFORE-adjustment=` +
            `${numberInstancesPerLabel}`);
        numberInstancesPerLabel =
            Utility.getRoundInteger(numberInstancesPerLabel * this.getSampleSizeConfiguration());
        Utility.debuggingLog(`numberInstancesPerLabel=` +
            `${numberInstancesPerLabel}`);
        return numberInstancesPerLabel;
    }
}
