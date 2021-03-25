/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// ---- NOTE-FOR-REFERENCE ---- @deprecated - since v4.0.0 - use value === null instead.
// ---- NOTE-FOR-REFERENCE ---- 'isNull' is deprecatedts(6385)
// ---- NOTE-FOR-REFERENCE ---- import { isNull } from "util";
// ---- NOTE-FOR-REFERENCE ---- import { isUndefined } from "util";

// tslint:disable-next-line: no-var-requires
const constructMdFromLUIS = require("@microsoft/bf-lu").refresh.constructMdFromLUIS;

// tslint:disable-next-line: max-line-length
// ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
// import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";
import { ITextIntentSequenceLabelObjectByPosition} from "./ITextIntentSequenceLabelObjectByPosition";

import { Utility } from "../utility/Utility";

export abstract class Data {

    protected content: string = "";
    protected luUtterances: ITextIntentSequenceLabelObjectByPosition[] = [];
    protected intentInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
    protected entityTypeInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();

    protected intentsUtterancesWeights: {
        "intents": string[],
        "utterances": string[],
        "weights": number[] } =
        { intents: [], utterances: [], weights: [] };
    protected intentUtteranceSparseIndexArrays: {
        "intentLabelIndexArray": number[],
        "utteranceFeatureIndexArrays": number[][] } =
        { intentLabelIndexArray: [], utteranceFeatureIndexArrays: [] };

    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- protected featurizer: NgramSubwordFeaturizer;

    protected constructor() {
    }

     // ---- NOTE-FOR-REFERENCE ---- 'async' modifier cannot be used with 'abstract' modifier.ts(1243) ---- async
    public abstract createDataFromSamplingExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        samplingIndexArray: number[],
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data>;

    // ---- NOTE-FOR-REFERENCE ---- 'async' modifier cannot be used with 'abstract' modifier.ts(1243) ---- async
    public abstract createDataFromFilteringExistingDataUtterances(
        existingData: Data,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        linesToSkip: number,
        filteringIndexSet: Set<number>,
        toResetFeaturizerLabelFeatureMaps: boolean): Promise<Data>;

    public collectEntityTypes(luUtterances: ITextIntentSequenceLabelObjectByPosition[]): Map<string, number[]> {
        const entityTypeInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
        luUtterances.forEach(
            (element: ITextIntentSequenceLabelObjectByPosition,
             index: number) => {
                const entities: IEntityObjectByPosition[] = element.entities;
                entities.forEach((entityElement: IEntityObjectByPosition) => {
                    const entityType: string = entityElement.entity;
                    if (entityType) {
                        Utility.addKeyValueToNumberMapArray(
                            entityTypeInstanceIndexMapArray,
                            entityType,
                            index);
                    }
            });
        });
        return entityTypeInstanceIndexMapArray;
    }
    public collectIntents(luUtterances: ITextIntentSequenceLabelObjectByPosition[]): Map<string, number[]> {
        const intentInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
        luUtterances.forEach(
            (element: ITextIntentSequenceLabelObjectByPosition,
             index: number) => {
                const intent: string = element.intent;
                if (intent) {
                    Utility.addKeyValueToNumberMapArray(
                        intentInstanceIndexMapArray,
                        intent,
                        index);
            }
        });
        return intentInstanceIndexMapArray;
    }

    public getContent(): string {
        return this.content;
    }

