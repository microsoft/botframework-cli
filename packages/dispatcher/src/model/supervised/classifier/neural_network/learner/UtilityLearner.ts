/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "./SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { IMathematicsHelper } from "../../../../../mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "../../../../../mathematics/mathematics_helper/MathematicsHelper";

import { Utility } from "../../../../../Utility/Utility";

export class LearnerUtility {

    public static readonly MathematicsHelperObject: IMathematicsHelper =
        MathematicsHelper.GetMathematicsHelperObject();

    public static exampleFunctionPredictAndEvaluateTestDataset(
        featurizer: NgramSubwordFeaturizer,
        model: SoftmaxRegressionSparse,
        testDatasetFilename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        lineIndexToStart: number) {
        // -------------------------------------------------------------------
        const labels: string[] =
            featurizer.getLabels();
        // -------------------------------------------------------------------
        const intentsUtterancesWeightsDev: { "intents": string[], "texts": string[], "weights": number[] } =
            LearnerUtility.exampleFunctionLoadTestDataset(
                testDatasetFilename,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart);
        const intents: string[] =
            intentsUtterancesWeightsDev.intents;
        const texts: string[] =
            intentsUtterancesWeightsDev.texts;
        // const weights: string[] =
        //     intentsUtterancesWeightsDev.weights;
        const numberIntentUtterancesDev: number =
            intents.length;
        let countPredictionsCorrect = 0;
        for (let i: number = 0; i < numberIntentUtterancesDev; i++) {
            const intent: string =
                intents[i];
            const text: string =
                texts[i];
            const textFeatureIndexArray: string[] =
                new Array<string>(1);
            textFeatureIndexArray[0] = text;
            const textFeatures: number[][] =
                featurizer.createFeatureSparseIndexArrays(
                    textFeatureIndexArray);
            const predictions: number[][] =
                model.predict(textFeatures);
            const predictionsDataArray: number[][] =
                predictions;
            const predictionLabelIndexMax: { "indexMax": number, "max": number } =
                LearnerUtility.MathematicsHelperObject.getIndexOnFirstMaxEntry(predictionsDataArray[0]);
            const predictionLabelIndex: number =
                predictionLabelIndexMax.indexMax;
            const predictionLabel: string =
                labels[predictionLabelIndex];
            // Utility.debuggingLog(
            //     "" + i + "th entry: "
            //     + "labelled-intent=" + intent
            //     + ", predicted-label=" + predictionLabel
            //     + ", predicted-label-index=" + predictionLabelIndex
            //     + ", predictionLabelIndexMax=" + predictionLabelIndexMax
            //     + ", predictions=" + predictions);
            if (predictionLabel === intent) {
                countPredictionsCorrect++;
            }
        }
        const accuracy: number =
            countPredictionsCorrect / numberIntentUtterancesDev;
        Utility.debuggingLog(
            "countPredictionsCorrect=" + countPredictionsCorrect
            + ", numberIntentUtterancesDev=" + numberIntentUtterancesDev
            + ", accuracy=" + accuracy);
        // -------------------------------------------------------------------
    }

