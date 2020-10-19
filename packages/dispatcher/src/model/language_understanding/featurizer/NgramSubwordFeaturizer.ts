/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITextFeaturizer } from "./ITextFeaturizer";
import { ISparseTextFeaturizer } from "./ISparseTextFeaturizer";

import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { Utility } from "../../../utility/Utility";

export class NgramSubwordFeaturizer implements ISparseTextFeaturizer {

    protected numberHashingFeaturesSetting: number = 0;

    protected subwordNgramBegin: number = 3;
    protected subwordNgramEnd: number = 4;
    protected toLowercase: boolean = true;
    protected toRemovePunctuations: boolean = false;
    protected toRemoveEmptyElements: boolean = true;
    protected splitDelimiter: string = " ";

    protected intentsUtterancesWeights:
        { "intents": string[], "utterances": string[], "weights": number[] } = {
            intents: [],
            utterances: [],
            weights: [] };

    protected labels: string[] = [];
    protected labelMap: Map<string, number> = new  Map<string, number>();
    protected features: string[] = [];
    protected featureMap: Map<string, number> = new  Map<string, number>();
    protected hashingFeatureArrays: Array<Set<string>> = [];

    constructor(
        subwordNgramBegin: number = 3,
        subwordNgramEnd: number = 4,
        toLowercase: boolean = true,
        toRemovePunctuations: boolean = false,
        toRemoveEmptyElements: boolean = true,
        splitDelimiter: string = " ",
        numberHashingFeaturesSetting: number = 0) {
        this.subwordNgramBegin = subwordNgramBegin;
        this.subwordNgramEnd = subwordNgramEnd;
        this.toLowercase = toLowercase;
        this.toRemovePunctuations = toRemovePunctuations;
        this.toRemoveEmptyElements = toRemoveEmptyElements;
        this.splitDelimiter = splitDelimiter;
        this.numberHashingFeaturesSetting = numberHashingFeaturesSetting;
    }

    public getIntentsUtterancesWeights(): { "intents": string[], "utterances": string[], "weights": number[] } {
        return this.intentsUtterancesWeights;
    }

    public getLabels(): string[] {
        return this.labels;
    }
    public getLabelMap(): Map<string, number> {
        return this.labelMap;
    }
    public getFeatures(): string[] {
        return this.features;
    }
    public getFeatureMap(): Map<string, number> {
        return this.featureMap;
    }
    public getHashingFeatureArrays(): Array<Set<string>> {
        return this.hashingFeatureArrays;
    }

    public getNumberHashingFeaturesSetting(): number {
        return this.numberHashingFeaturesSetting;
    }

    public getNumberLabels(): number {
        return this.getLabels().length;
    }
    public getNumberFeatures(): number {
        return this.getFeatures().length;
    }
    public getNumberHashingFeatures(): number {
        return this.getHashingFeatureArrays().length;
    }

    public getHashingFeatureIndex(feature: string): number {
        const numberHashingFeatures: number =
            this.getNumberHashingFeatures();
        if (numberHashingFeatures <= 0) {
            Utility.debuggingThrow(
                "numberHashingFeaturesSetting <= 0");
        }
        const featureHashCode: number = Utility.getPositiveStringHashCode(feature);
        return (featureHashCode % numberHashingFeatures);
    }

