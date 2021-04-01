/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntityAnnotationObject } from "./IEntityAnnotationObject";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

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
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances;
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
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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
        const luUtterances: ITextIntentSequenceLabelObjectByPosition[] =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances;
        entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances = luUtterances.filter(
            (value: ITextIntentSequenceLabelObjectByPosition,
             index: number,
             array: ITextIntentSequenceLabelObjectByPosition[]) => {
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
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.intent);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.utterances =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.text);
        entityAnnotatedCorpusDataWithSubwordFeaturizer.intentsUtterancesWeights.weights =
            entityAnnotatedCorpusDataWithSubwordFeaturizer.luUtterances.map(
            (entry: ITextIntentSequenceLabelObjectByPosition) => entry.weight);
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
            linesToSkip,
            filteringIndexSet,
            toResetFeaturizerLabelFeatureMaps);
    }

    // tslint:disable-next-line: max-line-length
    public retrieveEntityAnnotatedCorpusUtterances(
        // ---- NOTE ---- the return is newly allocated, unlike the one in LuDataWithSubwordFeaturizer
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
            "EntityAnnotatedCorpusDataWithSubwordFeaturizer object to generate a LU object.");
    }
    public getLuLuisJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusDataWithSubwordFeaturizer object to generate a LUIS JSON object.");
    }
    public getLuQnaJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusDataWithSubwordFeaturizer object to generate a QnA JSON object.");
    }
    public getLuQnaAlterationsJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("Logical error as it's not implemented for a " +
            "EntityAnnotatedCorpusDataWithSubwordFeaturizer to generate a QnA Alterations JSON object.");
    }

    public getLinesToSkip(): number {
        return this.linesToSkip;
    }
}
