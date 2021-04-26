/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// tslint:disable-next-line: no-var-requires
const parseFile = require("@microsoft/bf-lu").parser.parseFile;

import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

import { Data } from "./Data";
import { DataWithSubwordFeaturizer } from "./DataWithSubwordFeaturizer";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class LuDataWithSubwordFeaturizer extends DataWithSubwordFeaturizer {

    public static async createLuDataWithSubwordFeaturizerFromSamplingExistingLuDataUtterances(
        existingLuDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuDataWithSubwordFeaturizer> {
        // -------------------------------------------------------------------
        const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
            await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                existingLuDataWithSubwordFeaturizer.getContent(),
                existingLuDataWithSubwordFeaturizer.getFeaturizer(),
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luDataWithSubwordFeaturizer.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luDataWithSubwordFeaturizer.retrieveLuisLuUtterances(luLuisJsonStructure);
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
        luDataWithSubwordFeaturizer.luUtterances =
            luDataWithSubwordFeaturizer.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectIntents(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectEntityTypes(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.intents = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.intent as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.text as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.weights = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luDataWithSubwordFeaturizer;
    }

    public static async createLuDataWithSubwordFeaturizerFromFilteringExistingLuDataUtterances(
        existingLuDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuDataWithSubwordFeaturizer> {
        // -------------------------------------------------------------------
        const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
            await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                existingLuDataWithSubwordFeaturizer.getContent(),
                existingLuDataWithSubwordFeaturizer.getFeaturizer(),
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luDataWithSubwordFeaturizer.getLuLuisJsonStructure();
        const utterancesArray: any[] =
            luDataWithSubwordFeaturizer.retrieveLuisLuUtterances(luLuisJsonStructure);
        const lengthUtterancesArray: number =
            utterancesArray.length;
        luLuisJsonStructure.utterances = [];
        for (const index of filteringIndexSet) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            luLuisJsonStructure.utterances.push(utterancesArray[index]);
        }
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.luUtterances =
            luDataWithSubwordFeaturizer.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectIntents(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectEntityTypes(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.intents = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.intent as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.text as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.weights = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luDataWithSubwordFeaturizer;
    }

    public static async createLuDataWithSubwordFeaturizer(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<LuDataWithSubwordFeaturizer> {
        // -------------------------------------------------------------------
        const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
            new LuDataWithSubwordFeaturizer(featurizer);
        luDataWithSubwordFeaturizer.content =
            content;
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.luObject =
            await parseFile(content);
        // -------------------------------------------------------------------
        const luLuisJsonStructure: any =
            luDataWithSubwordFeaturizer.getLuLuisJsonStructure();
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.luUtterances =
            luDataWithSubwordFeaturizer.retrieveLuUtterances(luLuisJsonStructure);
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectIntents(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            luDataWithSubwordFeaturizer.collectEntityTypes(luDataWithSubwordFeaturizer.luUtterances);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.intents = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.intent as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.text as string);
        luDataWithSubwordFeaturizer.intentsUtterancesWeights.weights = luDataWithSubwordFeaturizer.luUtterances.map(
            (entry: any) => entry.weight as number);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            luDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        luDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luDataWithSubwordFeaturizer;
    }

    protected luObject: any = null;

    protected constructor(
        featurizer: NgramSubwordFeaturizer) {
        super(featurizer);
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingDataWithSubwordFeaturizer: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        if (!(existingDataWithSubwordFeaturizer instanceof LuDataWithSubwordFeaturizer)) {
           Utility.debuggingThrow("logic error: the input DataWithSubwordFeaturizer object should be a LuDataWithSubwordFeaturizer object.");
        }
        return await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizerFromSamplingExistingLuDataUtterances(
            existingDataWithSubwordFeaturizer as LuDataWithSubwordFeaturizer,
            samplingIndexArray,
            toResetFeaturizerLabelFeatureMaps);
    }

    public async createDataFromFilteringExistingDataUtterances(
        existingDataWithSubwordFeaturizer: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        if (!(existingDataWithSubwordFeaturizer instanceof LuDataWithSubwordFeaturizer)) {
           Utility.debuggingThrow("logic error: the input DataWithSubwordFeaturizer object should be a LuDataWithSubwordFeaturizer object.");
        }
        return LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizerFromFilteringExistingLuDataUtterances(
            existingDataWithSubwordFeaturizer as LuDataWithSubwordFeaturizer,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveLuisLuUtterances(luLuisJsonStructure: any): any[] { // ---- NOTE: a shallow copy
        return (luLuisJsonStructure.utterances as any[]);
    }
    public retrieveLuUtterances(luLuisJsonStructure: any): ITextIntentSequenceLabelObjectByPosition[] {
        const weight: number = 1;
        const utterancesArray: any[] =
            this.retrieveLuisLuUtterances(luLuisJsonStructure);
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = [];
        utterancesArray.forEach(
            (entry: any) => {
                const entities: IEntityObjectByPosition[] = entry.entities;
                const partOfSpeechTags: IPartOfSpeechTagObjectByPosition[] = [];
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
}
