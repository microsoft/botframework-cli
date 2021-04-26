/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ITextFeaturizer } from "./ITextFeaturizer";

export interface ISparseTextFeaturizer extends ITextFeaturizer {

    createFeatureSparseIndexArray(input: string): number[];

    createFeatureSparseIndexArrays(inputs: string[]): number[][];
    createIntentUtteranceSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] };

    createFeatureMiniBatchingSparseIndexArrays(
        inputs: string[],
        miniBatchIndexBegin: number,
        miniBatchIndexEnd: number): number[][];
    createIntentUtteranceMiniBatchingSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] },
        miniBatchIndexBegin: number,
        miniBatchIndexEnd: number):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] };

    createFeatureHashingSparseIndexArray(
        input: string): number[];

    createFeatureHashingSparseIndexArrays(
        inputs: string[]): number[][];
    createIntentUtteranceHashingSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] };
}
