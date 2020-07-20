/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface ITextFeaturizer {

    getIntentsUtterancesWeights(): { "intents": string[], "utterances": string[], "weights": number[] };

    getLabels(): string[];
    getLabelMap(): { [id: string]: number };
    getFeatures(): string[];
    getFeatureMap(): { [id: string]: number };
    getHashingFeatureArrays(): Array<Set<string>>;

    getNumberHashingFeaturesSetting(): number;

    getNumberLabels(): number;
    getNumberFeatures(): number;
    getNumberHashingFeatures(): number;

    getHashingFeatureIndex(feature: string): number;

    getLabelIndex(label: string, throwIfNonExistentLabel: boolean): number;
    getFeatureIndex(feature: string, throwIfNonExistentLabel: boolean): number;

    featurize(input: string): string[];
}
