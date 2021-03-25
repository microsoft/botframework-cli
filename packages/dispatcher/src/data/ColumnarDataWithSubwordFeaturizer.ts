/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
// import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

import { Data } from "./Data";
import { DataWithSubwordFeaturizer } from "./DataWithSubwordFeaturizer";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class ColumnarDataWithSubwordFeaturizer extends DataWithSubwordFeaturizer {

    public static createColumnarDataWithSubwordFeaturizerFromSamplingExistingColumnarDataUtterances(
        existingColumnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
            ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
                existingColumnarDataWithSubwordFeaturizer.getContent(),
                existingColumnarDataWithSubwordFeaturizer.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = columnarDataWithSubwordFeaturizer.luUtterances;
        const lengthUtterancesArray: number =
            luUtterances.length;
        columnarDataWithSubwordFeaturizer.luUtterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            columnarDataWithSubwordFeaturizer.luUtterances.push(luUtterances[index]);
        }
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectIntents(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectEntityTypes(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarDataWithSubwordFeaturizer;
    }

    public static createColumnarDataWithSubwordFeaturizerFromFilteringExistingColumnarDataUtterances(
        existingColumnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
            ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
                existingColumnarDataWithSubwordFeaturizer.getContent(),
                existingColumnarDataWithSubwordFeaturizer.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] =
            columnarDataWithSubwordFeaturizer.luUtterances;
        columnarDataWithSubwordFeaturizer.luUtterances = luUtterances.filter(
            (value: ITextIntentSequenceLabelObjectByPosition,
             index: number,
             array: ITextIntentSequenceLabelObjectByPosition[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectIntents(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectEntityTypes(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarDataWithSubwordFeaturizer;
    }

    public static createColumnarDataWithSubwordFeaturizer(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
            new ColumnarDataWithSubwordFeaturizer(
                featurizer,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip);
        columnarDataWithSubwordFeaturizer.content =
            content;
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.luUtterances =
            columnarDataWithSubwordFeaturizer.retrieveColumnarUtterances(content);
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectIntents(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            columnarDataWithSubwordFeaturizer.collectEntityTypes(columnarDataWithSubwordFeaturizer.luUtterances);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            columnarDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarDataWithSubwordFeaturizer;
    }

    protected labelColumnIndex: number = 0;
    protected textColumnIndex: number = 1;
    protected weightColumnIndex: number = -1;
    protected linesToSkip: number = 0;

    protected constructor(
        featurizer: NgramSubwordFeaturizer,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        linesToSkip: number = 0) {
        super(featurizer);
        this.labelColumnIndex = labelColumnIndex;
        this.textColumnIndex = textColumnIndex;
        this.weightColumnIndex = weightColumnIndex;
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return ColumnarDataWithSubwordFeaturizer.
            createColumnarDataWithSubwordFeaturizerFromSamplingExistingColumnarDataUtterances(
                existingData as ColumnarDataWithSubwordFeaturizer,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                samplingIndexArray,
                toResetFeaturizerLabelFeatureMaps);
    }

    public async createDataFromFilteringExistingDataUtterances(
        existingData: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return ColumnarDataWithSubwordFeaturizer.
            createColumnarDataWithSubwordFeaturizerFromFilteringExistingColumnarDataUtterances(
                existingData as ColumnarDataWithSubwordFeaturizer,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip,
                filteringIndexSet,
                toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveColumnarUtterances(content: string): ITextIntentSequenceLabelObjectByPosition[] {
        // ---- NOTE the return is newly allocated, unlike the one of LuData
        const intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] } =
            Utility.loadLabelUtteranceColumnarContent(
                content,               // ---- filename: string,
                this.getLabelColumnIndex(),  // ---- labelColumnIndex: number = 0,
                this.getTextColumnIndex(),   // ---- textColumnIndex: number = 1,
                this.getWeightColumnIndex(), // ---- weightColumnIndex: number = -1,
                this.getLinesToSkip(), // ---- lineIndexToStart: number = 0,
                "\t",                  // ---- columnDelimiter: string = "\t",
                "\n",                  // ---- rowDelimiter: string = "\n",
                "utf8",                // ---- encoding: string = "utf8",
                -1,                    // ---- lineIndexToEnd: number = -1
                );
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = [];
        const intents: string[] = intentsUtterancesWeights.intents;
        const utterances: string[] = intentsUtterancesWeights.utterances;
        const weights: number[] = intentsUtterancesWeights.weights;
        for (let i = 0; i < intents.length; i++) {
            const intent: string = intents[i];
            const text: string = utterances[i];
            const weight: number = weights[i];
            const luUtterance: ITextIntentSequenceLabelObjectByPosition = {
                entities: [],
                partOfSpeechTags: [],
                intent,
                text,
                weight,
            };
            luUtterances.push(luUtterance);
        }
        return luUtterances;
    }

    public getLuObject(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarDataWithSubwordFeaturizer object to generate a LU object.");
    }
    public getLuLuisJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarDataWithSubwordFeaturizer object to generate a LUIS JSON object.");
    }
    public getLuQnaJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarDataWithSubwordFeaturizer object to generate a QnA JSON object.");
    }
    public getLuQnaAlterationsJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarDataWithSubwordFeaturizer to generate a QnA Alterations JSON object.");
    }

    public getLabelColumnIndex(): number {
        return this.labelColumnIndex;
    }
    public getTextColumnIndex(): number {
        return this.textColumnIndex;
    }
    public getWeightColumnIndex(): number {
        return this.weightColumnIndex;
    }
    public getLinesToSkip(): number {
        return this.linesToSkip;
    }
}
