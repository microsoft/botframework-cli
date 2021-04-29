/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { ILabelArrayAndMap } from "./ILabelArrayAndMap";
import { ITextUtteranceLabelMapDataStructure } from "./ITextUtteranceLabelMapDataStructure";
import { ITextUtteranceLabelObjectMapDataStructure } from "./ITextUtteranceLabelObjectMapDataStructure";
import { ITextUtteranceLabelStringMapDataStructure } from "./ITextUtteranceLabelStringMapDataStructure";

import { Label } from "./Label";
import { LabelType } from "./LabelType";
import { ScoreEntity } from "./ScoreEntity";
import { ScoreIntent } from "./ScoreIntent";
import { ScoreEntityUtterancePrediction } from "./ScoreEntityUtterancePrediction";
import { ScoreIntentUtterancePrediction } from "./ScoreIntentUtterancePrediction";

import { StructTextNumber } from "./StructTextNumber";

import { Utility } from "../utility/Utility";
import { PredictionType } from "./PredictionType";

export class LabelStructureUtility {

    // =======================================================================
    // LabelType utility functions
    // =======================================================================

    public static labelTypeToNumber(labelType: LabelType): number {
        if (labelType === LabelType.Intent) {
            return 1;
        }
        if (labelType === LabelType.Entity) {
            return 2;
        }
        if (labelType === LabelType.Summarization) {
            return 4;
        }
        if (labelType === LabelType.All) {
            return 0xFFFF;
        }
        if (labelType === LabelType.Unknown) {
            return 0;
        }
        return 0;
    }

    public static numberToLabelType(labelType: number): LabelType {
        if (labelType === 1) {
            return LabelType.Intent;
        }
        if (labelType === 2) {
            return LabelType.Entity;
        }
        if (labelType === 4) {
            return LabelType.Summarization;
        }
        if (labelType === 0xFFFF) {
            return LabelType.All;
        }
        if (labelType === 0) {
            return LabelType.Unknown;
        }
        return LabelType.Unknown;
    }

    // =======================================================================
    // ITextUtteranceLabelMapDataStructure-related utility functions
    // =======================================================================
    public static instantiateITextUtteranceLabelMapDataStructure(): ITextUtteranceLabelMapDataStructure {
        return {
            utteranceLabelsMap: new Map<string, Set<string>>(),
            utteranceLabelDuplicateMap: new Map<string, Set<string>>(),
            utteranceEntityLabelsMap: new Map<string, Label[]>(),
            utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};
    }
    public static instantiateITextUtteranceLabelObjectMapDataStructure(): ITextUtteranceLabelObjectMapDataStructure {
        return {
            utteranceEntityLabelsMap: new Map<string, Label[]>(),
            utteranceEntityLabelDuplicateMap: new Map<string, Label[]>()};
    }
    public static instantiateITextUtteranceLabelStringMapDataStructure(): ITextUtteranceLabelStringMapDataStructure {
        return {
            utteranceLabelsMap: new Map<string, Set<string>>(),
            utteranceLabelDuplicateMap: new Map<string, Set<string>>()};
    }

    // =======================================================================
    // without weight
    // =======================================================================

    // -----------------------------------------------------------------------
    // Evaluate predictions to confusion matrices.
    // -----------------------------------------------------------------------