    public static exampleFunctionPredictAndEvaluateTestDatasetHashing(
        featurizer: NgramSubwordFeaturizer,
        model: SoftmaxRegressionSparse,
        testDatasetFilename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        lineIndexToStart: number) {
        // -------------------------------------------------------------------
        const labels: string[] =
            featurizer.getLabels();
        // -------------------------------------------------------------------
        const intentsUtterancesWeightsDev: { "intents": string[], "texts": string[], "weights": number[] } =
            LearnerUtility.exampleFunctionLoadTestDataset(
                testDatasetFilename,
                labelColumnIndex,
                textColumnIndex,
                weightColumnIndex,
                lineIndexToStart);
        const intents: string[] =
            intentsUtterancesWeightsDev.intents;
        const texts: string[] =
            intentsUtterancesWeightsDev.texts;
        const weights: number[] =
            intentsUtterancesWeightsDev.weights;
        const numberIntentUtterancesDev: number =
            intents.length;
        let countPredictionsCorrect = 0;
        for (let i: number = 0; i < numberIntentUtterancesDev; i++) {
            const intent: string =
                intents[i];
            const text: string =
                texts[i];
            const textFeatureIndexArray: string[] =
                new Array<string>(1);
            textFeatureIndexArray[0] = text;
            const textFeatures: number[][] =
                featurizer.createFeatureHashingSparseIndexArrays(
                    textFeatureIndexArray);
            const predictions: number[][] =
                model.predict(textFeatures);
            const predictionsDataArray: number[][] =
                predictions;
            const predictionLabelIndexMax: { "indexMax": number, "max": number } =
                LearnerUtility.MathematicsHelperObject.getIndexOnFirstMaxEntry(predictionsDataArray[0]);
            const predictionLabelIndex: number =
                predictionLabelIndexMax.indexMax;
            const predictionLabel: string =
                labels[predictionLabelIndex];
            // Utility.debuggingLog(
            //     "" + i + "th entry: "
            //     + "labelled-intent=" + intent
            //     + ", predicted-label=" + predictionLabel
            //     + ", predicted-label-index=" + predictionLabelIndex
            //     + ", predictionLabelIndexMax=" + predictionLabelIndexMax
            //     + ", predictions=" + predictions);
            if (predictionLabel === intent) {
                countPredictionsCorrect++;
            }
        }
        const accuracy: number =
            countPredictionsCorrect / numberIntentUtterancesDev;
        Utility.debuggingLog(
            "countPredictionsCorrect=" + countPredictionsCorrect
            + ", numberIntentUtterancesDev=" + numberIntentUtterancesDev
            + ", accuracy=" + accuracy);
        // -------------------------------------------------------------------
    }

    public static exampleFunctionLoadFeaturizeTrainDataset(
        numberHashingFeaturesSetting: number = 0,
        filename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        lineIndexToStart: number,
        subwordNgramBegin: number = 3,
        subwordNgramEnd: number = 4,
        toLowercase: boolean = true,
        toRemovePunctuations: boolean = false,
        toRemoveEmptyElements: boolean = true,
        splitDelimiter: string = " ") {
        if (!Utility.exists(filename)) {
            Utility.debuggingThrow(
                `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
        }
        const intentsUtterancesWeights: { "intents": string[], "utterances": string[], "weights": number[] } =
        Utility.loadLabelUtteranceColumnarFile(
            filename, // ---- filename: string,
            labelColumnIndex, // ---- labelColumnIndex: number = 0,
            textColumnIndex,  // ---- textColumnIndex: number = 1,
            weightColumnIndex, // ---- weightColumnIndex: number = -1,
            lineIndexToStart, // ---- lineIndexToStart: number = 0,
            "\t",     // ---- columnDelimiter: string = "\t",
            "\n",     // ---- rowDelimiter: string = "\n",
            "utf8",   // ---- encoding: string = "utf8",
            -1,       // ---- lineIndexToEnd: number = -1
        );
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
            subwordNgramBegin,
            subwordNgramEnd,
            toLowercase,
            toRemovePunctuations,
            toRemoveEmptyElements,
            splitDelimiter,
            numberHashingFeaturesSetting);
        featurizer.resetLabelFeatureMaps(intentsUtterancesWeights);
        return featurizer;
    }

    public static exampleFunctionLoadTestDataset(
        filename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        weightColumnIndex: number,
        lineIndexToStart: number):
        { "intents": string[], "texts": string[], "weights": number[] } {
        if (!Utility.exists(filename)) {
            Utility.debuggingThrow(
                `The input dataset file ${filename} does not exist! process.cwd()=${process.cwd()}`);
        }
        const intentsUtterancesWeights: { "intents": string[], "texts": string[], "weights": number[] } =
        Utility.loadLabelTextColumnarFile(
            filename, // ---- filename: string,
            labelColumnIndex, // ---- labelColumnIndex: number = 0,
            textColumnIndex,  // ---- textColumnIndex: number = 1,
            weightColumnIndex, // ---- weightColumnIndex: number = -1,
            lineIndexToStart, // ---- lineIndexToStart: number = 0,
            "\t",     // ---- columnDelimiter: string = "\t",
            "\n",     // ---- rowDelimiter: string = "\n",
            "utf8",   // ---- encoding: string = "utf8",
            -1,       // ---- lineIndexToEnd: number = -1
        );
        return intentsUtterancesWeights;
    }
}
