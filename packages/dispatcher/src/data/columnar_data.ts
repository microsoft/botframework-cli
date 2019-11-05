/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/ngram_subword_featurizer";

import { Utility } from "../utility/utility";

export class ColumnarData extends Data {

    public static createColumnarDataFromFilteringExistingColumnarDataUtterances(
        existingColumnarData: ColumnarData,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                existingColumnarData.getLuContent(),
                existingColumnarData.getFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip);
        // -------------------------------------------------------------------
        const utterancesArray: any[] =
            columnarData.retrieveLuUtterances(columnarData.luContent);
        columnarData.luUtterances = utterancesArray.filter(
            (value: any, index: number, array: any[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        // columnarData.luUtterances = columnarData.retrieveLuUtterances(columnarData.luContent);
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterances.intents = columnarData.luUtterances.map(
            (entry: any) => entry.intent as string);
        columnarData.intentsUtterances.utterances = columnarData.luUtterances.map(
            (entry: any) => entry.text as string);
        columnarData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarData;
    }

    public static createColumnarData(
        luContent: string,
        featurizer: NgramSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number): ColumnarData {
        // -------------------------------------------------------------------
        const columnarData: ColumnarData =
            new ColumnarData(
                featurizer,
                labelColumnIndex,
                textColumnIndex,
                linesToSkip);
        columnarData.luContent =
            luContent;
        // -------------------------------------------------------------------
        columnarData.luUtterances = columnarData.retrieveLuUtterances(luContent);
        // -------------------------------------------------------------------
        columnarData.intentInstanceIndexMapArray =
            columnarData.collectIntents(columnarData.luUtterances);
        columnarData.entityTypeInstanceIndexMapArray =
            columnarData.collectEntityTypes(columnarData.luUtterances);
        columnarData.intentsUtterances.intents = columnarData.luUtterances.map(
            (entry: any) => entry.intent as string);
        columnarData.intentsUtterances.utterances = columnarData.luUtterances.map(
            (entry: any) => entry.text as string);
        columnarData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return columnarData;
    }

    // protected luObject: any = null;
    // protected luJsonStructure: any = null;

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

    public retrieveLuUtterances(luContent: any): any[] {
        const intentsUtterances: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarContent(
                luContent,             // ---- filename: string,
                this.getLabelColumnIndex(), // ---- labelColumnIndex: number = 0,
                this.getTextColumnIndex(),  // ---- textColumnIndex: number = 1,
                this.getLinesToSkip(), // ---- lineIndexToStart: number = 0,
                "\t",                  // ---- columnDelimiter: string = "\t",
                "\n",                  // ---- rowDelimiter: string = "\n",
                "utf8",                // ---- encoding: string = "utf8",
                -1,                    // ---- lineIndexToEnd: number = -1
            );
        const luUtterances: any[] = [];
        const intents: string[] = intentsUtterances.intents;
        const utterances: string[] = intentsUtterances.utterances;
        for (let i = 0; i < intents.length; i++) {
            const intent: string = intents[i];
            const utterance: string = utterances[i];
            const luUtterance: any = {
                entities: [],
                intent,
                text: utterance,
            };
            luUtterances.push(luUtterance);
        }
        return luUtterances;
    }

    public getLuObject(): any {
        return null; // return this.luObject;
    }
    public getLuJsonStructure(): any {
        return null; // this.luJsonStructure;
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
        space?: string | number): void {
        // Utility.dumpFile(
        //     filename,
        //     JSON.stringify(
        //         this.getLuObject(),
        //         replacer,
        //         space));
    }
    public dumpLuJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        // Utility.dumpFile(
        //     filename,
        //     JSON.stringify(
        //         this.getLuJsonStructure(),
        //         replacer,
        //         space));
    }
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ---- public dumpLuUtterances(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     filename: string,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     replacer?: (this: any, key: string, value: any) => any,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     space?: string | number): void {
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----     Utility.dumpFile(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----         filename,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----         JSON.stringify(
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             this.getLuUtterances(),
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             replacer,
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ----             space));
    // ---- NOTE-FOR-REFERENCE-DEFINED-IN-PARENT ---- }
}
