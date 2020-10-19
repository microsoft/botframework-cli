/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AbstractBaseSampler } from "./AbstractBaseSampler";

import { Utility } from "../../Utility/Utility";

export abstract class AbstractBaseReservoirSampler<T, TLabelMap, TInstances> extends
AbstractBaseSampler<T, TLabelMap, TInstances> {

    public constructor(
        instances: TInstances,
        toResetLabelsAndMap: boolean = true) {
            super(instances, toResetLabelsAndMap);
    }

    public abstract createSampleInstancesGenerator(
        sampleSize: number,
        minNumberPerLabel: number,
        toShuffle: boolean): Generator<T, void, unknown>;
}
