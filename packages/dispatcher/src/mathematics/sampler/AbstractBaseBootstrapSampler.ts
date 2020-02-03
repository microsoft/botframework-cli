/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AbstractBaseSampler } from "./AbstractBaseSampler";

import { Utility } from "../../utility/Utility";

export abstract class AbstractBaseBootstrapSampler<T, TLabelMap, TInstances> extends
AbstractBaseSampler<T, TLabelMap, TInstances> {

    protected sampleSizeConfiguration: number  = 1;

    public constructor(
        instances: TInstances,
        toResetLabelsAndMap: boolean = true,
        sampleSizeConfiguration: number = 1) {
            super(instances, toResetLabelsAndMap);
    }

    public getSampleSizeConfiguration(): number {
        return this.sampleSizeConfiguration;
    }

    public abstract createSampleInstancesGenerator(): Generator<T, void, unknown>;
}
