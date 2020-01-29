/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class EntityAnnotatedCorpusData extends Data {

    public static createEntityAnnotatedCorpusDataFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusData: EntityAnnotatedCorpusData,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
                existingEntityAnnotatedCorpusData.getContent(),
                existingEntityAnnotatedCorpusData.getFeaturizer(),
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
            "text": string }> = entityAnnotatedCorpusData.luUtterances;
        const lengthUtterancesArray: number =
            luUtterances.length;
        entityAnnotatedCorpusData.luUtterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            entityAnnotatedCorpusData.luUtterances.push(luUtterances[index]);
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterances.intents = entityAnnotatedCorpusData.luUtterances.map(
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
        entityAnnotatedCorpusData.intentsUtterances.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
            entityAnnotatedCorpusData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

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
            "text": string }> = entityAnnotatedCorpusData.luUtterances;
        entityAnnotatedCorpusData.luUtterances = luUtterances.filter(
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
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterances.intents = entityAnnotatedCorpusData.luUtterances.map(
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
        entityAnnotatedCorpusData.intentsUtterances.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
        entityAnnotatedCorpusData.intentsUtterances.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
            entityAnnotatedCorpusData.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    protected linesToSkip: number = 0;

    protected constructor(
        featurizer: NgramSubwordFeaturizer,
        linesToSkip: number = 0) {
        super(featurizer);
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusData.createEntityAnnotatedCorpusDataFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
            existingData as EntityAnnotatedCorpusData,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- textColumnIndex,
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
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusData.createEntityAnnotatedCorpusDataFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
            existingData as EntityAnnotatedCorpusData,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- textColumnIndex,
            linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    public retrieveEntityAnnotatedCorpusUtterances( // ---- NOTE the return is newly allocated, unlike the one of LuData
        content: string,
        includePartOfSpeechTagTagAsEntities: boolean = true,
        utteranceReconstructionDelimiter: string = " ",
        defaultEntityTag: string = "O",
        useIdForIntent: boolean = true): Array<{
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
        const entityAnnotatedCorpusUtterances: Array<{
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
            Utility.entityAnnotatedCorpusTypesToEntityAnnotatedCorpusUtterances(
                entityAnnotatedCorpusTypes,
                includePartOfSpeechTagTagAsEntities,
                utteranceReconstructionDelimiter,
                defaultEntityTag,
                useIdForIntent);
        return entityAnnotatedCorpusUtterances;
    }

    public getLuObject(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusData file.
    }
    public getLuLuisJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusData file.
    }
    public getLuQnaJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusData file.
    }
    public getLuQnaAlterationsJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusData file.
    }

    public getLinesToSkip(): number {
        return this.linesToSkip;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     JSON.stringify(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuObject(),
        // ---- NOTE-TODO-PLACEHOLDER ----         replacer,
        // ---- NOTE-TODO-PLACEHOLDER ----         space));
    }
    public dumpLuLuisJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     JSON.stringify(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure(),
        // ---- NOTE-TODO-PLACEHOLDER ----         replacer,
        // ---- NOTE-TODO-PLACEHOLDER ----         space));
    }
    public dumpLuLuisJsonStructureInLuFormat(
        filename: string): void {
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     constructMdFromLUIS(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure()));
    }
}
