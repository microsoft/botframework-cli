/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Utility } from "../../../utility/utility";

export class NgramSubwordFeaturizer {

    protected static LanguageTokenPunctuationDelimiters: string[] = [
        // ---- // ---- "\0",
        // ---- // ---- "\u0001",
        // ---- // ---- "\u0002",
        // ---- // ---- "\u0003",
        // ---- // ---- "\u0004",
        // ---- // ---- "\u0005",
        // ---- // ---- "\u0006",
        // ---- // ---- "\a",
        // ---- // ---- "\b",
        // ---- // ---- "\t",
        // ---- // ---- "\n",
        // ---- // ---- "\v",
        // ---- // ---- "\f",
        // ---- // ---- "\r",
        // ---- // ---- "\u000E",
        // ---- // ---- "\u000F",
        // ---- // ---- "\u0010",
        // ---- // ---- "\u0011",
        // ---- // ---- "\u0012",
        // ---- // ---- "\u0013",
        // ---- // ---- "\u0014",
        // ---- // ---- "\u0015",
        // ---- // ---- "\u0016",
        // ---- // ---- "\u0017",
        // ---- // ---- "\u0018",
        // ---- // ---- "\u0019",
        // ---- // ---- "\u001A",
        // ---- // ---- "\u001B",
        // ---- // ---- "\u001C",
        // ---- // ---- "\u001D",
        // ---- // ---- "\u001E",
        // ---- // ---- "\u001F",
        // ---- // ---- " ",
        "!",
        "\"",
        "#",
        "$",
        "%",
        "&",
        "\"",
        "(",
        ")",
        "*",
        "+",
        ",",
        "-",
        ".",
        "/",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
        "[",
        "\\",
        "]",
        "^",
        "`",
        "{",
        "|",
        "}",
        "~",
        // ---- // ---- "\u007F"
    ];

    protected static LanguageTokenPunctuationDelimitersSet: Set<string> =
        new Set(NgramSubwordFeaturizer.LanguageTokenPunctuationDelimiters);

    protected static LanguageTokenPunctuationReplacementDelimiters: string[] = [
        // ---- // ---- " \0 ",
        // ---- // ---- " \u0001 ",
        // ---- // ---- " \u0002 ",
        // ---- // ---- " \u0003 ",
        // ---- // ---- " \u0004 ",
        // ---- // ---- " \u0005 ",
        // ---- // ---- " \u0006 ",
        // ---- // ---- " \a ",
        // ---- // ---- " \b ",
        // ---- // ---- " \t ",
        // ---- // ---- " \n ",
        // ---- // ---- " \v ",
        // ---- // ---- " \f ",
        // ---- // ---- " \r ",
        // ---- // ---- " \u000E ",
        // ---- // ---- " \u000F ",
        // ---- // ---- " \u0010 ",
        // ---- // ---- " \u0011 ",
        // ---- // ---- " \u0012 ",
        // ---- // ---- " \u0013 ",
        // ---- // ---- " \u0014 ",
        // ---- // ---- " \u0015 ",
        // ---- // ---- " \u0016 ",
        // ---- // ---- " \u0017 ",
        // ---- // ---- " \u0018 ",
        // ---- // ---- " \u0019 ",
        // ---- // ---- " \u001A ",
        // ---- // ---- " \u001B ",
        // ---- // ---- " \u001C ",
        // ---- // ---- " \u001D ",
        // ---- // ---- " \u001E ",
        // ---- // ---- " \u001F ",
        // ---- // ---- " ",
        " ! ",
        " \" ",
        " # ",
        " $ ",
        " % ",
        " & ",
        " \" ",
        " ( ",
        " ) ",
        " * ",
        " + ",
        " , ",
        " - ",
        " . ",
        " / ",
        " : ",
        " ; ",
        " < ",
        " = ",
        " > ",
        " ? ",
        " @ ",
        " [ ",
        " \\ ",
        " ] ",
        " ^ ",
        " ` ",
        " { ",
        " | ",
        " } ",
        " ~ ",
        // ---- // ---- " \u007F "
    ];