    public static evaluateIntentUtterancePredictionScoresToBinaryConfusionMatrices(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[]>,
        length: number):
        Map<string, Array<{
            "score": number,
            "index": number,
            "binaryConfusionMatrix": BinaryConfusionMatrix }>> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            LabelStructureUtility.evaluateIntentUtterancePredictionScores(
                labelArrayAndMap,
                utteranceIntentLabelsMapGroundTruth,
                utteranceIntentLabelScoresMapPrediction);
        const labelScoreIntentUtteranceConfusionMatricesMap:
            Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>> =
            new Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>>();
        labelScoreIntentUtterancePredictionsMap.forEach((value: ScoreIntentUtterancePrediction[], label: string) => {
            value.sort((a: ScoreIntentUtterancePrediction, b: ScoreIntentUtterancePrediction) => {
                if (a.score > b.score) { return -1; }
                if (a.score < b.score) { return 1; }
                return 0;
            });
            let positives: number = 0;
            let negatives: number = 0;
            value.forEach((x: ScoreIntentUtterancePrediction) => {
                if (x.predictionType === PredictionType.Positive) {
                    positives++;
                } else {
                    negatives++;
                }
            });
            const initialBinaryConfusionMatrix: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
                    positives + negatives,
                    0,
                    positives,
                    0);
            let scoreBinaryConfusionMatrices: Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }> = [];
            if (length >= value.length) {
                scoreBinaryConfusionMatrices =
                    value.map((x: ScoreIntentUtterancePrediction, indexEntry: number) => {
                        return {
                            score: x.score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                x.predictionType === PredictionType.Positive,
                                true,
                                1),
                        };
                    });
            } else {
                const step: number = value.length / length;
                let currentProgress: number = 0;
                for (let indexEntry: number = 0; indexEntry < value.length; indexEntry++) {
                    if (indexEntry >= currentProgress) {
                        currentProgress += step;
                        scoreBinaryConfusionMatrices.push({
                            score: value[indexEntry].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                value[indexEntry].predictionType === PredictionType.Positive,
                                true,
                                1)});
                    } else {
                        initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                            value[indexEntry].predictionType === PredictionType.Positive,
                            false,
                            1);
                    }
                }
            }
            labelScoreIntentUtteranceConfusionMatricesMap.set(
                label,
                scoreBinaryConfusionMatrices);
        });
        return labelScoreIntentUtteranceConfusionMatricesMap;
    }

    public static evaluateEntityUtterancePredictionScoresToBinaryConfusionMatrices(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceEntityLabelsMapGroundTruth: Map<string, Label[]>,
        utteranceEntityLabelScoresMapPrediction: Map<string, ScoreEntity[]>,
        length: number):
        Map<string, Array<{
            "score": number,
            "index": number,
            "binaryConfusionMatrix": BinaryConfusionMatrix }>> {
        const labelScoreEntityUtterancePredictionsMap: Map<string, ScoreEntityUtterancePrediction[]> =
            LabelStructureUtility.evaluateEntityUtterancePredictionScores(
                labelArrayAndMap,
                utteranceEntityLabelsMapGroundTruth,
                utteranceEntityLabelScoresMapPrediction);
        const labelScoreEntityUtteranceConfusionMatricesMap:
            Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>> =
            new Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>>();
        labelScoreEntityUtterancePredictionsMap.forEach((value: ScoreEntityUtterancePrediction[], label: string) => {
            value.sort((a: ScoreEntityUtterancePrediction, b: ScoreEntityUtterancePrediction) => {
                if (a.score > b.score) { return -1; }
                if (a.score < b.score) { return 1; }
                return 0;
            });
            let positives: number = 0;
            let negatives: number = 0;
            value.forEach((x: ScoreEntityUtterancePrediction) => {
                if (x.predictionType === PredictionType.Positive) {
                    positives++;
                } else {
                    negatives++;
                }
            });
            const initialBinaryConfusionMatrix: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
                    positives + negatives,
                    0,
                    positives,
                    0);
            let scoreBinaryConfusionMatrices: Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }> = [];
            if (length <= value.length) {
                scoreBinaryConfusionMatrices =
                    value.map((x: ScoreEntityUtterancePrediction, indexEntry: number) => {
                        return {
                            score: x.score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                x.predictionType === PredictionType.Positive,
                                true,
                                1),
                        };
                    });
            } else {
                const step: number = value.length / length;
                let currentProgress: number = 0;
                for (let indexEntry: number = 0; indexEntry < value.length; indexEntry++) {
                    if (indexEntry >= currentProgress) {
                        currentProgress += step;
                        scoreBinaryConfusionMatrices.push({
                            score: value[indexEntry].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                value[indexEntry].predictionType === PredictionType.Positive,
                                true,
                                1)});
                    } else {
                        initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                            value[indexEntry].predictionType === PredictionType.Positive,
                            false,
                            1);
                    }
                }
            }
            labelScoreEntityUtteranceConfusionMatricesMap.set(
                label,
                scoreBinaryConfusionMatrices);
        });
        return labelScoreEntityUtteranceConfusionMatricesMap;
    }

    public static evaluateIntentUtterancePredictionScores(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[]>):
        Map<string, ScoreIntentUtterancePrediction[]> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            new Map<string, ScoreIntentUtterancePrediction[]>();
        labelArrayAndMap.stringArray.forEach((x: string) => {
            labelScoreIntentUtterancePredictionsMap.set(x, []);
        });
        const utterances: string[] =
            [...utteranceIntentLabelsMapGroundTruth.keys()];
        utterances.forEach((utterance: string) => {
            const utteranceGroundTruthLabels: Set<string> =
                utteranceIntentLabelsMapGroundTruth.get(utterance) as Set<string>;
            if (utteranceIntentLabelScoresMapPrediction.has(utterance)) {
                const utteranceIntentPredictionScores: ScoreIntent[] =
                    utteranceIntentLabelScoresMapPrediction.get(utterance) as ScoreIntent[];
                utteranceIntentPredictionScores.forEach((utteranceIntentPredictionScore: ScoreIntent) => {
                    const utteranceIntentPredictionScoreLabel: string =
                        utteranceIntentPredictionScore.intent;
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceIntentPredictionScoreLabel)) {
                        const score: number =
                            utteranceIntentPredictionScore.score;
                        let isInGroundTruthPositive: boolean =
                            false;
                        for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                            if (utteranceIntentPredictionScoreLabel === utteranceGroundTruthLabel) {
                                isInGroundTruthPositive = true;
                                break;
                            }
                        }
                        const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                            ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                utterance,
                                isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                                utteranceIntentPredictionScoreLabel,
                                score);
                        const perLabelScoreIntentUtterancePredictions: ScoreIntentUtterancePrediction[] =
                            labelScoreIntentUtterancePredictionsMap.get(utteranceIntentPredictionScoreLabel) as
                            ScoreIntentUtterancePrediction[];
                        perLabelScoreIntentUtterancePredictions.push(scoreIntentUtterancePrediction);
                    }
                });
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: string) => {
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceGroundTruthLabel)) {
                        let isInGroundTruthPositive: boolean =
                            false;
                        for (const utteranceIntentPredictionScore of utteranceIntentPredictionScores) {
                            if (utteranceGroundTruthLabel === utteranceIntentPredictionScore.intent) {
                                isInGroundTruthPositive = true;
                                break;
                            }
                        }
                        if (!isInGroundTruthPositive) {
                            const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                                ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    utteranceGroundTruthLabel,
                                    0);
                            const perLabeScoreIntentUtterancePredictions: ScoreIntentUtterancePrediction[] =
                                labelScoreIntentUtterancePredictionsMap.get(utteranceGroundTruthLabel) as
                                ScoreIntentUtterancePrediction[];
                            perLabeScoreIntentUtterancePredictions.push(scoreIntentUtterancePrediction);
                        }
                    }
                });
            } else {
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: string) => {
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceGroundTruthLabel)) {
                        {
                            const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                                ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    utteranceGroundTruthLabel,
                                    0);
                            const perLabelScoreIntentUtterancePredictions: ScoreIntentUtterancePrediction[] =
                                labelScoreIntentUtterancePredictionsMap.get(utteranceGroundTruthLabel) as
                                ScoreIntentUtterancePrediction[];
                            perLabelScoreIntentUtterancePredictions.push(scoreIntentUtterancePrediction);
                        }
                    }
                });
            }
        });
        return labelScoreIntentUtterancePredictionsMap;
    }
    public static evaluateIntentUtterancePredictionScoresLabelOriented(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[]>):
        Map<string, ScoreIntentUtterancePrediction[]> {
        const labeScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            new Map<string, ScoreIntentUtterancePrediction[]>();
        labelArrayAndMap.stringArray.forEach((label: string, index: number) => {
            const perLabeScoreIntentUtterancePredictions: ScoreIntentUtterancePrediction[] = [];
            labeScoreIntentUtterancePredictionsMap.set(label, perLabeScoreIntentUtterancePredictions);
            const utterances: string[] = [...utteranceIntentLabelsMapGroundTruth.keys()];
            utterances.map((utterance: string) => {
                const utteranceGroundTruthLabels: Set<string> =
                    utteranceIntentLabelsMapGroundTruth.get(utterance) as Set<string>;
                let isInGroundTruthPositive: boolean = false;
                for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                    if (utteranceGroundTruthLabel === label) {
                        isInGroundTruthPositive = true;
                        break;
                    }
                }
                let labelScore: number = 0;
                if (utteranceIntentLabelScoresMapPrediction.has(utterance)) {
                    const utteranceIntentPredictionScores: ScoreIntent[] =
                        utteranceIntentLabelScoresMapPrediction.get(utterance) as ScoreIntent[];
                    for (const utteranceIntentPredictionScore of utteranceIntentPredictionScores) {
                        if (utteranceIntentPredictionScore.intent === label) {
                            labelScore = utteranceIntentPredictionScore.score;
                            break;
                        }
                    }
                }
                const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                    ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                        utterance,
                        isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                        label,
                        labelScore);
                perLabeScoreIntentUtterancePredictions.push(scoreIntentUtterancePrediction);
            });
        });
        return labeScoreIntentUtterancePredictionsMap;
    }

    public static evaluateEntityUtterancePredictionScores(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceEntityLabelsMapGroundTruth: Map<string, Label[]>,
        utteranceEntityLabelScoresMapPrediction: Map<string, ScoreEntity[]>):
        Map<string, ScoreEntityUtterancePrediction[]> {
        const labelScoreEntityUtterancePredictionsMap: Map<string, ScoreEntityUtterancePrediction[]> =
            new Map<string, ScoreEntityUtterancePrediction[]>();
        labelArrayAndMap.stringArray.forEach((x: string) => {
            labelScoreEntityUtterancePredictionsMap.set(x, []);
        });
        const utterances: string[] =
            [...utteranceEntityLabelsMapGroundTruth.keys()];
        utterances.forEach((utterance: string) => {
            const utteranceGroundTruthLabels: Label[] =
                utteranceEntityLabelsMapGroundTruth.get(utterance) as Label[];
            if (utteranceEntityLabelScoresMapPrediction.has(utterance)) {
                const utteranceEntityPredictionScores: ScoreEntity[] =
                    utteranceEntityLabelScoresMapPrediction.get(utterance) as ScoreEntity[];
                utteranceEntityPredictionScores.forEach((utteranceEntityPredictionScore: ScoreEntity) => {
                    const utteranceEntityPredictionScoreLabel: Label =
                        utteranceEntityPredictionScore.entity;
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceEntityPredictionScoreLabel.name)) {
                        const score: number =
                            utteranceEntityPredictionScore.score;
                        let isInGroundTruthPositive: boolean =
                            false;
                        for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                            if (utteranceEntityPredictionScoreLabel.equals(utteranceGroundTruthLabel)) {
                                isInGroundTruthPositive = true;
                                break;
                            }
                        }
                        const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                            ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                utterance,
                                isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                                utteranceEntityPredictionScoreLabel.name,
                                score,
                                utteranceEntityPredictionScoreLabel.span.offset,
                                utteranceEntityPredictionScoreLabel.span.length);
                        const perLabeScoreEntityUtterancePredictions: ScoreEntityUtterancePrediction[] =
                            labelScoreEntityUtterancePredictionsMap.get(utteranceEntityPredictionScoreLabel.name) as
                            ScoreEntityUtterancePrediction[];
                        perLabeScoreEntityUtterancePredictions.push(scoreEntityUtterancePrediction);
                    }
                });
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: Label) => {
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceGroundTruthLabel.name)) {
                        let isInGroundTruthPositive: boolean =
                            false;
                        for (const utteranceEntityPredictionScore of utteranceEntityPredictionScores) {
                            if (utteranceGroundTruthLabel.equals(utteranceEntityPredictionScore.entity)) {
                                isInGroundTruthPositive = true;
                                break;
                            }
                        }
                        if (!isInGroundTruthPositive) {
                            const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                                ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    utteranceGroundTruthLabel.name,
                                    0,
                                    utteranceGroundTruthLabel.span.offset,
                                    utteranceGroundTruthLabel.span.length);
                            const perLabeScoreEntityUtterancePredictions: ScoreEntityUtterancePrediction[] =
                                labelScoreEntityUtterancePredictionsMap.get(utteranceGroundTruthLabel.name) as
                                ScoreEntityUtterancePrediction[];
                            perLabeScoreEntityUtterancePredictions.push(scoreEntityUtterancePrediction);
                        }
                    }
                });
            } else {
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: Label) => {
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceGroundTruthLabel.name)) {
                        {
                            const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                                ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    utteranceGroundTruthLabel.name,
                                    0,
                                    utteranceGroundTruthLabel.span.offset,
                                    utteranceGroundTruthLabel.span.length);
                            const perLabeScoreEntityUtterancePredictions: ScoreEntityUtterancePrediction[] =
                                labelScoreEntityUtterancePredictionsMap.get(utteranceGroundTruthLabel.name) as
                                ScoreEntityUtterancePrediction[];
                            perLabeScoreEntityUtterancePredictions.push(scoreEntityUtterancePrediction);
                        }
                    }
                });
            }
        });
        return labelScoreEntityUtterancePredictionsMap;
    }

    // -----------------------------------------------------------------------
    // Parse a JSON array and populate intent and entity instance repository
    // with dedupe logic.
    // -----------------------------------------------------------------------

    // eslint-disable-next-line max-params
    public static getJsonIntentsEntitiesUtterances(
        jsonObjectArray: any,
        hierarchicalLabel: string,
        utteranceIntentLabelsMap: Map<string, Set<string>>,
        utteranceIntentLabelDuplicateMap: Map<string, Set<string>>,
        utteranceEntityLabelsMap: Map<string, Label[]>,
        utteranceEntityLabelDuplicateMap: Map<string, Label[]>): boolean {
        try {
            if (jsonObjectArray.length > 0) {
                jsonObjectArray.forEach((jsonObject: any) => {
                    const utterance: string = jsonObject.text.trim();
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("intents")) {
                        const labels: string[] = jsonObject.intents;
                        labels.forEach((label: string) => {
                            LabelStructureUtility.addNewLabelUtterance(
                              utterance,
                              label,
                              hierarchicalLabel,
                              utteranceIntentLabelsMap,
                              utteranceIntentLabelDuplicateMap);
                            });
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("entities")) {
                        const entities: any[] = jsonObject.entities;
                        entities.forEach((entityEntry: any) => {
                            LabelStructureUtility.addNewLabelEntityUtterance(
                              utterance,
                              entityEntry,
                              utteranceEntityLabelsMap,
                              utteranceEntityLabelDuplicateMap);
                        });
                    }
                });
                return true;
            }
        } catch (error) {
            Utility.debuggingLogWithCause(
                "LabelStructureUtility.getJsonIntentsEntitiesUtterances()",
                error,
                true);
            return false;
        }
        return false;
    }
    public static getJsonIntentEntityScoresUtterances(
        jsonObjectArray: any,
        utteranceIntentLabelScoresMap: Map<string, ScoreIntent[]>,
        utteranceEntityLabelScoresMap: Map<string, ScoreEntity[]>): boolean {
        try {
            if (jsonObjectArray.length > 0) {
                jsonObjectArray.forEach((jsonObject: any) => {
                    const utterance: string = jsonObject.text.trim();
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("intent_scores")) {
                        const intentScores: any[] = jsonObject.intent_scores;
                        utteranceIntentLabelScoresMap.set(utterance, intentScores.map((intentScore: any) => {
                            const intent: string = intentScore.intent;
                            const score: number = intentScore.score;
                            return ScoreIntent.newScoreIntent(intent, score);
                        }));
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("entity_scores")) {
                        const entityScores: any[] = jsonObject.entity_scores;
                        utteranceEntityLabelScoresMap.set(utterance, entityScores.map((entityScore: any) => {
                            const entity: string = entityScore.entity;
                            const startPos: number = entityScore.startPos;
                            const endPos: number = entityScore.endPos;
                            const score: number = entityScore.score;
                            return ScoreEntity.newScoreEntityByPosition(entity, score, startPos, endPos);
                        }));
                    }
                });
                return true;
            }
        } catch (error) {
            Utility.debuggingLogWithCause(
                "LabelStructureUtility.getJsonIntentEntityScoresUtterances()",
                error,
                true);
            return false;
        }
        return false;
    }

    // -----------------------------------------------------------------------
    // Add a new label instance to an instance respository with
    // dedup logic.
    // -----------------------------------------------------------------------

    public static addNewLabelUtterance(
        utterance: string,
        label: string,
        hierarchicalLabel: string,
        utteranceLabelsMap: Map<string, Set<string>>,
        utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
        if (utteranceLabelsMap.has(utterance)) {
            const existingLabels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
            if (!Utility.isEmptyString(hierarchicalLabel)) {
                if (!LabelStructureUtility.addUniqueLabel(hierarchicalLabel, existingLabels)) {
                    LabelStructureUtility.insertStringPairToStringIdStringSetNativeMap(
                        utterance,
                        hierarchicalLabel,
                        utteranceLabelDuplicateMap);
                }
            } else if (!LabelStructureUtility.addUniqueLabel(label, existingLabels)) {
                LabelStructureUtility.insertStringPairToStringIdStringSetNativeMap(
                    utterance,
                    label,
                    utteranceLabelDuplicateMap);
            }
        } else if (!Utility.isEmptyString(hierarchicalLabel)) {
            const labelSet: Set<string> = new Set<string>();
            labelSet.add(hierarchicalLabel);
            utteranceLabelsMap.set(utterance, labelSet);
        } else {
            const labelSet: Set<string> = new Set<string>();
            labelSet.add(label);
            utteranceLabelsMap.set(utterance, labelSet);
        }
    }
    public static addNewLabelEntityUtterance(
        utterance: string,
        entityEntry: any,
        utteranceEntityLabelsMap: Map<string, Label[]>,
        utteranceEntityLabelDuplicateMap: Map<string, Label[]>): void {
        let existingEntityLabels: Label[] = [];
        if (utteranceEntityLabelsMap.has(utterance)) {
            existingEntityLabels = utteranceEntityLabelsMap.get(utterance) as Label[];
        }
        const entityName: string = entityEntry.entity;
        const startPos: number = Number(entityEntry.startPos);
        const endPos: number = Number(entityEntry.endPos);
        // const entityMention: string = entityEntry.text;
        const entityLabel: Label = Label.newEntityLabelByPosition(entityName, startPos, endPos);
        if (existingEntityLabels.length > 0) {
            if (!LabelStructureUtility.addUniqueLabelObjectToArray(
                entityLabel,
                existingEntityLabels)) {
                LabelStructureUtility.insertStringLabelPairToStringIdLabelSetNativeMap(
                    utterance,
                    entityLabel,
                    utteranceEntityLabelDuplicateMap);
            }
        } else {
            existingEntityLabels = [entityLabel];
            utteranceEntityLabelsMap.set(utterance, existingEntityLabels);
        }
    }

    // -----------------------------------------------------------------------
    // Add a new keyed instance to an instance respository with
    // multiple labels.
    // -----------------------------------------------------------------------

    public static insertStringPairToStringIdStringSetNativeMap(
        key: string,
        value: string,
        stringKeyStringSetMap: Map<string, Set<string>>): Map<string, Set<string>> {
        if (!stringKeyStringSetMap) {
            stringKeyStringSetMap = new Map<string, Set<string>>();
        }
        if (stringKeyStringSetMap.has(key)) {
            let stringSet: Set<string> | undefined = stringKeyStringSetMap.get(key);
            if (!stringSet) {
                stringSet = new Set<string>();
                stringKeyStringSetMap.set(key, stringSet);
            }
            stringSet.add(value);
        } else {
            const stringSet: Set<string> = new Set<string>();
            stringKeyStringSetMap.set(key, stringSet);
            stringSet.add(value);
        }
        return stringKeyStringSetMap;
    }
    public static insertStringLabelPairToStringIdLabelSetNativeMap(
        key: string,
        value: Label,
        stringKeyLabelSetMap: Map<string, Label[]>): Map<string, Label[]> {
        if (!stringKeyLabelSetMap) {
            stringKeyLabelSetMap = new Map<string, Label[]>();
        }
        if (stringKeyLabelSetMap.has(key)) {
            let labelSet: Label[] | undefined = stringKeyLabelSetMap.get(key);
            if (!labelSet) {
              labelSet = [];
              stringKeyLabelSetMap.set(key, labelSet);
            }
            LabelStructureUtility.addUniqueLabelObjectToArray(value, labelSet);
        } else {
            const labelSet: Label[] = [];
            stringKeyLabelSetMap.set(key, labelSet);
            labelSet.push(value);
        }
        return stringKeyLabelSetMap;
    }

    // -----------------------------------------------------------------------
    // Identify and add a new label to a label respository.
    // -----------------------------------------------------------------------

    public static addUniqueLabel(newLabel: string, labels: Set<string>): boolean {
        try {
            if (labels.has(newLabel)) {
                return false;
            }
            if (Utility.isEmptyString(newLabel)) {
                Utility.debuggingThrow(`EMPTY newLabel: '${newLabel}'`);
            }
            labels.add(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingThrowWithCause(
                `EXCEPTION calling addUniqueLabel(), newLabel='${newLabel}', labels='${labels}'`,
                error);
        }
        return false;
    }
    public static addUniqueLabelToArray(newLabel: string, labels: string[]): boolean {
        try {
            for (const label of labels) {
                if (label === newLabel) {
                    return false;
                }
            }
            if (Utility.isEmptyString(newLabel)) {
                Utility.debuggingThrow(`EMPTY newLabel: '${newLabel}'`);
            }
            labels.push(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingThrowWithCause(
                `EXCEPTION calling addUniqueLabelToArray(), newLabel=${newLabel}, labels=${labels}`,
                error);
        }
        return false;
    }
    public static addUniqueLabelObjectToArray(newLabel: Label, labels: Label[]): boolean {
        try {
            for (const label of labels) {
                if (label.equals(newLabel)) {
                    return false;
                }
            }
            if ((newLabel === undefined) ||
                Utility.isEmptyString(newLabel.name) ||
                (newLabel.span === undefined) ||
                (newLabel.span.offset === undefined) ||
                (newLabel.span.length === undefined)) {
                Utility.debuggingThrow(`EMPTY newLabel: '${newLabel}'`);
            }
            labels.push(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingThrowWithCause(
                `EXCEPTION calling addUniqueEntityLabelToArray(), newLabel=${newLabel}, labels=${labels}`,
                error);
        }
        return false;
    }

    // =======================================================================
    // with weight
    // =======================================================================

    // -----------------------------------------------------------------------
    // Evaluate weighted-predictions to confusion matrices.
    // -----------------------------------------------------------------------

    public static evaluateIntentUtterancePredictionScoresToBinaryConfusionMatricesWithWeight(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, StructTextNumber[]>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[][]>,
        length: number):
        Map<string, Array<{
            "score": number,
            "index": number,
            "binaryConfusionMatrix": BinaryConfusionMatrix }>> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, Array<[ScoreIntentUtterancePrediction, number]>> =
            LabelStructureUtility.evaluateIntentUtterancePredictionScoresWithWeight(
                labelArrayAndMap,
                utteranceIntentLabelsMapGroundTruth,
                utteranceIntentLabelScoresMapPrediction);
        const labelScoreIntentUtteranceConfusionMatricesMap:
            Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>> =
            new Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>>();
        // tslint:disable-next-line: max-line-length
        labelScoreIntentUtterancePredictionsMap.forEach((value: Array<[ScoreIntentUtterancePrediction, number]>, label: string) => {
            value.sort((a: [ScoreIntentUtterancePrediction, number], b: [ScoreIntentUtterancePrediction, number]) => {
                if (a[0].score > b[0].score) { return -1; }
                if (a[0].score < b[0].score) { return 1; }
                return 0;
            });
            let positives: number = 0;
            let negatives: number = 0;
            value.forEach((x: [ScoreIntentUtterancePrediction, number]) => {
                if (x[0].predictionType === PredictionType.Positive) {
                    positives += x[1];
                } else {
                    negatives += x[1];
                }
            });
            const initialBinaryConfusionMatrix: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
                    positives + negatives,
                    0,
                    positives,
                    0);
            let scoreBinaryConfusionMatrices: Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }> = [];
            if (length >= value.length) {
                scoreBinaryConfusionMatrices =
                    value.map((x: [ScoreIntentUtterancePrediction, number], indexEntry: number) => {
                        return {
                            score: x[0].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                x[0].predictionType === PredictionType.Positive,
                                true,
                                x[1]),
                        };
                    });
            } else {
                const step: number = value.length / length;
                let currentProgress: number = 0;
                for (let indexEntry: number = 0; indexEntry < value.length; indexEntry++) {
                    if (indexEntry >= currentProgress) {
                        currentProgress += step;
                        scoreBinaryConfusionMatrices.push({
                            score: value[indexEntry][0].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                value[indexEntry][0].predictionType === PredictionType.Positive,
                                true,
                                value[indexEntry][1])});
                    } else {
                        initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                            value[indexEntry][0].predictionType === PredictionType.Positive,
                            false,
                            value[indexEntry][1]);
                    }
                }
            }
            labelScoreIntentUtteranceConfusionMatricesMap.set(
                label,
                scoreBinaryConfusionMatrices);
        });
        return labelScoreIntentUtteranceConfusionMatricesMap;
    }

    public static evaluateEntityUtterancePredictionScoresToBinaryConfusionMatricesWithWeight(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceEntityLabelsMapGroundTruth: Map<string, Array<[Label, number]>>,
        utteranceEntityLabelScoresMapPrediction: Map<string, ScoreEntity[][]>,
        length: number):
        Map<string, Array<{
            "score": number,
            "index": number,
            "binaryConfusionMatrix": BinaryConfusionMatrix }>> {
        const labelScoreEntityUtterancePredictionsMap: Map<string, Array<[ScoreEntityUtterancePrediction, number]>> =
            LabelStructureUtility.evaluateEntityUtterancePredictionScoresWithWeight(
                labelArrayAndMap,
                utteranceEntityLabelsMapGroundTruth,
                utteranceEntityLabelScoresMapPrediction);
        const labelScoreEntityUtteranceConfusionMatricesMap:
            Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>> =
            new Map<string, Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }>>();
        // tslint:disable-next-line: max-line-length
        labelScoreEntityUtterancePredictionsMap.forEach((value: Array<[ScoreEntityUtterancePrediction, number]>, label: string) => {
            // tslint:disable-next-line: max-line-length
            value.sort((a: [ScoreEntityUtterancePrediction, number], b: [ScoreEntityUtterancePrediction, number]) => {
                if (a[0].score > b[0].score) { return -1; }
                if (a[0].score < b[0].score) { return 1; }
                return 0;
            });
            let positives: number = 0;
            let negatives: number = 0;
            value.forEach((x: [ScoreEntityUtterancePrediction, number]) => {
                if (x[0].predictionType === PredictionType.Positive) {
                    positives += x[1];
                } else {
                    negatives += x[1];
                }
            });
            const initialBinaryConfusionMatrix: BinaryConfusionMatrix =
                new BinaryConfusionMatrix(
                    positives + negatives,
                    0,
                    positives,
                    0);
            let scoreBinaryConfusionMatrices: Array<{
                "score": number,
                "index": number,
                "binaryConfusionMatrix": BinaryConfusionMatrix }> = [];
            if (length <= value.length) {
                scoreBinaryConfusionMatrices =
                    value.map((x: [ScoreEntityUtterancePrediction, number], indexEntry: number) => {
                        return {
                            score: x[0].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                x[0].predictionType === PredictionType.Positive,
                                true,
                                x[1]),
                        };
                    });
            } else {
                const step: number = value.length / length;
                let currentProgress: number = 0;
                for (let indexEntry: number = 0; indexEntry < value.length; indexEntry++) {
                    if (indexEntry >= currentProgress) {
                        currentProgress += step;
                        scoreBinaryConfusionMatrices.push({
                            score: value[indexEntry][0].score,
                            index: indexEntry,
                            binaryConfusionMatrix: initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                                value[indexEntry][0].predictionType === PredictionType.Positive,
                                true,
                                value[indexEntry][1])});
                    } else {
                        initialBinaryConfusionMatrix.moveFromPredictedNegativeToPositive(
                            value[indexEntry][0].predictionType === PredictionType.Positive,
                            false,
                            value[indexEntry][1]);
                    }
                }
            }
            labelScoreEntityUtteranceConfusionMatricesMap.set(
                label,
                scoreBinaryConfusionMatrices);
        });
        return labelScoreEntityUtteranceConfusionMatricesMap;
    }

    public static evaluateIntentUtterancePredictionScoresWithWeight(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, StructTextNumber[]>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[][]>):
        Map<string, Array<[ScoreIntentUtterancePrediction, number]>> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, Array<[ScoreIntentUtterancePrediction, number]>> =
            new Map<string, Array<[ScoreIntentUtterancePrediction, number]>>();
        labelArrayAndMap.stringArray.forEach((x: string) => {
            labelScoreIntentUtterancePredictionsMap.set(x, []);
        });
        const utterances: string[] =
            [...utteranceIntentLabelsMapGroundTruth.keys()];
        utterances.forEach((utterance: string) => {
            const utteranceGroundTruthLabels: StructTextNumber[] =
                utteranceIntentLabelsMapGroundTruth.get(utterance) as StructTextNumber[];
            // ---- NOTE-TODO ---- check array size
            if (utteranceIntentLabelScoresMapPrediction.has(utterance)) {
                const utteranceIntentPredictionScores: ScoreIntent[][] =
                    utteranceIntentLabelScoresMapPrediction.get(utterance) as ScoreIntent[][];
                // ---- NOTE-TODO ---- check array size
                // ---- NOTE-PLACEHOLDER-USE-THE-FIRST-SCORE-FOR-NOW ----
                utteranceIntentPredictionScores[0].forEach((utteranceIntentPredictionScore: ScoreIntent) => {
                    const utteranceIntentPredictionScoreLabel: string =
                        utteranceIntentPredictionScore.intent;
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceIntentPredictionScoreLabel)) {
                        const score: number =
                            utteranceIntentPredictionScore.score;
                        let isInGroundTruthPositive: boolean =
                            false;
                        let utteranceGroundTruthLabelWeight: number =
                            1;
                        for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                            // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                            if (utteranceIntentPredictionScoreLabel === utteranceGroundTruthLabel.text) {
                                isInGroundTruthPositive = true;
                                utteranceGroundTruthLabelWeight = utteranceGroundTruthLabel.value;
                                break;
                            }
                        }
                        const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                            ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                utterance,
                                isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                                utteranceIntentPredictionScoreLabel,
                                score);
                        const perLabelScoreIntentUtterancePredictions: Array<[ScoreIntentUtterancePrediction, number]> =
                            labelScoreIntentUtterancePredictionsMap.get(utteranceIntentPredictionScoreLabel) as
                            Array<[ScoreIntentUtterancePrediction, number]>;
                        perLabelScoreIntentUtterancePredictions.push(
                            [scoreIntentUtterancePrediction, utteranceGroundTruthLabelWeight]);
                    }
                });
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: StructTextNumber) => {
                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceGroundTruthLabel.text)) {
                        let isInGroundTruthPositive: boolean =
                            false;
                        let utteranceGroundTruthLabelWeight: number =
                            1;
                        for (const utteranceIntentPredictionScore of utteranceIntentPredictionScores) {
                            // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                            if (utteranceGroundTruthLabel.text === utteranceIntentPredictionScore[0].intent) {
                                isInGroundTruthPositive = true;
                                utteranceGroundTruthLabelWeight = utteranceGroundTruthLabel.value;
                                break;
                            }
                        }
                        if (!isInGroundTruthPositive) {
                            const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                                ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel.text,
                                    0);
                            // tslint:disable-next-line: max-line-length
                            const perLabeScoreIntentUtterancePredictions: Array<[ScoreIntentUtterancePrediction, number]> =
                                // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                labelScoreIntentUtterancePredictionsMap.get(utteranceGroundTruthLabel.text) as
                                Array<[ScoreIntentUtterancePrediction, number]>;
                            perLabeScoreIntentUtterancePredictions.push(
                                [scoreIntentUtterancePrediction, utteranceGroundTruthLabelWeight]);
                        }
                    }
                });
            } else {
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: StructTextNumber) => {
                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                    if (labelScoreIntentUtterancePredictionsMap.has(utteranceGroundTruthLabel.text)) {
                        {
                            const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                                ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel.text,
                                    0);
                            // tslint:disable-next-line: max-line-length
                            const perLabelScoreIntentUtterancePredictions: Array<[ScoreIntentUtterancePrediction, number]> =
                                // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                labelScoreIntentUtterancePredictionsMap.get(utteranceGroundTruthLabel.text) as
                                Array<[ScoreIntentUtterancePrediction, number]>;
                            perLabelScoreIntentUtterancePredictions.push(
                                [scoreIntentUtterancePrediction, utteranceGroundTruthLabel.value]);
                        }
                    }
                });
            }
        });
        return labelScoreIntentUtterancePredictionsMap;
    }
    public static evaluateIntentUtterancePredictionScoresWithWeightLabelOriented(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceIntentLabelsMapGroundTruth: Map<string, StructTextNumber[]>,
        utteranceIntentLabelScoresMapPrediction: Map<string, ScoreIntent[][]>):
        Map<string, Array<[ScoreIntentUtterancePrediction, number]>> {
        const labeScoreIntentUtterancePredictionsMap: Map<string, Array<[ScoreIntentUtterancePrediction, number]>> =
            new Map<string, Array<[ScoreIntentUtterancePrediction, number]>>();
        labelArrayAndMap.stringArray.forEach((label: string, index: number) => {
            const perLabeScoreIntentUtterancePredictions: Array<[ScoreIntentUtterancePrediction, number]> =
                new Array<[ScoreIntentUtterancePrediction, number]>();
            labeScoreIntentUtterancePredictionsMap.set(label, perLabeScoreIntentUtterancePredictions);
            const utterances: string[] = [...utteranceIntentLabelsMapGroundTruth.keys()];
            utterances.map((utterance: string) => {
                const utteranceGroundTruthLabels: StructTextNumber[] =
                    utteranceIntentLabelsMapGroundTruth.get(utterance) as StructTextNumber[];
                let isInGroundTruthPositive: boolean =
                    false;
                let utteranceGroundTruthLabelWeight: number =
                    1;
                for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                    if (utteranceGroundTruthLabel.text === label) {
                        isInGroundTruthPositive = true;
                        utteranceGroundTruthLabelWeight = utteranceGroundTruthLabel.value;
                        break;
                    }
                }
                let labelScore: number = 0;
                if (utteranceIntentLabelScoresMapPrediction.has(utterance)) {
                    const utteranceIntentPredictionScores: ScoreIntent[][] =
                        utteranceIntentLabelScoresMapPrediction.get(utterance) as ScoreIntent[][];
                    // ---- NOTE-TODO ---- check array size
                    // ---- NOTE-PLACEHOLDER-USE-THE-FIRST-SCORE-FOR-NOW ----
                    for (const utteranceIntentPredictionScore of utteranceIntentPredictionScores) {
                        if (utteranceIntentPredictionScore[0].intent === label) {
                            labelScore = utteranceIntentPredictionScore[0].score;
                            break;
                        }
                    }
                }
                const scoreIntentUtterancePrediction: ScoreIntentUtterancePrediction =
                    ScoreIntentUtterancePrediction.newScoreIntentUtterancePrediction(
                        utterance,
                        isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                        label,
                        labelScore);
                perLabeScoreIntentUtterancePredictions.push(
                    [scoreIntentUtterancePrediction, utteranceGroundTruthLabelWeight]);
            });
        });
        return labeScoreIntentUtterancePredictionsMap;
    }

    public static evaluateEntityUtterancePredictionScoresWithWeight(
        labelArrayAndMap: ILabelArrayAndMap,
        utteranceEntityLabelsMapGroundTruth: Map<string, Array<[Label, number]>>,
        utteranceEntityLabelScoresMapPrediction: Map<string, ScoreEntity[][]>):
        Map<string, Array<[ScoreEntityUtterancePrediction, number]>> {
        const labelScoreEntityUtterancePredictionsMap: Map<string, Array<[ScoreEntityUtterancePrediction, number]>> =
            new Map<string, Array<[ScoreEntityUtterancePrediction, number]>>();
        labelArrayAndMap.stringArray.forEach((x: string) => {
            labelScoreEntityUtterancePredictionsMap.set(x, new Array<[ScoreEntityUtterancePrediction, number]>());
        });
        const utterances: string[] =
            [...utteranceEntityLabelsMapGroundTruth.keys()];
        utterances.forEach((utterance: string) => {
            const utteranceGroundTruthLabels: Array<[Label, number]> =
                utteranceEntityLabelsMapGroundTruth.get(utterance) as Array<[Label, number]>;
            // ---- NOTE-TODO ---- check array size
            if (utteranceEntityLabelScoresMapPrediction.has(utterance)) {
                const utteranceEntityPredictionScores: ScoreEntity[][] =
                    utteranceEntityLabelScoresMapPrediction.get(utterance) as ScoreEntity[][];
                // ---- NOTE-TODO ---- check array size
                // ---- NOTE-PLACEHOLDER-USE-THE-FIRST-SCORE-FOR-NOW ----
                utteranceEntityPredictionScores[0].forEach((utteranceEntityPredictionScore: ScoreEntity) => {
                    const utteranceEntityPredictionScoreLabel: Label =
                        utteranceEntityPredictionScore.entity;
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceEntityPredictionScoreLabel.name)) {
                        const score: number =
                            utteranceEntityPredictionScore.score;
                        let isInGroundTruthPositive: boolean =
                            false;
                        let utteranceGroundTruthLabelWeight: number =
                            1;
                        for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                            // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                            if (utteranceEntityPredictionScoreLabel.equals(utteranceGroundTruthLabel[0])) {
                                isInGroundTruthPositive = true;
                                utteranceGroundTruthLabelWeight = utteranceGroundTruthLabel[1];
                                break;
                            }
                        }
                        const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                            ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                utterance,
                                isInGroundTruthPositive ? PredictionType.Positive : PredictionType.Negative,
                                utteranceEntityPredictionScoreLabel.name,
                                score,
                                utteranceEntityPredictionScoreLabel.span.offset,
                                utteranceEntityPredictionScoreLabel.span.length);
                        const perLabeScoreEntityUtterancePredictions: Array<[ScoreEntityUtterancePrediction, number]> =
                            labelScoreEntityUtterancePredictionsMap.get(utteranceEntityPredictionScoreLabel.name) as
                            Array<[ScoreEntityUtterancePrediction, number]>;
                        perLabeScoreEntityUtterancePredictions.push(
                            [scoreEntityUtterancePrediction, utteranceGroundTruthLabelWeight]);
                    }
                });
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: [Label, number]) => {
                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceGroundTruthLabel[0].name)) {
                        let isInGroundTruthPositive: boolean =
                            false;
                        let utteranceGroundTruthLabelWeight: number =
                            1;
                        for (const utteranceEntityPredictionScore of utteranceEntityPredictionScores) {
                            // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                            if (utteranceGroundTruthLabel[0].equals(utteranceEntityPredictionScore[0].entity)) {
                                isInGroundTruthPositive = true;
                                utteranceGroundTruthLabelWeight = utteranceGroundTruthLabel[1];
                                break;
                            }
                        }
                        if (!isInGroundTruthPositive) {
                            const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                                ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].name,
                                    0,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].span.offset,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].span.length);
                            // tslint:disable-next-line: max-line-length
                            const perLabeScoreEntityUtterancePredictions: Array<[ScoreEntityUtterancePrediction, number]> =
                                // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                labelScoreEntityUtterancePredictionsMap.get(utteranceGroundTruthLabel[0].name) as
                                Array<[ScoreEntityUtterancePrediction, number]>;
                            perLabeScoreEntityUtterancePredictions.push(
                                [scoreEntityUtterancePrediction, utteranceGroundTruthLabelWeight]);
                        }
                    }
                });
            } else {
                utteranceGroundTruthLabels.forEach((utteranceGroundTruthLabel: [Label, number]) => {
                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                    if (labelScoreEntityUtterancePredictionsMap.has(utteranceGroundTruthLabel[0].name)) {
                        {
                            const scoreEntityUtterancePrediction: ScoreEntityUtterancePrediction =
                                ScoreEntityUtterancePrediction.newScoreEntityUtterancePrediction(
                                    utterance,
                                    PredictionType.Negative,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].name,
                                    0,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].span.offset,
                                    // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                    utteranceGroundTruthLabel[0].span.length);
                            // tslint:disable-next-line: max-line-length
                            const perLabeScoreEntityUtterancePredictions: Array<[ScoreEntityUtterancePrediction, number]> =
                                // ---- NOTE-PLACEHOLDER-tuple-first-entry-is-label ----
                                labelScoreEntityUtterancePredictionsMap.get(utteranceGroundTruthLabel[0].name) as
                                Array<[ScoreEntityUtterancePrediction, number]>;
                            perLabeScoreEntityUtterancePredictions.push(
                                [scoreEntityUtterancePrediction, utteranceGroundTruthLabel[1]]);
                        }
                    }
                });
            }
        });
        return labelScoreEntityUtterancePredictionsMap;
    }

    // -----------------------------------------------------------------------
    // Parse a JSON array and populate intent-weight and entity instance-weight repository
    // with dedupe logic.
    // -----------------------------------------------------------------------

    // eslint-disable-next-line max-params
    public static getJsonIntentsEntitiesUtterancesWithWeight(
        jsonObjectArray: any,
        hierarchicalLabel: string,
        utteranceIntentLabelsMap: Map<string, StructTextNumber[]>,
        utteranceIntentLabelDuplicateMap: Map<string, StructTextNumber[]>,
        utteranceEntityLabelsMap: Map<string, Array<[Label, number]>>,
        utteranceEntityLabelDuplicateMap: Map<string, Array<[Label, number]>>): boolean {
        try {
            if (jsonObjectArray.length > 0) {
                jsonObjectArray.forEach((jsonObject: any) => {
                    const utterance: string = jsonObject.text.trim();
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("intents")) {
                        const labels: string[] = jsonObject.intents;
                        labels.forEach((label: string) => {
                            LabelStructureUtility.addNewLabelUtteranceWithWeight(
                              utterance,
                              label,
                              hierarchicalLabel,
                              utteranceIntentLabelsMap,
                              utteranceIntentLabelDuplicateMap,
                              1);
                            });
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("entities")) {
                        const entities: any[] = jsonObject.entities;
                        entities.forEach((entityEntry: any) => {
                            LabelStructureUtility.addNewLabelEntityUtteranceWithWeight(
                              utterance,
                              entityEntry,
                              utteranceEntityLabelsMap,
                              utteranceEntityLabelDuplicateMap,
                              1);
                        });
                    }
                });
                return true;
            }
        } catch (error) {
            Utility.debuggingLogWithCause(
                "LabelStructureUtility.getJsonIntentsEntitiesUtterancesWithWeight()",
                error,
                true);
            return false;
        }
        return false;
    }
    public static getJsonIntentEntityScoresUtterancesWithWeight(
        jsonObjectArray: any,
        utteranceIntentLabelScoresMap: Map<string, ScoreIntent[][]>,
        utteranceEntityLabelScoresMap: Map<string, ScoreEntity[][]>): boolean {
        try {
            if (jsonObjectArray.length > 0) {
                jsonObjectArray.forEach((jsonObject: any) => {
                    const utterance: string = jsonObject.text.trim();
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("intent_scores")) {
                        const intentScores: any[] = jsonObject.intent_scores;
                        let existingScoreIntents: ScoreIntent[][] = [];
                        if (utteranceIntentLabelScoresMap.has(utterance)) {
                            existingScoreIntents = utteranceIntentLabelScoresMap.get(utterance) as ScoreIntent[][];
                        }
                        const scoreIntents: ScoreIntent[] = intentScores.map((intentScore: any) => {
                            const intent: string = intentScore.intent;
                            const score: number = intentScore.score;
                            return ScoreIntent.newScoreIntent(intent, score);
                        });
                        if (existingScoreIntents.length > 0) {
                            existingScoreIntents.push(scoreIntents);
                        } else {
                            existingScoreIntents = [scoreIntents];
                            utteranceIntentLabelScoresMap.set(utterance, existingScoreIntents);
                        }
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("entity_scores")) {
                        const entityScores: any[] = jsonObject.entity_scores;
                        let existingScoreEntities: ScoreEntity[][] = [];
                        if (utteranceEntityLabelScoresMap.has(utterance)) {
                            existingScoreEntities = utteranceEntityLabelScoresMap.get(utterance) as ScoreEntity[][];
                        }
                        const scoreEntities: ScoreEntity[] = entityScores.map((entityScore: any) => {
                            const entity: string = entityScore.entity;
                            const startPos: number = entityScore.startPos;
                            const endPos: number = entityScore.endPos;
                            const score: number = entityScore.score;
                            return ScoreEntity.newScoreEntityByPosition(entity, score, startPos, endPos);
                        });
                        if (existingScoreEntities.length > 0) {
                            existingScoreEntities.push(scoreEntities);
                        } else {
                            existingScoreEntities = [scoreEntities];
                            utteranceEntityLabelScoresMap.set(utterance, existingScoreEntities);
                        }
                    }
                });
                return true;
            }
        } catch (error) {
            Utility.debuggingLogWithCause(
                "LabelStructureUtility.getJsonIntentEntityScoresUtterancesWithWeight()",
                error,
                true);
            return false;
        }
        return false;
    }

    // -----------------------------------------------------------------------
    // Add a new label instance to an instance-weight respository with
    // dedup logic.
    // -----------------------------------------------------------------------

    public static addNewLabelUtteranceWithWeight(
        utterance: string,
        label: string,
        hierarchicalLabel: string,
        utteranceLabelsMap: Map<string, StructTextNumber[]>,
        utteranceLabelDuplicateMap: Map<string, StructTextNumber[]>,
        weight: number = 1): void {
        if (utteranceLabelsMap.has(utterance)) {
            const existingLabels: StructTextNumber[] =
                utteranceLabelsMap.get(utterance) as StructTextNumber[];
            if (!Utility.isEmptyString(hierarchicalLabel)) {
                if (!LabelStructureUtility.addUniqueLabelWithWeightToArray(
                    hierarchicalLabel,
                    existingLabels,
                    weight)) {
                    LabelStructureUtility.insertStringPairWithWeightToStringIdStringWeightCollectionNativeMap(
                        utterance,
                        hierarchicalLabel,
                        utteranceLabelDuplicateMap,
                        weight);
                }
            } else if (!LabelStructureUtility.addUniqueLabelWithWeightToArray(
                label,
                existingLabels,
                weight)) {
                LabelStructureUtility.insertStringPairWithWeightToStringIdStringWeightCollectionNativeMap(
                    utterance,
                    label,
                    utteranceLabelDuplicateMap,
                    weight);
            }
        } else if (!Utility.isEmptyString(hierarchicalLabel)) {
            const labelWeightCollection: StructTextNumber[] = [];
            labelWeightCollection.push(new StructTextNumber(hierarchicalLabel, weight));
            utteranceLabelsMap.set(utterance, labelWeightCollection);
        } else {
            const labelWeightCollection: StructTextNumber[] = [];
            labelWeightCollection.push(new StructTextNumber(label, weight));
            utteranceLabelsMap.set(utterance, labelWeightCollection);
        }
    }
    public static addNewLabelEntityUtteranceWithWeight(
        utterance: string,
        entityEntry: any,
        utteranceEntityLabelsMap: Map<string, Array<[Label, number]>>,
        utteranceEntityLabelDuplicateMap: Map<string, Array<[Label, number]>>,
        weight: number = 1): void {
        let existingEntityLabels: Array<[Label, number]> = new Array<[Label, number]>();
        if (utteranceEntityLabelsMap.has(utterance)) {
            existingEntityLabels = utteranceEntityLabelsMap.get(utterance) as Array<[Label, number]>;
        }
        const entityName: string = entityEntry.entity;
        const startPos: number = Number(entityEntry.startPos);
        const endPos: number = Number(entityEntry.endPos);
        // const entityMention: string = entityEntry.text;
        const entityLabel: Label = Label.newEntityLabelByPosition(entityName, startPos, endPos);
        if (existingEntityLabels.length > 0) {
            if (!LabelStructureUtility.addUniqueLabelObjectWithWeightToArray(
                entityLabel,
                existingEntityLabels,
                weight)) {
                LabelStructureUtility.insertStringLabelPairWithWeightToStringIdLabelWeightCollectionNativeMap(
                    utterance,
                    entityLabel,
                    utteranceEntityLabelDuplicateMap,
                    weight);
            }
        } else {
            existingEntityLabels =  new Array<[Label, number]>();
            existingEntityLabels.push([entityLabel, weight]);
            utteranceEntityLabelsMap.set(utterance, existingEntityLabels);
        }
    }

    // -----------------------------------------------------------------------
    // Add a new keyed instance to an instance-weight respository with
    // multiple labels.
    // -----------------------------------------------------------------------

    public static insertStringPairWithWeightToStringIdStringWeightCollectionNativeMap(
        key: string,
        value: string,
        stringKeyStringWeightCollectionMap: Map<string, StructTextNumber[]>,
        weight: number = 1): Map<string, StructTextNumber[]> {
        if (!stringKeyStringWeightCollectionMap) {
            stringKeyStringWeightCollectionMap = new Map<string, StructTextNumber[]>();
        }
        if (stringKeyStringWeightCollectionMap.has(key)) {
            let stringWeightCollection: StructTextNumber[] | undefined =
                stringKeyStringWeightCollectionMap.get(key);
            if (!stringWeightCollection) {
                stringWeightCollection = [];
                stringKeyStringWeightCollectionMap.set(key, stringWeightCollection);
            }
            LabelStructureUtility.addUniqueLabelWithWeightToArray(value, stringWeightCollection, weight);
        } else {
            const stringWeightCollection: StructTextNumber[] = [];
            stringKeyStringWeightCollectionMap.set(key, stringWeightCollection);
            stringWeightCollection.push(new StructTextNumber(value, weight));
        }
        return stringKeyStringWeightCollectionMap;
    }
    public static insertStringLabelPairWithWeightToStringIdLabelWeightCollectionNativeMap(
        key: string,
        value: Label,
        stringKeyLabelWeightCollectionMap: Map<string, Array<[Label, number]>>,
        weight: number = 1): Map<string, Array<[Label, number]>> {
        if (!stringKeyLabelWeightCollectionMap) {
            stringKeyLabelWeightCollectionMap = new Map<string, Array<[Label, number]>>();
        }
        if (stringKeyLabelWeightCollectionMap.has(key)) {
            let labelWeightCollection: Array<[Label, number]> | undefined = stringKeyLabelWeightCollectionMap.get(key);
            if (!labelWeightCollection) {
              labelWeightCollection = [];
              stringKeyLabelWeightCollectionMap.set(key, labelWeightCollection);
            }
            LabelStructureUtility.addUniqueLabelObjectWithWeightToArray(value, labelWeightCollection, weight);
        } else {
            const labelWeightCollection: Array<[Label, number]> = new Array<[Label, number]>();
            stringKeyLabelWeightCollectionMap.set(key, labelWeightCollection);
            labelWeightCollection.push([value, weight]);
        }
        return stringKeyLabelWeightCollectionMap;
    }

    // -----------------------------------------------------------------------
    // Identify and add a new label to a label-weight respository.
    // -----------------------------------------------------------------------

    public static addUniqueLabelWithWeightToArray(
        newLabel: string,
        labels: StructTextNumber[],
        weight: number = 1): boolean {
        try {
            for (const labelEntry of labels) {
                const label: string = labelEntry.text;
                if (label === newLabel) {
                    labelEntry.value += weight;
                    return false;
                }
            }
            labels.push(new StructTextNumber(newLabel, weight));
            return true;
        } catch (error) {
            Utility.debuggingThrowWithCause(
                `EXCEPTION calling addUniqueLabelToArray(), newLabel=${newLabel}, labels=${labels}`,
                error);
        }
        return false;
    }
    public static addUniqueLabelObjectWithWeightToArray(
        newLabel: Label,
        labels: Array<[Label, number]>,
        weight: number = 1): boolean {
        try {
            for (const labelEntry of labels) {
                const label: Label = labelEntry[0];
                if (label.equals(newLabel)) {
                    labelEntry[1] += weight;
                    return false;
                }
            }
            labels.push([newLabel, weight]);
            return true;
        } catch (error) {
            Utility.debuggingThrowWithCause(
                `EXCEPTION calling addUniqueEntityLabelToArray(), newLabel=${newLabel}, labels=${labels}`,
                error);
        }
        return false;
    }
}
