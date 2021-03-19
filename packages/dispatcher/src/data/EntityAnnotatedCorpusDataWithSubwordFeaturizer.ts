/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "./Data";
import { DataWithSubwordFeaturizer } from "./DataWithSubwordFeaturizer";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../utility/Utility";

export class EntityAnnotatedCorpusDataWithSubwordFeaturizer extends DataWithSubwordFeaturizer {

    // tslint:disable-next-line: max-line-length
    public static createEntityAnnotatedCorpusDataWithSubwordFeaturizerFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer =
            EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizer(
                existingEntityAnnotatedCorpusDataWithSubwordFeaturizer.getContent(),
                existingEntityAnnotatedCorpusDataWithSubwordFeaturizer.getFeaturizer(),
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
            "text": string,
            "weight": number }> = entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances;
        const lengthUtterancesArray: number =
            luUtterances.length;
        entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances = [];
        for (const index of samplingIndexArray) {
            if ((index < 0) || (index > lengthUtterancesArray)) {
                Utility.debuggingThrow(`(index|${index}|<0)||(index|${index}|>lengthUtterancesArray|${lengthUtterancesArray}|)`);
            }
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.push(luUtterances[index]);
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectIntents(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectEntityTypes(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        if (toResetFeaturizerLabelFeatureMaps) {
            entityAnnotatedCorpusDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusDataWithSubwordFeaturizer;
    }

    // tslint:disable-next-line: max-line-length
    public static createEntityAnnotatedCorpusDataWithSubwordFeaturizerFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
        existingEntityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer =
            EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizer(
                existingEntityAnnotatedCorpusDataWithSubwordFeaturizer.getContent(),
                existingEntityAnnotatedCorpusDataWithSubwordFeaturizer.getFeaturizer(),
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
            "text": string,
            "weight": number }> = entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances;
        entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances = luUtterances.filter(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectIntents(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectEntityTypes(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        if (toResetFeaturizerLabelFeatureMaps) {
            entityAnnotatedCorpusDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusDataWithSubwordFeaturizer;
    }

    public static createEntityAnnotatedCorpusDataWithSubwordFeaturizer(
        content: string,
        featurizer: NgramSubwordFeaturizer,
        linesToSkip: number,
        toResetFeaturizerLabelFeatureMaps: boolean): EntityAnnotatedCorpusDataWithSubwordFeaturizer {
        // -------------------------------------------------------------------
        const entityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer =
            new EntityAnnotatedCorpusDataWithSubwordFeaturizer(
                featurizer,
                linesToSkip);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.content =
            content;
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.retrieveEntityAnnotatedCorpusUtterances(
                content);
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectIntents(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.collectEntityTypes(
                entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.intents =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
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
        if (toResetFeaturizerLabelFeatureMaps) {
            entityAnnotatedCorpusDataWithSubwordFeaturizer.resetFeaturizerLabelFeatureMaps();
        }
        // -------------------------------------------------------------------
        entityAnnotatedCorpusDataWithSubwordFeaturizer.featurizeIntentsUtterances();
        // -------------------------------------------------------------------
        return entityAnnotatedCorpusDataWithSubwordFeaturizer;
    }

    protected linesToSkip: number = 0;

    protected constructor(
        featurizer: NgramSubwordFeaturizer,
        linesToSkip: number = 0) {
        super(featurizer);
        this.linesToSkip = linesToSkip;
    }

    public async createDataFromSamplingExistingDataUtterances(
        existingDataWithSubwordFeaturizer: DataWithSubwordFeaturizer,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data> {
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizerFromSamplingExistingEntityAnnotatedCorpusDataUtterances(
            existingDataWithSubwordFeaturizer as EntityAnnotatedCorpusDataWithSubwordFeaturizer,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- weightColumnIndex,
            linesToSkip,
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
        // tslint:disable-next-line: max-line-length
        return EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizerFromFilteringExistingEntityAnnotatedCorpusDataUtterances(
            existingDataWithSubwordFeaturizer as EntityAnnotatedCorpusDataWithSubwordFeaturizer,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- labelColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- textColumnIndex,
            // ---- NOTE-NO-NEED-FOR-EntityAnnotatedCorpusDataWithSubwordFeaturizer ---- weightColumnIndex,
            linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    // tslint:disable-next-line: max-line-length
    public retrieveEntityAnnotatedCorpusUtterances( // ---- NOTE the return is newly allocated, unlike the one for LuDataWithSubwordFeaturizer
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
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusDataWithSubwordFeaturizer file.
    }
    public getLuLuisJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusDataWithSubwordFeaturizer file.
    }
    public getLuQnaJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusDataWithSubwordFeaturizer file.
    }
    public getLuQnaAlterationsJsonStructure(): any {
        return null; // ---- NOTE: not constructued from an EntityAnnotatedCorpusDataWithSubwordFeaturizer file.
    }

    public getLinesToSkip(): number {
        return this.linesToSkip;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        // tslint:disable-next-line: max-line-length
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusDataWithSubwordFeaturizer source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusDataWithSubwordFeaturizer content!
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
        // tslint:disable-next-line: max-line-length
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusDataWithSubwordFeaturizer source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusDataWithSubwordFeaturizer content!
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
        // tslint:disable-next-line: max-line-length
        // ==== NOTE-TODO ==== a EntityAnnotatedCorpusDataWithSubwordFeaturizer source does not have a LU LUIS structure,
        // ==== NOTE-TODO ==== need to develop logic for creating a LU LUIS structure
        // ==== NOTE-TODO ==== out of EntityAnnotatedCorpusDataWithSubwordFeaturizer content!
        // ---- NOTE-TODO-PLACEHOLDER ---- Utility.dumpFile(
        // ---- NOTE-TODO-PLACEHOLDER ----     filename,
        // ---- NOTE-TODO-PLACEHOLDER ----     constructMdFromLUIS(
        // ---- NOTE-TODO-PLACEHOLDER ----         this.getLuLuisJsonStructure()));
        return "";
    }
}
