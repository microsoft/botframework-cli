/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntityAnnotationObject } from "./IEntityAnnotationObject";
// import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
// import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

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
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = entityAnnotatedCorpusData.luUtterances;
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
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] = entityAnnotatedCorpusData.luUtterances;
        entityAnnotatedCorpusData.luUtterances = luUtterances.filter(
            (value: ITextIntentSequenceLabelObjectByPosition,
             index: number,
             array: ITextIntentSequenceLabelObjectByPosition[]) => {
                return (filteringIndexSet.has(index));
            });
        // -------------------------------------------------------------------
        entityAnnotatedCorpusData.intentInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectIntents(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.entityTypeInstanceIndexMapArray =
            entityAnnotatedCorpusData.collectEntityTypes(entityAnnotatedCorpusData.luUtterances);
        entityAnnotatedCorpusData.intentsUtterancesWeights.intents = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusData.intentsUtterancesWeights.utterances = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusData.intentsUtterancesWeights.weights = entityAnnotatedCorpusData.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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

    public retrieveEntityAnnotatedCorpusUtterances(
        // ---- NOTE ---- the return is newly allocated, unlike the one in LuData
        content: string,
        includePartOfSpeechTagTagAsEntities: boolean = true,
        utteranceReconstructionDelimiter: string = " ",
        defaultEntityTag: string = "O",
        useIdForIntent: boolean = true): ITextIntentSequenceLabelObjectByPosition[] {
        const entityAnnotatedCorpusTypes: IEntityAnnotationObject =
            Utility.loadEntityAnnotatedCorpusContent(
                content,               // ---- filename: string,
                this.getLinesToSkip(), // ---- lineIndexToStart: number = 0,
                ",",                   // ---- columnDelimiter: string = ",",
                "\n",                  // ---- rowDelimiter: string = "\n",
                -1,                    // ---- lineIndexToEnd: number = -1
            );
        const entityAnnotatedCorpusUtterances: ITextIntentSequenceLabelObjectByPosition[] =
            Utility.entityAnnotatedCorpusTypesToEntityAnnotatedCorpusUtterances(
                entityAnnotatedCorpusTypes,
                includePartOfSpeechTagTagAsEntities,
                utteranceReconstructionDelimiter,
                defaultEntityTag,
                useIdForIntent);
        return entityAnnotatedCorpusUtterances;
    }

    public getLuObject(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusData object to generate a LU object.");
    }
    public getLuLuisJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusData object to generate a LUIS JSON object.");
    }
    public getLuQnaJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusData object to generate a QnA JSON object.");
    }
    public getLuQnaAlterationsJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusData to generate a QnA Alterations JSON object.");
    }

    public getLinesToSkip(): number {
        return this.linesToSkip;
    }
}
