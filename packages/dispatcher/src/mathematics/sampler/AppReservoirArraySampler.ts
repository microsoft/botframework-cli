/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ReservoirArraySampler } from "./ReservoirArraySampler";

import { Utility } from "../../utility/Utility";

export function exampleFunctionReservoirArraySampler(): void {
    const sampler: ReservoirArraySampler<number> = new ReservoirArraySampler<number>();
    for (let index = 0; index < 100; index++) {
        sampler.addInstance(index);
    }
    Utility.debuggingLog(
        sampler.getInstances());
    Utility.debuggingLog(
        Object.keys(sampler.getInstances()));
    Utility.debuggingLog(
        "sampler.getNumberInstances() = " + sampler.getNumberInstances());
    Utility.debuggingLog(
        "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
    Utility.debuggingLog(
        "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
    Utility.debuggingLog(
        "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
    sampler.resetInstancesBeginEndIndex(10, 30);
    Utility.debuggingLog(
        "sampler.getNumberInstancesSampling() = " + sampler.getNumberInstancesSampling());
    Utility.debuggingLog(
        "sampler.getInstancesBeginIndex() = " + sampler.getInstancesBeginIndex());
    Utility.debuggingLog(
        "sampler.getInstancesEndIndex() = " + sampler.getInstancesEndIndex());
    Utility.debuggingLog(
        sampler.getInstances());
    const sampledInstances = sampler.sampleInstances(10);
    for (const instance of sampledInstances) {
        Utility.debuggingLog(
            instance);
    }
}

if (require.main === module) {
    exampleFunctionReservoirArraySampler();
}
