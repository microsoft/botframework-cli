/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class ColumnarData extends Data {

    public static createColumnarDataFromSamplingExistingColumnarDataUtterances(
        existingColumnarData: ColumnarData,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                existingColumnarData.getContent(),
                existingColumnarData.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luUtterances: Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string }> = columnarData.luUtterances;
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
        columnarData.intentsUtterances.intents = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.intent as string);
        columnarData.intentsUtterances.utterances = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarData;
    }

    public static createColumnarDataFromFilteringExistingColumnarDataUtterances(
        existingColumnarData: ColumnarData,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                existingColumnarData.getContent(),
                existingColumnarData.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip,
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luUtterances: Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string }> =
            columnarData.luUtterances;
        columnarData.luUtterances = luUtterances.filter(
            (value: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string },
             index: number,
             array: Array<{
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }>) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterances.intents = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.intent as string);
        columnarData.intentsUtterances.utterances = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarData;
    }

    public static createColumnarData(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        toResetFeaturizerLabelFeatureMaps: boolean): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            new ColumnarData(
                featurizer,
                labelColumnIndex,
                textColumnIndex,
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
        columnarData.intentsUtterances.intents = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.intent as string);
        columnarData.intentsUtterances.utterances = columnarData.luUtterances.map(
            (entry: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string }) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            columnarData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        columnarData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarData;
    }

    protected labelColumnIndex: number = 0;
    protected textColumnIndex: number = 1;
    protected linesToSkip: number = 0;

    protected constructor(
        featurizer: NgramSubwordFeaturizer,
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        linesToSkip: number = 0) {
        super(featurizer);
        this.labelColumnIndex = labelColumnIndex;
        this.textColumnIndex = textColumnIndex;
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return ColumnarData.createColumnarDataFromSamplingExistingColumnarDataUtterances(
            existingData as ColumnarData,
            labelColumnIndex,
            textColumnIndex,
            linesToSkip,
            samplingIndexArray,
            toResetFeaturizerLabelFeatureMaps);
    }

    public async createDataFromFilteringExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return ColumnarData.createColumnarDataFromFilteringExistingColumnarDataUtterances(
            existingData as ColumnarData,
            labelColumnIndex,
            textColumnIndex,
            linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveColumnarUtterances(content: string): Array<{ // ---- NOTE the return is newly allocated, unlike the one of LuData
        "entities": Array<{
            "entity": string,
            "startPos": number,
            "endPos": number,
            }>,
        "partOfSpeechTags": Array<{
            "partOfSpeechTag": string,
            "startPos": number,
            "endPos": number,
            }>,
        "intent": string,
        "text": string }> {
        const intentsUtterances: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarContent(
                content,               // ---- filename: string,
                this.getLabelColumnIndex(), // ---- labelColumnIndex: number = 0,
                this.getTextColumnIndex(),  // ---- textColumnIndex: number = 1,
                this.getLinesToSkip(), // ---- lineIndexToStart: number = 0,
                "\t",                  // ---- columnDelimiter: string = "\t",
                "\n",                  // ---- rowDelimiter: string = "\n",
                -1,                    // ---- lineIndexToEnd: number = -1
            );
        const luUtterances: Array<{
            "entities": Array<{
                "entity": string,
                "startPos": number,
                "endPos": number,
                }>,
            "partOfSpeechTags": Array<{
                "partOfSpeechTag": string,
                "startPos": number,
                "endPos": number,
                }>,
            "intent": string,
            "text": string }> = [];
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        for (let i = 0; i < intents.length; i++) {
            const intent: string = intents[i];
            const text: string = utterances[i];
            const luUtterance: {
                "entities": Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "partOfSpeechTags": Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }>,
                "intent": string,
                "text": string } = {
                    entities: [],
                    partOfSpeechTags: [],
                    intent,
                    text,
            };
            luUtterances.push(luUtterance);
        }
        return luUtterances;
    }

    public getLuObject(): any {
        return null; // ---- NOTE: not constructued from a ColumnarData file.
    }
    public getLuLuisJsonStructure(): any {
        return null; // ---- NOTE: not constructued from a ColumnarData file.
    }
    public getLuQnaJsonStructure(): any {
        return null; // ---- NOTE: not constructued from a ColumnarData file.
    }
    public getLuQnaAlterationsJsonStructure(): any {
        return null; // ---- NOTE: not constructued from a ColumnarData file.
    }

    public getLabelColumnIndex(): number {
        return this.labelColumnIndex;
    }
    public getTextColumnIndex(): number {
        return this.textColumnIndex;
    }
    public getLinesToSkip(): number {
        return this.linesToSkip;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        // ==== NOTE-TODO ==== a ColumnarData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure out of columnar content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     JSON.stringify(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuObject(),
        // ---- NOTE-TODO-PLACEHOLDER ----         replacer,
        // ---- NOTE-TODO-PLACEHOLDER ----         space));
        return "";
    }
    public dumpLuLuisJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        // ==== NOTE-TODO ==== a ColumnarData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure out of columnar content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     JSON.stringify(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure(),
        // ---- NOTE-TODO-PLACEHOLDER ----         replacer,
        // ---- NOTE-TODO-PLACEHOLDER ----         space));
        return "";
    }
    public dumpLuLuisJsonStructureInLuFormat(
        filename: string): string {
        // ==== NOTE-TODO ==== a ColumnarData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure out of columnar content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     constructMdFromLUIS(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure()));
        return "";
    }
}