    public getLabelIndex(label: string, throwIfNonExistentLabel: boolean = true): number {
        if (Utility.isEmptyString(label)) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (this.labelMap.has(label)) {
            labelId = this.labelMap.get(label) as number;
        }
        if (labelId < 0) {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(this.labelMap)}`);
            }
        }
        return labelId;
    }
    public getFeatureIndex(feature: string, throwIfNonExistentLabel: boolean = true): number {
        if (!feature) {
            Utility.debuggingThrow("feature == null");
        }
        let featureId: number = -1;
        if (!this.featureMap) {
            Utility.debuggingThrow("this.featureMap == null");
        }
        if (this.featureMap.has(feature)) {
            featureId = this.featureMap.get(feature) as number;
        }
        if (featureId < 0) {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`feature=${feature} does not exist in this.featureMap=${this.featureMap}`);
            }
        }
        return featureId;
    }

    public createFeatureSparseIndexArray(input: string): number[] {
        const featureSparseIndexArray: number[] = new Array<number>();
        const features: string[] = this.featurize(input);
        if (!this.featureMap) {
            Utility.debuggingThrow("this.featureMap==null");
        }
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string) {
            if (!feature) {
                Utility.debuggingThrow(`EXCEPTION: feature==null, input=$${input}$, feature=$${feature}$`);
            }
            let featureId: number = -1;
            if (this.featureMap.has(feature)) {
                featureId = this.featureMap.get(feature) as number;
            }
            if (featureId >= 0) {
                featureSparseIndexArray.push(featureId);
            }
        }, this);
        return featureSparseIndexArray;
    }

    public createFeatureSparseIndexArrays(inputs: string[]): number[][] {
        const inputArrays: number[][] =
            inputs.map((input) => this.createFeatureSparseIndexArray(input), this);
        return inputArrays;
    }

    public createIntentUtteranceSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArray: number[] =
            intents.map((intent) => this.getLabelIndex(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureSparseIndexArray(utterance), this);
        return { intentLabelIndexArray, utteranceFeatureIndexArrays };
    }

    public createFeatureMiniBatchingSparseIndexArrays(
        inputs: string[],
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0): number[][] {
        if (miniBatchIndexBegin < 0) {
            miniBatchIndexBegin = 0;
        }
        if (miniBatchIndexEnd <= 0) {
            miniBatchIndexEnd = inputs.length;
        }
        const miniBatchNumber: number =
            miniBatchIndexEnd - miniBatchIndexBegin;
        if (miniBatchNumber <= 0) {
            Utility.debuggingThrow(
                `miniBatchNumber <= 0`);
        }
        const inputArrays: number[][] =
            new Array<number[]>(miniBatchNumber);
        let miniBatchIndex = 0;
        for (let i: number = miniBatchIndexBegin; i < miniBatchIndexEnd; i++) {
            inputArrays[miniBatchIndex++] =
                this.createFeatureSparseIndexArray(inputs[i]);
        }
        return inputArrays;
    }

    public createIntentUtteranceMiniBatchingSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArray: number[] = intents
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((intent) => this.getLabelIndex(intent), this);
        const utteranceFeatureIndexArrays: number[][] = utterances
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((utterance) => this.createFeatureSparseIndexArray(utterance), this);
        return { intentLabelIndexArray, utteranceFeatureIndexArrays };
    }

    public createFeatureHashingSparseIndexArray(
        input: string): number[] {
        const featureArray: number[] = new Array();
        const features: string[] = this.featurize(input);
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string) {
            if (!feature) {
                Utility.debuggingThrow("feature==null");
            }
            const featureId: number = this.getHashingFeatureIndex(feature);
            if (featureId >= 0) {
                featureArray.push(featureId);
            }
        }, this);
        return featureArray;
    }

    public createFeatureHashingSparseIndexArrays(
        inputs: string[]): number[][] {
        const inputArrays: number[][] =
            inputs.map((input) => this.createFeatureHashingSparseIndexArray(input), this);
        return inputArrays;
    }

    public createIntentUtteranceHashingSparseIndexArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArray: number[] =
            intents.map((intent) => this.getLabelIndex(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureHashingSparseIndexArray(utterance), this);
        return { intentLabelIndexArray, utteranceFeatureIndexArrays };
    }

    public createLabelOneHotEncoderBooleanArray(
        label: string,
        throwIfNonExistentLabel: boolean = true): boolean[] {
        if (Utility.isEmptyString(label)) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (this.labelMap.has(label)) {
            labelId = this.labelMap.get(label) as number;
        }
        const numberLabels: number = this.getNumberLabels();
        const labelArray: boolean[] = new Array(numberLabels).fill(0);
        if (labelId >= 0) {
            labelArray[labelId] = true;
        } else {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(this.labelMap)}`);
            }
        }
        return labelArray;
    }
    public createLabelOneHotEncoderNumberArray(
        label: string,
        throwIfNonExistentLabel: boolean = true): number[] {
        if (Utility.isEmptyString(label)) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (this.labelMap.has(label)) {
            labelId = this.labelMap.get(label) as number;
        }
        const numberLabels: number = this.getNumberLabels();
        const labelArray: number[] = new Array(numberLabels).fill(0);
        if (labelId >= 0) {
            labelArray[labelId] = 1;
        } else {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${DictionaryMapUtility.jsonStringifyStringKeyGenericValueNativeMap(this.labelMap)}`);
            }
        }
        return labelArray;
    }

    public createFeatureOneHotEncoderBooleanArray(
        input: string): boolean[] {
        const numberFeatures: number = this.getNumberFeatures();
        const featureArray: boolean[] = new Array(numberFeatures).fill(0);
        const features: string[] = this.featurize(input);
        if (!this.featureMap) {
            Utility.debuggingThrow("this.featureMap == null");
        }
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string) {
            if (!feature) {
                Utility.debuggingThrow("feature==null");
            }
            let featureId: number = -1;
            if (this.featureMap.has(feature)) {
                featureId = this.featureMap.get(feature) as number;
            }
            if (featureId >= 0) {
                featureArray[featureId] = true;
            }
        }, this);
        return featureArray;
    }
    public createFeatureOneHotEncoderNumberArray(
        input: string): number[] {
        const numberFeatures: number = this.getNumberFeatures();
        const featureArray: number[] = new Array(numberFeatures).fill(0);
        const features: string[] = this.featurize(input);
        if (!this.featureMap) {
            Utility.debuggingThrow("this.featureMap==null");
        }
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string) {
            if (!feature) {
                Utility.debuggingThrow(`EXCEPTION: feature==null, input=$${input}$, feature=$${feature}$`);
            }
            let featureId: number = -1;
            if (this.featureMap.has(feature)) {
                featureId = this.featureMap.get(feature) as number;
            }
            if (featureId >= 0) {
                featureArray[featureId] = 1;
            }
        }, this);
        return featureArray;
    }

    public createFeatureOneHotEncoderBooleanArrays(
        inputs: string[]): boolean[][] {
        const inputArrays: boolean[][] =
            inputs.map((input) => this.createFeatureOneHotEncoderBooleanArray(input), this);
        return inputArrays;
    }
    public createFeatureOneHotEncoderNumberArrays(
        inputs: string[]): number[][] {
        const inputArrays: number[][] =
            inputs.map((input) => this.createFeatureOneHotEncoderNumberArray(input), this);
        return inputArrays;
    }

    public createIntentUtteranceOneHotEncoderBooleanArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: boolean[][] =
            intents.map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] =
            utterances.map((utterance) => this.createFeatureOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceOneHotEncoderNumberArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: number[][] =
            intents.map((intent) => this.createLabelOneHotEncoderNumberArray(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureOneHotEncoderNumberArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }

    public createFeatureMiniBatchingOneHotEncoderBooleanArrays(
        inputs: string[],
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0): boolean[][] {
        if (miniBatchIndexBegin < 0) {
            miniBatchIndexBegin = 0;
        }
        if (miniBatchIndexEnd <= 0) {
            miniBatchIndexEnd = inputs.length;
        }
        const miniBatchNumber: number =
            miniBatchIndexEnd - miniBatchIndexBegin;
        if (miniBatchNumber <= 0) {
            return new Array<boolean[]>();
        }
        const inputArrays: boolean[][] =
            new Array<boolean[]>(miniBatchNumber);
        let miniBatchIndex = 0;
        for (let i: number = miniBatchIndexBegin; i < miniBatchIndexEnd; i++) {
            inputArrays[miniBatchIndex++] =
                this.createFeatureOneHotEncoderBooleanArray(inputs[i]);
        }
        return inputArrays;
    }
    public createFeatureMiniBatchingOneHotEncoderNumberArrays(
        inputs: string[],
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0): number[][] {
        if (miniBatchIndexBegin < 0) {
            miniBatchIndexBegin = 0;
        }
        if (miniBatchIndexEnd <= 0) {
            miniBatchIndexEnd = inputs.length;
        }
        const miniBatchNumber: number =
            miniBatchIndexEnd - miniBatchIndexBegin;
        if (miniBatchNumber <= 0) {
            return new Array<number[]>();
        }
        const inputArrays: number[][] =
            new Array<number[]>(miniBatchNumber);
        let miniBatchIndex = 0;
        for (let i: number = miniBatchIndexBegin; i < miniBatchIndexEnd; i++) {
            inputArrays[miniBatchIndex++] =
                this.createFeatureOneHotEncoderNumberArray(inputs[i]);
        }
        return inputArrays;
    }

    public createIntentUtteranceMiniBatchingOneHotEncoderBooleanArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: boolean[][] = intents
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] = utterances
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((utterance) => this.createFeatureOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceMiniBatchingOneHotEncoderNumberArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: number[][] = intents
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((intent) => this.createLabelOneHotEncoderNumberArray(intent), this);
        const utteranceFeatureIndexArrays: number[][] = utterances
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((utterance) => this.createFeatureOneHotEncoderNumberArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }

    public createFeatureHashingOneHotEncoderBooleanArray(input: string): boolean[] {
        const featureArray: boolean[] = new Array(this.numberHashingFeaturesSetting).fill(0);
        const features: string[] = this.featurize(input);
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string, index: number, array: string[]) {
            if (!feature) {
                Utility.debuggingThrow("feature==null");
            }
            const featureId: number = this.getHashingFeatureIndex(feature);
            if (featureId >= 0) {
                featureArray[featureId] = true;
            }
        }, this);
        return featureArray;
    }
    public createFeatureHashingOneHotEncoderNumberArray(input: string): number[] {
        const featureArray: number[] = new Array(this.numberHashingFeaturesSetting).fill(0);
        const features: string[] = this.featurize(input);
        features.forEach(function(this: NgramSubwordFeaturizer, feature: string, index: number, array: string[]) {
            if (!feature) {
                Utility.debuggingThrow("feature==null");
            }
            const featureId: number = this.getHashingFeatureIndex(feature);
            if (featureId >= 0) {
                featureArray[featureId] = 1;
            }
        }, this);
        return featureArray;
    }

    public createFeatureHashingOneHotEncoderBooleanArrays(inputs: string[]): boolean[][] {
        const inputArrays: boolean[][] =
            inputs.map((input) => this.createFeatureHashingOneHotEncoderBooleanArray(input), this);
        return inputArrays;
    }
    public createFeatureHashingOneHotEncoderNumberArrays(inputs: string[]): number[][] {
        const inputArrays: number[][] =
            inputs.map((input) => this.createFeatureHashingOneHotEncoderNumberArray(input), this);
        return inputArrays;
    }

    public createIntentUtteranceHashingOneHotEncoderBooleanArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: boolean[][] =
            intents.map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] =
            utterances.map((utterance) => this.createFeatureHashingOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceHashingOneHotEncoderNumberArrays(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        const intentLabelIndexArrays: number[][] =
            intents.map((intent) => this.createLabelOneHotEncoderNumberArray(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureHashingOneHotEncoderNumberArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }

    public featurize(input: string): string[] {
        if (this.toLowercase) {
            input = input.toLowerCase();
        }
        let result: string[] = this.split(input);
        if (this.toRemovePunctuations) {
            result = result.filter((element: string) => {
                return (!Utility.LanguageTokenPunctuationDelimitersSet.has(element as string));
            });
        }
        const subwordFeatures: string[] = this.generateSubwords(result.join(this.splitDelimiter));
        return result.concat(subwordFeatures);
    }

    public split(input: string): string[] {
        return this.splitRaw(
            input).map((x: string) => x.trim());
    }
    public splitRaw(input: string): string[] {
        return Utility.splitByPunctuation(
            input,
            this.splitDelimiter,
            this.toRemoveEmptyElements);
    }

    public generateSubwords(input: string): string[] {
        const result: string[] = [];
        if ((this.subwordNgramBegin > 0) && (this.subwordNgramEnd >= this.subwordNgramBegin)) {
            const length = input.length;
            for (let ngram = this.subwordNgramBegin; ngram <= this.subwordNgramEnd; ngram++) {
                for (let i = 0; i < length - ngram; i++) {
                    result.push(input.substr(i, ngram));
                }
            }
        }
        return result;
    }

    public resetLabelFeatureMaps(
        intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] }): void {
        // -------------------------------------------------------------------
        this.intentsUtterancesWeights =
            intentsUtterancesWeights;
        // -------------------------------------------------------------------
        const intents: string[] =
            intentsUtterancesWeights.intents;
        const intentLabels: { "stringArray": string[], "stringMap": Map<string, number> } =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromStringArray(intents);
        this.labels =
            intentLabels.stringArray;
        this.labelMap =
            intentLabels.stringMap;
        // -------------------------------------------------------------------
        const utterances: string[] =
            intentsUtterancesWeights.utterances;
        const featureArray: string[][] =
            utterances.map((text) => this.featurize(text));
        // ---- NOTE-FOR-REFERENCE ---- let featureArrayFlattened: string[] =
        // ---- NOTE-FOR-REFERENCE ----     [];
        // ---- NOTE-FOR-REFERENCE ---- for (let i: number = 0; i < featureArray.length; i++) {
        // ---- NOTE-FOR-REFERENCE ----     featureArrayFlattened = featureArrayFlattened.concat(featureArray[i]);
        // ---- NOTE-FOR-REFERENCE ---- }
        // ---- NOTE-FOR-REFERENCE ---- NOTE ---- for a large file, the loop above can take a long time!
        // ---- NOTE-FOR-REFERENCE ---- const featureArrayFlattened: string[] =
        // ---- NOTE-FOR-REFERENCE ----     ([] as string[]).concat(...featureArray);
        // ---- NOTE-FOR-REFERENCE ---- NOTE ---- for a large file, the above "Spread Operator" can lead to
        // ---- NOTE-FOR-REFERENCE ---- NOTE ---- RangeError: Maximum call stack size exceeded!
        // ---- NOTE-FOR-REFERENCE ---- const utteranceTexts: {
        // ---- NOTE-FOR-REFERENCE ----     "stringArray": string[],
        // ---- NOTE-FOR-REFERENCE ----     "stringMap": Map<string, number> } =
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-FOR-REFERENCE ----     DictionaryMapUtility.buildStringIdNumberValueDictionaryFromStringArray(featureArrayFlattened);
        const utteranceTexts: {
            "stringArray": string[],
            "stringMap": Map<string, number> } =
            DictionaryMapUtility.buildStringKeyNumberValueMapFromStringArrays(featureArray);
        this.features =
            utteranceTexts.stringArray;
        this.featureMap =
            utteranceTexts.stringMap;
        // -------------------------------------------------------------------
        if (this.numberHashingFeaturesSetting > 0) {
            this.hashingFeatureArrays = new Array<Set<string>>(this.numberHashingFeaturesSetting);
            for (let i: number = 0; i < this.numberHashingFeaturesSetting; i++) {
                this.hashingFeatureArrays[i] = new Set<string>();
            }
            for (const feature of this.features) {
                const featureHashingIndex: number = this.getHashingFeatureIndex(feature as string);
                this.hashingFeatureArrays[featureHashingIndex].add(feature as string);
            }
        }
        // -------------------------------------------------------------------
        // return {
        //     "labels": this.labels,
        //     "labelMap": this.labelMap,
        //     "features": this.features,
        //     "featureMap": this.featureMap
        // };
        // -------------------------------------------------------------------
    }

    public serializeToJsonString(
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        return JSON.stringify(this, replacer, space);
    }
    public deserializeFromJsonString(jsonString: string): void {
        const deserialized: NgramSubwordFeaturizer = JSON.parse(jsonString);
        this.numberHashingFeaturesSetting = deserialized.numberHashingFeaturesSetting;
        this.subwordNgramBegin = deserialized.subwordNgramBegin;
        this.subwordNgramEnd = deserialized.subwordNgramEnd;
        this.toLowercase = deserialized.toLowercase;
        this.toRemovePunctuations = deserialized.toRemovePunctuations;
        this.toRemoveEmptyElements = deserialized.toRemoveEmptyElements;
        this.splitDelimiter = deserialized.splitDelimiter;
        this.intentsUtterancesWeights = deserialized.intentsUtterancesWeights;
        this.labels = deserialized.labels;
        this.labelMap = deserialized.labelMap;
        this.features = deserialized.features;
        this.featureMap = deserialized.featureMap;
        this.hashingFeatureArrays = deserialized.hashingFeatureArrays;
    }
}