    protected static LanguageTokenSpaceDelimiters: string[] = [
        "\0",
        "\u0001",
        "\u0002",
        "\u0003",
        "\u0004",
        "\u0005",
        "\u0006",
        "\a",
        "\b",
        "\t",
        "\n",
        "\v",
        "\f",
        "\r",
        "\u000E",
        "\u000F",
        "\u0010",
        "\u0011",
        "\u0012",
        "\u0013",
        "\u0014",
        "\u0015",
        "\u0016",
        "\u0017",
        "\u0018",
        "\u0019",
        "\u001A",
        "\u001B",
        "\u001C",
        "\u001D",
        "\u001E",
        "\u001F",
        " ",
        // ---- // ---- "!",
        // ---- // ---- "\"",
        // ---- // ---- "#",
        // ---- // ---- "$",
        // ---- // ---- "%",
        // ---- // ---- "&",
        // ---- // ---- "\"",
        // ---- // ---- "(",
        // ---- // ---- ")",
        // ---- // ---- "*",
        // ---- // ---- "+",
        // ---- // ---- ",",
        // ---- // ---- "-",
        // ---- // ---- ".",
        // ---- // ---- "/",
        // ---- // ---- ":",
        // ---- // ---- ";",
        // ---- // ---- "<",
        // ---- // ---- "=",
        // ---- // ---- ">",
        // ---- // ---- "?",
        // ---- // ---- "@",
        // ---- // ---- "[",
        // ---- // ---- "\\",
        // ---- // ---- "]",
        // ---- // ---- "^",
        // ---- // ---- "`",
        // ---- // ---- "{",
        // ---- // ---- "|",
        // ---- // ---- "}",
        // ---- // ---- "~",
        "\u007F",
    ];

    protected static LanguageTokenSpaceDelimitersSet: Set<string> =
        new Set(NgramSubwordFeaturizer.LanguageTokenSpaceDelimiters);

    protected numberHashingFeaturesSetting: number = 0;

    protected subwordNgramBegin: number = 3;
    protected subwordNgramEnd: number = 4;

    protected toLowercase: boolean = true;
    protected toRemovePunctuation: boolean = false;

    protected intentsUtterances:
        { "intents": string[], "utterances": string[] } = { intents: [], utterances: [] };

    protected labels: string[] = [];
    protected labelMap: { [id: string]: number; } = {};
    protected features: string[] = [];
    protected featureMap: { [id: string]: number; } = {};
    protected hashingFeatureArrays: Array<Set<string>> = [];

    constructor(
        subwordNgramBegin: number = 3,
        subwordNgramEnd: number = 4,
        toLowercase: boolean = true,
        toRemovePunctuation: boolean = false,
        numberHashingFeaturesSetting: number = 0) {
        this.numberHashingFeaturesSetting = numberHashingFeaturesSetting;
        this.subwordNgramBegin = subwordNgramBegin;
        this.subwordNgramEnd = subwordNgramEnd;
        this.toLowercase = toLowercase;
        this.toRemovePunctuation = toRemovePunctuation;
    }

    public getIntentsUtterances(): { "intents": string[], "utterances": string[] } {
        return this.intentsUtterances;
    }

