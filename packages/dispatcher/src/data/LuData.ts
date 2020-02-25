/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// tslint:disable-next-line: no-var-requires
const parseFile = require("@microsoft/bf-lu").parser.parseFile;
// tslint:disable-next-line: no-var-requires
const constructMdFromLUIS = require("@microsoft/bf-lu").refresh.constructMdFromLUIS;

import { Data } from "./Data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class LuData extends Data {

    public static async createLuDataFromSamplingExistingLuDataUtterances(
        existingLuData: LuData,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            await LuData.createLuData(
                existingLuData.getContent(),
                existingLuData.getFeaturizer(),
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luData.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luData.retrieveLuUtterances(luLuisJsonStructure);
        const lengthUtterancesArray: number =
            utterancesArray.length;
        luLuisJsonStructure.utterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            luLuisJsonStructure.utterances.push(utterancesArray[index]);
        }
        // -------------------------------------------------------------------
        luData.luUtterances = luData.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterances.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterances.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luData.featurizeIntentsUtterances();
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
                existingLuData.getContent(),
                existingLuData.getFeaturizer(),
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luData.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luData.retrieveLuUtterances(luLuisJsonStructure);
        luLuisJsonStructure.utterances = utterancesArray.filter(
            (value: any, index: number, array: any[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        luData.luUtterances = luData.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterances.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterances.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luData;
    }

    public static async createLuData(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            new LuData(featurizer);
        luData.content =
            content;
        // -------------------------------------------------------------------
        luData.luObject =
            await parseFile(content);
        // -------------------------------------------------------------------
        luData.luUtterances = luData.retrieveLuUtterances(luData.getLuLuisJsonStructure());
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterances.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterances.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luData;
    }

    protected luObject: any = null;

    protected constructor(
        featurizer: NgramSubwordFeaturizer) {
        super(featurizer);
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        return await LuData.createLuDataFromSamplingExistingLuDataUtterances(
            existingData as LuData,
            // ---- NOTE-NO-NEED-FOR-LuData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- linesToSkip,
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
        return LuData.createLuDataFromFilteringExistingLuDataUtterances(
            existingData as LuData,
            // ---- NOTE-NO-NEED-FOR-LuData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-LuData ---- linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveLuUtterances(luLuisJsonStructure: any): any[] { // ---- NOTE: a shallow copy
        return (luLuisJsonStructure.utterances as any[]);
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