    public getLuObject(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("It's a logic error calling this function without it being overridden by a child class.");
    }
    public getLuLuisJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("It's a logic error calling this function without it being overridden by a child class.");
    }
    public getLuQnaJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("It's a logic error calling this function without it being overridden by a child class.");
    }
    public getLuQnaAlterationsJsonStructure(): any { // ---- NOTE: can be overriden by a child class.
        throw new Error("It's a logic error calling this function without it being overridden by a child class.");
    }

    public getLuUtterances(): ITextIntentSequenceLabelObjectByPosition[] {
        return this.luUtterances;
    }
    public getIntentInstanceIndexMapArray(): Map<string, number[]> {
        return this.intentInstanceIndexMapArray;
    }
    public getEntityTypeInstanceIndexMapArray(): Map<string, number[]> {
        return this.entityTypeInstanceIndexMapArray;
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

    public dumpLuUtterances(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): string {
        return Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuUtterances(),
                replacer,
                space));
    }

    public getNumberLuUtterances(): number {
        return this.getLuUtterances().length;
    }
    public getNumberIntents(): number {
        return this.getIntentInstanceIndexMapArray().size;
    }
    public getNumberEntityTypes(): number {
        return this.getEntityTypeInstanceIndexMapArray().size;
    }

    public getIntentsUtterancesWeights(): {
        "intents": string[],
        "utterances": string[],
        "weights": number[] } {
        return this.intentsUtterancesWeights;
    }
    public getIntents(): string[] {
        return this.intentsUtterancesWeights.intents;
    }
    public getUtterances(): string[] {
        return this.intentsUtterancesWeights.utterances;
    }
    public getWeights(): number[] {
        return this.intentsUtterancesWeights.weights;
    }

    public getIntentUtteranceSparseIndexArrays(): {
        "intentLabelIndexArray": number[],
        "utteranceFeatureIndexArrays": number[][] } {
        return this.intentUtteranceSparseIndexArrays;
    }
    public getIntentLabelIndexArray(): number[] {
        return this.intentUtteranceSparseIndexArrays.intentLabelIndexArray;
    }
    public getUtteranceFeatureIndexArrays(): number[][] {
        return this.intentUtteranceSparseIndexArrays.utteranceFeatureIndexArrays;
    }

    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public resetFeaturizerLabelFeatureMaps(): void {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     this.getFeaturizer().resetLabelFeatureMaps(
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----         this.getIntentsUtterancesWeights());
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public featurizeIntentsUtterances(): void {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     this.intentUtteranceSparseIndexArrays =
    // tslint:disable-next-line: max-line-length
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----         this.getFeaturizer().createIntentUtteranceSparseIndexArrays(
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----             this.getIntentsUtterancesWeights());
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public featurize(inputUtterance: string): string[] {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.getFeaturizer().featurize(inputUtterance);
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public getFeaturizer(): NgramSubwordFeaturizer {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.featurizer;
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public getFeaturizerLabels(): string[] {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.getFeaturizer().getLabels();
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public getFeaturizerLabelMap(): Map<string, number> {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.getFeaturizer().getLabelMap();
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public getFeaturizerFeatures(): string[] {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.getFeaturizer().getFeatures();
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- public getFeaturizerFeatureMap(): Map<string, number> {
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ----     return this.getFeaturizer().getFeatureMap();
    // ---- NOTE-FOR-REFERENCE-REFACTORED-TO-CHILDREN ---- }

    public collectUtteranceIndexSetSeedingIntentTrainingSet(
        seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>>,
        candidateUtteranceIndexSet: Set<number>,
        limitInitialNumberOfInstancesPerCategory: number = 10): {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
        } {
        const candidateUtteranceIndexSetSampled: Set<number> = new Set<number>();
        for (const luUtteranceIndex of candidateUtteranceIndexSet) {
            const luUtterance: ITextIntentSequenceLabelObjectByPosition =
                this.luUtterances[luUtteranceIndex];
            const intent: string =
                luUtterance.intent;
            const utteranceIndexIntentSet: Set<number> =
                seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels.get(intent) as Set<number>;
            const existingNumberUtterances: number =
                utteranceIndexIntentSet.size;
            if ((limitInitialNumberOfInstancesPerCategory < 0) ||
                (existingNumberUtterances < limitInitialNumberOfInstancesPerCategory)) {
                utteranceIndexIntentSet.add(luUtteranceIndex);
                candidateUtteranceIndexSetSampled.add(luUtteranceIndex);
            }
        }
        const candidateUtteranceIndexSetRemaining: Set<number> =
            new Set<number>([...candidateUtteranceIndexSet].filter((entry: number) => {
                return !candidateUtteranceIndexSetSampled.has(entry);
            }));
        return {
            candidateUtteranceIndexSetRemaining,
            candidateUtteranceIndexSetSampled,
            seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
        };
    }

    public collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels(
        toShuffle: boolean = true,
        toEnsureEachIntentHasOneUtteranceLabel: boolean = true,
        toEnsureEachEntityTypeHasOneUtteranceLabel: boolean = true): {
            "smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "smallUtteranceIndexSetCoveringAllIntentEntityLabels": Set<number>,
            "remainingUtteranceIndexSet": Set<number>,
        } {
        const luUtteranceIndexes: number[] =
            Array.from(Array(this.getNumberLuUtterances()).keys());
        if (toShuffle) {
            Utility.shuffle(luUtteranceIndexes);
        }
        const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            new Map<string, Set<number>>();
        const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            new Map<string, Set<number>>();
        const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
            new Set<number>();
        if (toEnsureEachIntentHasOneUtteranceLabel || toEnsureEachEntityTypeHasOneUtteranceLabel) {
            const numberIntents: number =
                this.getNumberIntents();
            const numberEntityTypes: number =
                this.getNumberEntityTypes();
            const intentSet: Set<string> =
                new Set<string>();
            const entityTypeSet: Set<string> =
                new Set<string>();
            for (const luUtteranceIndex of luUtteranceIndexes) {
            // for (let i: number = 0; i < luUtteranceIndexes.length; i++) {
                // const luUtteranceIndex: number = luUtteranceIndexes[i];
                const luUtterance: ITextIntentSequenceLabelObjectByPosition = this.luUtterances[luUtteranceIndex];
                let hasNewUtteranceFoundForCoveringAllIntentEntityLabels: boolean = false;
                if (toEnsureEachIntentHasOneUtteranceLabel) {
                    if (intentSet.size < numberIntents) {
                        const intent: string = luUtterance.intent;
                        if (!(intentSet.has(intent))) {
                            intentSet.add(intent);
                            hasNewUtteranceFoundForCoveringAllIntentEntityLabels = true;
                            // Utility.debuggingLog(
                            //     `i=${i}, ` +
                            //     `luUtteranceIndex=${luUtteranceIndex}, ` +
                            //     `intent=${intent}, ` +
                            //     `intentSet.size=${intentSet.size}, ` +
                            //     `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                            //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                        }
                    }
                }
                if (toEnsureEachEntityTypeHasOneUtteranceLabel) {
                    if (entityTypeSet.size < numberEntityTypes) {
                        const entities: IEntityObjectByPosition[] = luUtterance.entities;
                        entities.forEach((entityElement: IEntityObjectByPosition) => {
                            const entityType: string = entityElement.entity;
                            if (entityType) {
                                if (!(entityTypeSet.has(entityType))) {
                                    entityTypeSet.add(entityType);
                                    hasNewUtteranceFoundForCoveringAllIntentEntityLabels = true;
                                    // Utility.debuggingLog(
                                    //     `i=${i}, ` +
                                    //     `luUtteranceIndex=${luUtteranceIndex}, ` +
                                    //     `entityType=${entityType}, ` +
                                    //     `entityTypeSet.size=${entityTypeSet.size}, ` +
                                    //     `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                                    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                                }
                            }
                        });
                    }
                }
                if (hasNewUtteranceFoundForCoveringAllIntentEntityLabels) {
                    {
                        smallUtteranceIndexSetCoveringAllIntentEntityLabels.add(luUtteranceIndex);
                    }
                    {
                        const intent: string = luUtterance.intent;
                        Utility.addKeyValueToNumberMapSet(
                            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
                            intent,
                            luUtteranceIndex);
                    }
                    {
                        const entities: IEntityObjectByPosition[] = luUtterance.entities;
                        entities.forEach((entityElement: IEntityObjectByPosition) => {
                            const entityType: string = entityElement.entity;
                            if (entityType) {
                                Utility.addKeyValueToNumberMapSet(
                                    smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels,
                                    entityType,
                                    luUtteranceIndex);
                            }
                        });
                    }
                    // Utility.debuggingLog(
                    //     `i=${i}, ` +
                    //     `luUtteranceIndex=${luUtteranceIndex}, ` +
                    //     `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                    //     `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                }
                if (toEnsureEachIntentHasOneUtteranceLabel && (intentSet.size < numberIntents)) {
                    continue;
                }
                if (toEnsureEachEntityTypeHasOneUtteranceLabel && (entityTypeSet.size < numberEntityTypes)) {
                    continue;
                }
                {
                    break;
                }
            }
        }
        const remainingUtteranceIndexSet: Set<number> =
            new Set<number>(luUtteranceIndexes.filter((entry: number) => {
                return !smallUtteranceIndexSetCoveringAllIntentEntityLabels.has(entry);
            }));
        return {
            remainingUtteranceIndexSet,
            smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels,
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            smallUtteranceIndexSetCoveringAllIntentEntityLabels,
        };
    }
}
