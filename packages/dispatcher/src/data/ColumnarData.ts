/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
// import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

import { Data } from "./Data";

import { Utility } from "../utility/Utility";

export class ColumnarData extends Data {

    public static createColumnarDataFromSamplingExistingColumnarDataUtterances(
        existingColumnarData: ColumnarData,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[]): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                existingColumnarData.getContent(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip);
        // -------------------------------------------------------------------
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = columnarData.luUtterances;
        const lengthUtterancesArray: number =
            luUtterances.length;
        columnarData.luUtterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            columnarData.luUtterances.push(luUtterances[index]);
        }
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterancesWeights.intents = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarData.intentsUtterancesWeights.utterances = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarData.intentsUtterancesWeights.weights = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        return columnarData;
    }

    public static createColumnarDataFromFilteringExistingColumnarDataUtterances(
        existingColumnarData: ColumnarData,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                existingColumnarData.getContent(),
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip);
        // -------------------------------------------------------------------
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] =
            columnarData.luUtterances;
        columnarData.luUtterances = luUtterances.filter(
            (value: ITextIntentSequenceLabelObjectByPosition,
             index: number,
             array: ITextIntentSequenceLabelObjectByPosition[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterancesWeights.intents = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarData.intentsUtterancesWeights.utterances = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarData.intentsUtterancesWeights.weights = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        return columnarData;
    }

    public static createColumnarData(
        content: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            new ColumnarData(
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                linesToSkip);
        columnarData.content =
            content;
        // -------------------------------------------------------------------
        columnarData.luUtterances =
            columnarData.retrieveColumnarUtterances(content);
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterancesWeights.intents = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        columnarData.intentsUtterancesWeights.utterances = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        columnarData.intentsUtterancesWeights.weights = columnarData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
        // -------------------------------------------------------------------
        return columnarData;
    }

    protected labelColumnIndex: number = 0;
    protected textColumnIndex: number = 1;
    protected weightColumnIndex: number = -1;
    protected linesToSkip: number = 0;

    protected constructor(
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        linesToSkip: number = 0) {
        super();
        this.labelColumnIndex = labelColumnIndex;
        this.textColumnIndex = textColumnIndex;
        this.weightColumnIndex = weightColumnIndex;
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[]): Promise<Data> {
        return ColumnarData.createColumnarDataFromSamplingExistingColumnarDataUtterances(
            existingData as ColumnarData,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip,
            samplingIndexArray);
    }

    public async createDataFromFilteringExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>): Promise<Data> {
        return ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
            existingData as ColumnarData,
            labelColumnIndex,
            textColumnIndex,
            weightColumnIndex,
            linesToSkip,
            filteringIndexSet);
    }

    public retrieveColumnarUtterances(content: string): ITextIntentSequenceLabelObjectByPosition[] {
        // ---- NOTE ---- the return is newly allocated, unlike the one in LuData
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
            "ColumnarData object to generate a LU object.");
    }
    public getLuLuisJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarData object to generate a LUIS JSON object.");
    }
    public getLuQnaJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarData object to generate a QnA JSON object.");
    }
    public getLuQnaAlterationsJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "ColumnarData to generate a QnA Alterations JSON object.");
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
