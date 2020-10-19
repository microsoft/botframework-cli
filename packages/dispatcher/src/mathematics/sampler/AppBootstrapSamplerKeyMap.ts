/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DictionaryMapUtility } from "../../data_structure/DictionaryMapUtility";

import { TMapStringKeyGenericArray } from "../../data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericValue } from "../../data_structure/TMapStringKeyGenericValue";

import { BootstrapSamplerKeyMap } from "./BootstrapSamplerKeyMap";

import { Utility } from "../../Utility/Utility";

export function exampleFunctionBootstrapSamplerKeyMap(): void {
    const sampler: BootstrapSamplerKeyMap<string> =
        new BootstrapSamplerKeyMap<string>(DictionaryMapUtility.newTMapStringKeyGenericArray<string>());
    sampler.addInstance("label0", "label0 - utterance 0");
    sampler.addInstance("label0", "label0 - utterance 1");
    sampler.addInstance("label0", "label0 - utterance 2");
    sampler.addInstance("label0", "label0 - utterance 3");
    sampler.addInstance("label1", "label1 - utterance 0");
    sampler.addInstance("label1", "label1 - utterance 1");
    sampler.addInstance("label2", "label2 - utterance 0");
    sampler.addInstance("label2", "label2 - utterance 1");
    sampler.addInstance("label2", "label2 - utterance 2");
    sampler.addInstance("label2", "label2 - utterance 3");
    sampler.addInstance("label2", "label2 - utterance 4");
    sampler.addInstance("label2", "label2 - utterance 5");
    sampler.resetLabelsAndMap();
    Utility.debuggingLog(
        sampler.getInstances());
    Utility.debuggingLog(
        Object.keys(sampler.getInstances()));
    Utility.debuggingLog(
        "sampler.getNumberInstances() = " + sampler.getNumberInstances());
    Utility.debuggingLog(
        "sampler.getNumberLabels() = " + sampler.getNumberLabels());
    Utility.debuggingLog(
        sampler.getLabels());
    Utility.debuggingLog(
        sampler.getLabelMap());
    Utility.debuggingLog(
        sampler.getInstances());
    const sampledInstances = sampler.sampleInstances();
    for (const instance of sampledInstances) {
        Utility.debuggingLog(
            instance);
    }
}

export function exampleFunctionBootstrapSamplerKeyMapWithArrayInput(): void {
    const instances: TMapStringKeyGenericArray<number> =
        DictionaryMapUtility.newTMapStringKeyGenericArray<number>();
    instances.set("a", [0, 1, 2, 3]);
    instances.set("b", [4, 5, 6]);
    instances.set("c", [7, 8, 9]);
    const sampler: BootstrapSamplerKeyMap<number> =
        new BootstrapSamplerKeyMap<number>(instances);
    const typeInstances = typeof instances;
    Utility.debuggingLog(
        `typeInstances=${typeInstances}`);
    Utility.debuggingLog(
        `typeInstances=${typeInstances}`);
    Utility.debuggingLog(
        sampler.getInstances());
    Utility.debuggingLog(
        Object.keys(sampler.getInstances()));
    Utility.debuggingLog(
        "sampler.getNumberInstances() = " + sampler.getNumberInstances());
    Utility.debuggingLog(
        "sampler.getNumberLabels() = " + sampler.getNumberLabels());
    Utility.debuggingLog(
        sampler.getLabels());
    Utility.debuggingLog(
        sampler.getLabelMap());
    Utility.debuggingLog(
        sampler.getInstances());
    const sampledInstances = sampler.sampleInstances();
    for (const instance of sampledInstances) {
        Utility.debuggingLog(
            instance);
    }
}

if (require.main === module) {
    exampleFunctionBootstrapSamplerKeyMap();
    exampleFunctionBootstrapSamplerKeyMapWithArrayInput();
}
