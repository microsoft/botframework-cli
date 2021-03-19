/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";

// ---- NOTE-FOR-REFERENCE ---- @deprecated — since v4.0.0 - use value === null instead.
// ---- NOTE-FOR-REFERENCE ---- 'isNull' is deprecatedts(6385)
// ---- NOTE-FOR-REFERENCE ---- import { isNull } from "util";
// ---- NOTE-FOR-REFERENCE ---- import { isUndefined } from "util";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export abstract class DataWithSubwordFeaturizer extends Data {

    protected featurizer: NgramSubwordFeaturizer;

    protected constructor(featurizer: NgramSubwordFeaturizer) {
        super();
        if (// ---- NOTE-FOR-REFERENCE ---- isNull(featurizer) || isUndefined(featurizer)
            (featurizer === null) || (featurizer === undefined)
        ) {
            Utility.debuggingThrow(
                "input featurizer is null");
        }
        this.featurizer = featurizer;
    }

    public resetFeaturizerLabelFeatureMaps(): void {
        this.getFeaturizer().resetLabelFeatureMaps(
            this.getIntentsUtterancesWeights());
    }
    public featurizeIntentsUtterances(): void {
        this.intentUtteranceSparseIndexArrays =
            this.getFeaturizer().createIntentUtteranceSparseIndexArrays(
                this.getIntentsUtterancesWeights());
    }
    public featurize(inputUtterance: string): string[] {
        return this.getFeaturizer().featurize(inputUtterance);
    }
    public getFeaturizer(): NgramSubwordFeaturizer {
        return this.featurizer;
    }
    public getFeaturizerLabels(): string[] {
        return this.getFeaturizer().getLabels();
    }
    public getFeaturizerLabelMap(): Map<string, number> {
        return this.getFeaturizer().getLabelMap();
    }
    public getFeaturizerFeatures(): string[] {
        return this.getFeaturizer().getFeatures();
    }
    public getFeaturizerFeatureMap(): Map<string, number> {
        return this.getFeaturizer().getFeatureMap();
    }
}
