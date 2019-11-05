/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { NgramSubwordFeaturizer } from "./ngram_subword_featurizer";

import { Utility } from "../../../utility/utility";

export function exampleFunctionNgramSubwordFeaturizer(): void {
    const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer();
    const input = "sdsd p  k-90yl m,.13 t!@ qefq# qef@Eg ljqefq";
    const result = featurizer.featurize(input);
    Utility.debuggingLog(input);
    Utility.debuggingLog(result);
    Utility.debuggingLog("hashing code = " + Utility.getPositiveStringHashCode(input));
    assert.throws(() => {
        Utility.debuggingLog("hashing index = " + featurizer.getHashingFeatureIndex(input)); },
        `featurizer.getNumberHashingFeatures()=${featurizer.getNumberHashingFeatures()}`);
}

if (require.main === module) {
    exampleFunctionNgramSubwordFeaturizer();
}
