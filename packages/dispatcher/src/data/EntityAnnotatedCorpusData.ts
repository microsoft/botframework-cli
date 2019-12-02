/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class EntityAnnotatedCorpusData extends Data {

    public static createEntityAnnotatedCorpusDataFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusData: EntityAnnotatedCorpusData,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
                existingEntityAnnotatedCorpusData.getContent(),
                existingEntityAnnotatedCorpusData.getFeaturizer(),
                linesToSkip,
                toResetFeaturizerLabelFeatureMaps);
        // -------------------------------------------------------------------
        const utterancesArray: any[] = entityAnnotatedCorpusData.retrieveEntityAnnotatedCorpusUtterances(
            entityAnnotatedCorpusData.content);
        entityAnnotatedCorpusData.luUtterances = utterancesArray.filter(
            (value: any, index: number, array: any[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        // entityAnnotatedCorpusData.luUtterances =
        //     entityAnnotatedCorpusData.retrieveEntityAnnotatedCorpusUtterances(entityAnnotatedCorpusData.content);
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterances.intents = entityAnnotatedCorpusData.luUtterances.map(
            (entry: any) => entry.intent as string);
        entityAnnotatedCorpusData.intentsUtterances.utterances = entityAnnotatedCorpusData.luUtterances.map(
            (entry: any) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            entityAnnotatedCorpusData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    public static createEntityAnnotatedCorpusData(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        linesToSkip: number,
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            new EntityAnnotatedCorpusData(
                featurizer,
                linesToSkip);
        entityAnnotatedCorpusData.content =
            content;
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.luUtterances = entityAnnotatedCorpusData.retrieveEntityAnnotatedCorpusUtterances(
            content);
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterances.intents = entityAnnotatedCorpusData.luUtterances.map(
            (entry: any) => entry.intent as string);
        entityAnnotatedCorpusData.intentsUtterances.utterances = entityAnnotatedCorpusData.luUtterances.map(
            (entry: any) => entry.text as string);
        // -------------------------------------------------------------------
        if (toResetFeaturizerLabelFeatureMaps) {
            entityAnnotatedCorpusData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    // protected luObject: any = null;
    // protected luJsonStructure: any = null;

    protected linesToSkip: number = 0;

    protected constructor(
        featurizer: NgramSubwordFeaturizer,
        linesToSkip: number = 0) {
        super(featurizer);
        this.linesToSkip = linesToSkip;
    }

    public retrieveEntityAnnotatedCorpusUtterances(
        content: string,
        includePartOfSpeechTagTagAsEntities: boolean = true,
        utteranceReconstructionDelimiter: string = " ",
        defaultEntityTag: string = "O",
        useIdForIntent: boolean = true): any[] {
        const entityAnnotatedCorpusTypes: {
            "ids": string[],
            "wordArrays": string[][],
            "partOfSpeechTagArrays": string[][],
            "entityTagArrays": string[][] } =
            Utility.loadEntityAnnotatedCorpusContent(
                content,               // ---- filename: string,
                this.getLinesToSkip(), // ---- lineIndexToStart: number = 0,
                ",",                   // ---- columnDelimiter: string = ",",
                "\n",                  // ---- rowDelimiter: string = "\n",
                -1,                    // ---- lineIndexToEnd: number = -1
            );
        const entityAnnotatedCorpusUtterances: any[] =
            Utility.entityAnnotatedCorpusTypesToEntityAnnotatedCorpusUtterances(
                entityAnnotatedCorpusTypes,
                includePartOfSpeechTagTagAsEntities,
                utteranceReconstructionDelimiter,
                defaultEntityTag,
                useIdForIntent);
        return entityAnnotatedCorpusUtterances;
    }

    public getLuObject(): any {
        return null; // return this.luObject;
    }
    public getLuJsonStructure(): any {
        return null; // this.luJsonStructure;
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