    public getLabels(): string[] {
        return this.labels;
    }
    public getLabelMap(): { [id: string]: number; } {
        return this.labelMap;
    }
    public getFeatures(): string[] {
        return this.features;
    }
    public getFeatureMap(): { [id: string]: number; } {
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
        if (!label) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (label in this.labelMap) {
            labelId = this.labelMap[label];
        }
        if (labelId < 0) {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${this.labelMap}`);
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
        if (feature in this.featureMap) {
            featureId = this.featureMap[feature];
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
            if (feature in this.featureMap) {
                featureId = this.featureMap[feature];
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
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
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
        intentsUtterances: { "intents": string[], "utterances": string[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
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
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArray": number[], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        const intentLabelIndexArray: number[] =
            intents.map((intent) => this.getLabelIndex(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureHashingSparseIndexArray(utterance), this);
        return { intentLabelIndexArray, utteranceFeatureIndexArrays };
    }

    public createLabelOneHotEncoderBooleanArray(
        label: string,
        throwIfNonExistentLabel: boolean = true): boolean[] {
        if (!label) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (label in this.labelMap) {
            labelId = this.labelMap[label];
        }
        const numberLabels: number = this.getNumberLabels();
        const labelArray: boolean[] = new Array(numberLabels).fill(0);
        if (labelId >= 0) {
            labelArray[labelId] = true;
        } else {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${this.labelMap}`);
            }
        }
        return labelArray;
    }
    public createLabelOneHotEncoderNumberArray(
        label: string,
        throwIfNonExistentLabel: boolean = true): number[] {
        if (!label) {
            Utility.debuggingThrow("label == null");
        }
        let labelId: number = -1;
        if (!this.labelMap) {
            Utility.debuggingThrow("this.labelMap == null");
        }
        if (label in this.labelMap) {
            labelId = this.labelMap[label];
        }
        const numberLabels: number = this.getNumberLabels();
        const labelArray: number[] = new Array(numberLabels).fill(0);
        if (labelId >= 0) {
            labelArray[labelId] = 1;
        } else {
            if (throwIfNonExistentLabel) {
                Utility.debuggingThrow(`label=${label} does not exist in this.labelMap=${this.labelMap}`);
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
            if (feature in this.featureMap) {
                featureId = this.featureMap[feature];
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
            if (feature in this.featureMap) {
                featureId = this.featureMap[feature];
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
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        const intentLabelIndexArrays: boolean[][] =
            intents.map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] =
            utterances.map((utterance) => this.createFeatureOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceOneHotEncoderNumberArrays(
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
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
        intentsUtterances: { "intents": string[], "utterances": string[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        const intentLabelIndexArrays: boolean[][] = intents
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] = utterances
            .slice(miniBatchIndexBegin, miniBatchIndexEnd)
            .map((utterance) => this.createFeatureOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceMiniBatchingOneHotEncoderNumberArrays(
        intentsUtterances: { "intents": string[], "utterances": string[] },
        miniBatchIndexBegin: number = 0,
        miniBatchIndexEnd: number = 0):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
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
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArrays": boolean[][], "utteranceFeatureIndexArrays": boolean[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        const intentLabelIndexArrays: boolean[][] =
            intents.map((intent) => this.createLabelOneHotEncoderBooleanArray(intent), this);
        const utteranceFeatureIndexArrays: boolean[][] =
            utterances.map((utterance) => this.createFeatureHashingOneHotEncoderBooleanArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }
    public createIntentUtteranceHashingOneHotEncoderNumberArrays(
        intentsUtterances: { "intents": string[], "utterances": string[] }):
        { "intentLabelIndexArrays": number[][], "utteranceFeatureIndexArrays": number[][] } {
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        const intentLabelIndexArrays: number[][] =
            intents.map((intent) => this.createLabelOneHotEncoderNumberArray(intent), this);
        const utteranceFeatureIndexArrays: number[][] =
            utterances.map((utterance) => this.createFeatureHashingOneHotEncoderNumberArray(utterance), this);
        return { intentLabelIndexArrays, utteranceFeatureIndexArrays };
    }

    public featurize(input: string): string[] {
        let result: string[] = this.split(input);
        if (this.toRemovePunctuation) {
            result = result.filter((element: string) => {
                return (!NgramSubwordFeaturizer.LanguageTokenPunctuationDelimitersSet.has(element as string));
            });
        }
        const subwordFeatures: string[] = this.generateSubwords(result.join(" "));
        return result.concat(subwordFeatures);
    }

    public split(input: string): string[] {
        if (this.toLowercase) {
            input = input.toLowerCase();
        }
        const delimiters: string[] = NgramSubwordFeaturizer.LanguageTokenPunctuationDelimiters;
        const replacementDelimiters: string[] = NgramSubwordFeaturizer.LanguageTokenPunctuationReplacementDelimiters;
        const numberDelimiters: number = delimiters.length;
        for (let i = 0; i < numberDelimiters; i++) {
            input = input.replace(delimiters[i], replacementDelimiters[i]);
        }
        let result: string[] = input.split(" ");
        result = result.filter((element: string) => {
            return (element && (element !== ""));
        });
        return result;
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
        intentsUtterances: { "intents": string[], "utterances": string[] }): void {
        // -------------------------------------------------------------------
        this.intentsUtterances =
            intentsUtterances;
        // -------------------------------------------------------------------
        const intents: string[] =
            intentsUtterances.intents;
        const intentLabels: { "stringArray": string[], "stringMap": { [id: string]: number; } } =
            Utility.buildStringMapFromStringArray(intents);
        this.labels =
            intentLabels.stringArray;
        this.labelMap =
            intentLabels.stringMap;
        // -------------------------------------------------------------------
        const utterances: string[] =
            intentsUtterances.utterances;
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
        // ---- NOTE-FOR-REFERENCE ----     "stringMap": { [id: string]: number; } } =
        // ---- NOTE-FOR-REFERENCE ----     Utility.buildStringMapFromStringArray(featureArrayFlattened);
        const utteranceTexts: {
            "stringArray": string[],
            "stringMap": { [id: string]: number; } } =
            Utility.buildStringMapFromStringArrays(featureArray);
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
        this.toRemovePunctuation = deserialized.toRemovePunctuation;
        this.intentsUtterances = deserialized.intentsUtterances;
        this.labels = deserialized.labels;
        this.labelMap = deserialized.labelMap;
        this.features = deserialized.features;
        this.featureMap = deserialized.featureMap;
        this.hashingFeatureArrays = deserialized.hashingFeatureArrays;
    }
}
