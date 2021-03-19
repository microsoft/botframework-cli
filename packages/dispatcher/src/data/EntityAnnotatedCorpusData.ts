/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";

import { Utility } from "../utility/Utility";

export class EntityAnnotatedCorpusData extends Data {

    public static createEntityAnnotatedCorpusDataFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusData: EntityAnnotatedCorpusData,
        linesToSkip: number,
        samplingIndexArray: number[]): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
                existingEntityAnnotatedCorpusData.getContent(),
                linesToSkip);
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
            "text": string,
            "weight": number }> = entityAnnotatedCorpusData.luUtterances;
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
        entityAnnotatedCorpusData.intentsUtterancesWeights.intents = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.intent as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.text as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.weight as number);
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    public static createEntityAnnotatedCorpusDataFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusData: EntityAnnotatedCorpusData,
        linesToSkip: number,
        filteringIndexSet: Set<number>): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
                existingEntityAnnotatedCorpusData.getContent(),
                linesToSkip);
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
            "text": string,
            "weight": number }> = entityAnnotatedCorpusData.luUtterances;
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
                "text": string,
                "weight": number },
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
                "text": string,
                "weight": number }>) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterancesWeights.intents = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.intent as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.text as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.weight as number);
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    public static createEntityAnnotatedCorpusData(
        content: string,
        linesToSkip: number): EntityAnnotatedCorpusData {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
            new EntityAnnotatedCorpusData(
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
        entityAnnotatedCorpusData.intentsUtterancesWeights.intents = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.intent as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.text as string);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
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
                "text": string,
                "weight": number }) => entry.weight as number);
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusData;
    }

    protected linesToSkip: number = 0;

    protected constructor(
        linesToSkip: number = 0) {
        super();
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusData.createEntityAnnotatedCorpusDataFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
            existingData as EntityAnnotatedCorpusData,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- weightColumnIndex,
            linesToSkip,
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
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusData.createEntityAnnotatedCorpusDataFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
            existingData as EntityAnnotatedCorpusData,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusData ---- weightColumnIndex,
            linesToSkip,
            filteringIndexSet);
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
            "text": string,
            "weight": number }> {
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
            "text": string,
            "weight": number }> =
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
        space?: string | number): string {
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
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
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
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
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusData source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusData content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     constructMdFromLUIS(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure()));
        return "";
    }
}
