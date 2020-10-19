/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { BinaryConfusionMatrix } from "../mathematics/confusion_matrix/BinaryConfusionMatrix";

import { Label } from "./Label";
import { LabelType } from "./LabelType";
import { Result } from "./Result";
import { ScoreEntity } from "./ScoreEntity";
import { ScoreIntent } from "./ScoreIntent";
import { ScoreEntityUtterancePrediction } from "./ScoreEntityUtterancePrediction";
import { ScoreIntentUtterancePrediction } from "./ScoreIntentUtterancePrediction";
import { Span } from "./Span";

import { Utility } from "../Utility/Utility";
import { PredictionType } from "./PredictionType";

export class LabelStructureUtility {
    public static evaluateIntentUtterancePredictionScoresToBinaryConfusionMatrices(
        labelArrayAndMap: {
            "stringArray": string[],
            "stringMap": Map<string, number> },
        utteranceLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceLabelScoresMapPrediction: Map<string, ScoreIntent[]>,
        length: number):
        Map<string, Array<{
            "score": number,
            "index": number,
            "binaryConfusionMatrix": BinaryConfusionMatrix }>> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            LabelStructureUtility.evaluateIntentUtterancePredictionScores(
                labelArrayAndMap,
                utteranceLabelsMapGroundTruth,
                utteranceLabelScoresMapPrediction);
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
        labelArrayAndMap: {
            "stringArray": string[],
            "stringMap": Map<string, number> },
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
        labelArrayAndMap: {
            "stringArray": string[],
            "stringMap": Map<string, number> },
        utteranceLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceLabelScoresMapPrediction: Map<string, ScoreIntent[]>):
        Map<string, ScoreIntentUtterancePrediction[]> {
        const labelScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            new Map<string, ScoreIntentUtterancePrediction[]>();
        labelArrayAndMap.stringArray.forEach((x: string) => {
            labelScoreIntentUtterancePredictionsMap.set(x, []);
        });
        const utterances: string[] =
            [...utteranceLabelsMapGroundTruth.keys()];
        utterances.forEach((utterance: string) => {
            const utteranceGroundTruthLabels: Set<string> =
                utteranceLabelsMapGroundTruth.get(utterance) as Set<string>;
            if (utteranceLabelScoresMapPrediction.has(utterance)) {
                const utteranceIntentPredictionScores: ScoreIntent[] =
                    utteranceLabelScoresMapPrediction.get(utterance) as ScoreIntent[];
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
        labelArrayAndMap: {
            "stringArray": string[],
            "stringMap": Map<string, number> },
        utteranceLabelsMapGroundTruth: Map<string, Set<string>>,
        utteranceLabelScoresMapPrediction: Map<string, ScoreIntent[]>):
        Map<string, ScoreIntentUtterancePrediction[]> {
        const labeScoreIntentUtterancePredictionsMap: Map<string, ScoreIntentUtterancePrediction[]> =
            new Map<string, ScoreIntentUtterancePrediction[]>();
        labelArrayAndMap.stringArray.forEach((label: string, index: number) => {
            const perLabeScoreIntentUtterancePredictions: ScoreIntentUtterancePrediction[] = [];
            labeScoreIntentUtterancePredictionsMap.set(label, perLabeScoreIntentUtterancePredictions);
            const utterances: string[] = [...utteranceLabelsMapGroundTruth.keys()];
            utterances.map((utterance: string) => {
                const utteranceGroundTruthLabels: Set<string> =
                    utteranceLabelsMapGroundTruth.get(utterance) as Set<string>;
                let isInGroundTruthPositive: boolean = false;
                for (const utteranceGroundTruthLabel of utteranceGroundTruthLabels) {
                    if (utteranceGroundTruthLabel === label) {
                        isInGroundTruthPositive = true;
                        break;
                    }
                }
                let labelScore: number = 0;
                if (utteranceLabelScoresMapPrediction.has(utterance)) {
                    const utteranceIntentPredictionScores: ScoreIntent[] =
                        utteranceLabelScoresMapPrediction.get(utterance) as ScoreIntent[];
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
        labelArrayAndMap: {
            "stringArray": string[],
            "stringMap": Map<string, number> },
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

    // eslint-disable-next-line max-params
    public static getJsonIntentsEntitiesUtterances(
        jsonObjectArray: any,
        hierarchicalLabel: string,
        utteranceLabelsMap: Map<string, Set<string>>,
        utteranceLabelDuplicateMap: Map<string, Set<string>>,
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
                              utteranceLabelsMap,
                              utteranceLabelDuplicateMap);
                            });
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("entities")) {
                        const entities: any[] = jsonObject.entities;
                        entities.forEach((entityEntry: any) => {
                            LabelStructureUtility.addNewEntityLabelUtterance(
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
            return false;
        }
        return false;
    }
    public static getJsonIntentEntityScoresUtterances(
        jsonObjectArray: any,
        utteranceLabelScoresMap: Map<string, ScoreIntent[]>,
        utteranceEntityLabelScoresMap: Map<string, ScoreEntity[]>): boolean {
        try {
            if (jsonObjectArray.length > 0) {
                jsonObjectArray.forEach((jsonObject: any) => {
                    const utterance: string = jsonObject.text.trim();
                    // eslint-disable-next-line no-prototype-builtins
                    if (jsonObject.hasOwnProperty("intent_scores")) {
                        const intentScores: any[] = jsonObject.intent_scores;
                        utteranceLabelScoresMap.set(utterance, intentScores.map((intentScore: any) => {
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
            return false;
        }
        return false;
    }

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
            LabelStructureUtility.addUniqueEntityLabelToArray(value, labelSet);
        } else {
            const labelSet: Label[] = [];
            stringKeyLabelSetMap.set(key, labelSet);
            labelSet.push(value);
        }
        return stringKeyLabelSetMap;
    }

    public static addNewLabelUtterance(
        utterance: string,
        label: string,
        hierarchicalLabel: string,
        utteranceLabelsMap: Map<string, Set<string>>,
        utteranceLabelDuplicateMap: Map<string, Set<string>>): void {
        if (utteranceLabelsMap.has(utterance)) {
            const existingLabels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
            if (hierarchicalLabel && hierarchicalLabel.length > 0) {
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
        } else if (hierarchicalLabel && hierarchicalLabel.length > 0) {
            const labelSet: Set<string> = new Set<string>();
            labelSet.add(hierarchicalLabel);
            utteranceLabelsMap.set(utterance, labelSet);
        } else {
            const labelSet: Set<string> = new Set<string>();
            labelSet.add(label);
            utteranceLabelsMap.set(utterance, labelSet);
        }
    }

    public static addNewEntityLabelUtterance(
        utterance: string,
        entityEntry: any,
        utteranceEntityLabelsMap: Map<string, Label[]>,
        utteranceEntityLabelDuplicateMap: Map<string, Label[]>): void {
        let existingEntityLabels: Label[] = [];
        if (utteranceEntityLabelsMap.has(utterance)) {
            existingEntityLabels = utteranceEntityLabelsMap.get(utterance) as Label[];
        }
        const entity: string = entityEntry.entity;
        const startPos: number = Number(entityEntry.startPos);
        const endPos: number = Number(entityEntry.endPos);
        // const entityMention: string = entityEntry.text;
        const entityLabel: Label = new Label(LabelType.Entity, entity, new Span(startPos, endPos - startPos + 1));
        if (existingEntityLabels) {
            if (!LabelStructureUtility.addUniqueEntityLabelToArray(entityLabel, existingEntityLabels)) {
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

    public static addUniqueLabel(newLabel: string, labels: Set<string>): boolean {
        try {
            if (labels.has(newLabel)) {
                return false;
            }
            labels.add(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingLog(`EXCEPTION calling addUniqueLabel(), error='${error}', newLabel='${newLabel}', labels='${labels}'`);
            throw error;
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
            labels.push(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingLog(`EXCEPTION calling addUniqueLabelToArray(), error='${error}', newLabel=${newLabel}, labels=${labels}`);
            throw error;
        }
        return false;
    }

    public static addUniqueEntityLabelToArray(newLabel: Label, labels: Label[]): boolean {
        try {
            for (const label of labels) {
                if (label.equals(newLabel)) {
                    return false;
                }
            }
            labels.push(newLabel);
            return true;
        } catch (error) {
            Utility.debuggingLog(`EXCEPTION calling addUniqueEntityLabelToArray(), error='${error}', newLabel=${newLabel}, labels=${labels}`);
            throw error;
        }
        return false;
    }
}
