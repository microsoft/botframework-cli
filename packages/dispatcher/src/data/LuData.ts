/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const parseFile = require("@microsoft/bf-lu").parser.parseFile;

import { Data } from "./Data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class LuData extends Data {

    public static async createLuDataFromFilteringExistingLuDataUtterances(
        existingLuData: LuData,
        filteringIndexSet: Set<number>): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            await LuData.createLuData(
                existingLuData.getContent(),
                existingLuData.getFeaturizer());
        // -------------------------------------------------------------------
        const luJsonStructure: any =
            luData.getLuJsonStructure();
        const utterancesArray: any[] =
            luData.retrieveLuUtterances(luData.luJsonStructure);
        luJsonStructure.utterances = utterancesArray.filter(
            (value: any, index: number, array: any[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        luData.luUtterances = luData.retrieveLuUtterances(luData.luJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterances.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterances.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        luData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luData;
    }

    public static async createLuData(
        content: string,
        featurizer: NgramSubwordFeaturizer): Promise<LuData> {
        // -------------------------------------------------------------------
        const luData: LuData =
            new LuData(featurizer);
        luData.content =
            content;
        // -------------------------------------------------------------------
        luData.luObject =
            await parseFile(content);
        luData.luJsonStructure =
            luData.luObject.LUISJsonStructure;
        // -------------------------------------------------------------------
        luData.luUtterances = luData.retrieveLuUtterances(luData.luJsonStructure);
        // -------------------------------------------------------------------
        luData.intentInstanceIndexMapArray =
            luData.collectIntents(luData.luUtterances);
        luData.entityTypeInstanceIndexMapArray =
            luData.collectEntityTypes(luData.luUtterances);
        luData.intentsUtterances.intents = luData.luUtterances.map(
            (entry: any) => entry.intent as string);
        luData.intentsUtterances.utterances = luData.luUtterances.map(
            (entry: any) => entry.text as string);
        luData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return luData;
    }

    protected luObject: any = null;
    protected luJsonStructure: any = null;

    protected constructor(
        featurizer: NgramSubwordFeaturizer) {
        super(featurizer);
    }

    public retrieveLuUtterances(luJsonStructure: any): any[] {
        return (luJsonStructure.utterances as any[]);
    }

    public getLuObject(): any {
        return this.luObject;
    }
    public getLuJsonStructure(): any {
        return this.luJsonStructure;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuObject(),
                replacer,
                space));
    }
    public dumpLuJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuJsonStructure(),
                replacer,
                space));
    }
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ---- public dumpLuUtterances(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     filename: string,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     replacer?: (this: any, key: string, value: any,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     space?: string | number): void {
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     Utility.dumpFile(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----         filename,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----         JSON.stringify(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             this.getLuUtterances(),
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             replacer,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             space));
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ---- }
}
