/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// tslint:disable-next-line: no-var-requires
const parseFile = require("@microsoft/bf-lu").parser.parseFile;
// tslint:disable-next-line: no-var-requires
const constructMdFromLUIS = require("@microsoft/bf-lu").refresh.constructMdFromLUIS;

import { Data } from "./Data";

import { Utility } from "../utility/Utility";

export class LuData extends Data {

    public static async createLuDataFromSamplingExistingLuDataUtterances(
        existingLuData: LuData,
        samplingIndexArray: number[]): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            await LuData.createLuData(
                existingLuData.getContent());
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luData.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luData.retrieveLuisLuUtterances(luLuisJsonStructure);
        const lengthUtterancesArray: number =
            utterancesArray.length;
        luLuisJsonStructure.utterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            luLuisJsonStructure.utterances.push(utterancesArray[index]);
        }
        // ---- NOTE-FOR-REFERENCE ---- luLuisJsonStructure.utterances = utterancesArray.filter(
        // ---- NOTE-FOR-REFERENCE ----     (value: any, index: number, array: any[]) => {
        // ---- NOTE-FOR-REFERENCE ----         return (samplingIndexArray.has(index));
        // ---- NOTE-FOR-REFERENCE ----     });
        // -------------------------------------------------------------------
        luData.luUtterances =
            luData.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterancesWeights.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterancesWeights.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        luData.intentsUtterancesWeights.weights = luData.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        return luData;
    }

    public static async createLuDataFromFilteringExistingLuDataUtterances(
        existingLuData: LuData,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            await LuData.createLuData(
                existingLuData.getContent());
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luData.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luData.retrieveLuisLuUtterances(luLuisJsonStructure);
        const lengthUtterancesArray: number =
            utterancesArray.length;
        luLuisJsonStructure.utterances = [];
        for (const index of filteringIndexSet) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            luLuisJsonStructure.utterances.push(utterancesArray[index]);
        }
        // ---- NOTE-FOR-REFERENCE ---- luLuisJsonStructure.utterances = utterancesArray.filter(
        // ---- NOTE-FOR-REFERENCE ----     (value: any, index: number, array: any[]) => {
        // ---- NOTE-FOR-REFERENCE ----         return (filteringIndexSet.has(index));
        // ---- NOTE-FOR-REFERENCE ----     });
        // -------------------------------------------------------------------
        luData.luUtterances =
            luData.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterancesWeights.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterancesWeights.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        luData.intentsUtterancesWeights.weights = luData.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        return luData;
    }

    public static async createLuData(
        content: string): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            new LuData();
        luData.content =
            content;
        // -------------------------------------------------------------------
        luData.luObject =
            await parseFile(content);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luData.getLuLuisJsonStructure();
        // -------------------------------------------------------------------
        luData.luUtterances =
            luData.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterancesWeights.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterancesWeights.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        luData.intentsUtterancesWeights.weights = luData.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        return luData;
    }

    protected luObject: any = null;

    protected constructor() {
        super();
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[]): Promise<Data> {
        return await LuData.createLuDataFromSamplingExistingLuDataUtterances(
            existingData as LuData,
            // ---- NOTE-NO-NEED-FOR-LuData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- weightColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- linesToSkip,
            samplingIndexArray);
    }

    public async createDataFromFilteringExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return LuData.createLuDataFromFilteringExistingLuDataUtterances(
            existingData as LuData,
            // ---- NOTE-NO-NEED-FOR-LuData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- weightColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveLuisLuUtterances(luLuisJsonStructure: any): any[] { // ---- NOTE: a shallow copy
        return (luLuisJsonStructure.utterances as any[]);
    }
    public retrieveLuUtterances(luLuisJsonStructure: any): Array<{
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
        "text": string,
        "weight": number }> {
        const weight: number = 1;
        const utterancesArray: any[] =
            this.retrieveLuisLuUtterances(luLuisJsonStructure);
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
            "text": string,
            "weight": number }> = [];
        utterancesArray.forEach(
            (entry: any) => {
                const entities: Array<{
                    "entity": string,
                    "startPos": number,
                    "endPos": number,
                    }> = entry.entities;
                const partOfSpeechTags: Array<{
                    "partOfSpeechTag": string,
                    "startPos": number,
                    "endPos": number,
                    }> = [];
                const intent: string =
                    entry.intent;
                const text: string =
                    entry.text;
                luUtterances.push({
                    entities,
                    partOfSpeechTags,
                    intent,
                    text,
                    weight,
                });
            });
        return luUtterances;
        // ---- NOTE-FOR-REFERENCE ---- return (luLuisJsonStructure.utterances as any[]);
    }

    public getLuObject(): any {
        return this.luObject;
    }
    public getLuLuisJsonStructure(): any {
        return this.luObject.LUISJsonStructure;
    }
    public getLuQnaJsonStructure(): any {
        return this.luObject.qnaJsonStructure;
    }
    public getLuQnaAlterationsJsonStructure(): any {
        return this.luObject.qnaAlterations;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        return Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuObject(),
                replacer,
                space));
    }
    public dumpLuLuisJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        return Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuLuisJsonStructure(),
                replacer,
                space));
    }
    public dumpLuLuisJsonStructureInLuFormat(
        filename: string): string {
        return Utility.dumpFile(
            filename,
            constructMdFromLUIS(
                this.getLuLuisJsonStructure()));
    }
}
