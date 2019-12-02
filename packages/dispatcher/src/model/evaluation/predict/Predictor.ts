/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";
import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

export class Predictor {

    protected modelFilename: string = "";
    protected featurizerFilename: string = "";

    protected model: SoftmaxRegressionSparse;
    protected featurizer: NgramSubwordFeaturizer;

    constructor(
        modelFilename: string,
        featurizerFilename: string) {
        this.modelFilename =
            modelFilename;
        this.featurizerFilename =
            featurizerFilename;
        const deserializedModelFeaturizer: {
            "model": SoftmaxRegressionSparse,
            "featurizer": NgramSubwordFeaturizer,
        } = this.deserializeModelFeaturizer(
            modelFilename,
            featurizerFilename);
        this.model = deserializedModelFeaturizer.model;
        this.featurizer = deserializedModelFeaturizer.featurizer;
    }

    public getModelFilename(): string {
        return this.modelFilename;
    }
    public getFeaturizerFilename(): string {
        return this.featurizerFilename;
    }

    public getModel(): SoftmaxRegressionSparse {
        return this.model;
    }
    public getFeaturizer(): NgramSubwordFeaturizer {
        return this.featurizer;
    }

    public deserializeModelFeaturizer(
        modelFilename: string,
        featurizerFilename: string): {
            "model": SoftmaxRegressionSparse,
            "featurizer": NgramSubwordFeaturizer,
        } {
        if (Utility.isEmptyString(modelFilename)) {
            Utility.debuggingThrow(
                `modelFilename is empty`);
        }
        if (Utility.isEmptyString(featurizerFilename)) {
            Utility.debuggingThrow(
                `featurizerFilename is empty`);
        }
        const modelFileDeserializedJsonString: string = Utility.loadFile(
            modelFilename);
        const model: SoftmaxRegressionSparse =
            new SoftmaxRegressionSparse();
        model.deserializeFromJsonString(modelFileDeserializedJsonString);
        const featurizerFileDeserializedJsonString: string = Utility.loadFile(
            featurizerFilename);
        const featurizer: NgramSubwordFeaturizer =
            new NgramSubwordFeaturizer();
        featurizer.deserializeFromJsonString(featurizerFileDeserializedJsonString);
        return { model, featurizer };
    }

    public predict(
        utterance: string,
        intent: string,
        confusionMatrixPredict: ConfusionMatrix): {
            "confusionMatrixPredict": ConfusionMatrix
            "predictionLabel": string,
            "predictionLabelIndex": number,
            "label": string,
            "labelIndex": number,
            "prediction": number[] } {
        // -------------------------------------------------------------------
        const model: SoftmaxRegressionSparse =
            this.getModel();
        const featurizer: NgramSubwordFeaturizer =
            this.getFeaturizer();
        // -------------------------------------------------------------------
        const labels: string[] = featurizer.getLabels();
        const labelMap: { [id: string]: number; } = featurizer.getLabelMap();
        // const numberLabels: number = featurizer.getNumberLabels();
        // const numberFeatures: number = featurizer.getNumberFeatures();
        // -------------------------------------------------------------------
        const featureIndexArray: number[] =
            featurizer.createFeatureSparseIndexArray(utterance);
        if (Utility.isEmptyNumberArray(featureIndexArray)) {
            Utility.debuggingThrow(
                `ffeatureIndexArray is empty`);
        }
        const predictions: number[][] =
            model.predict([featureIndexArray]);
        {
            // ---------------------------------------------------------------
            const prediction: number[] = predictions[0];
            // ---------------------------------------------------------------
            const argMax: { "indexMax": number, "max": number } =
                MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
            const predictionLabelIndex: number =
                argMax.indexMax;
            let labelIndex: number = labelMap[intent];
            if (!Utility.isEmptyString(intent)) {
                if (!labelIndex) {
                    labelIndex = -1;
                }
                if (labelIndex >= 0) {
                    confusionMatrixPredict.addInstanceByLabelIndex(
                        labelIndex,
                        predictionLabelIndex);
                }
            }
            const predictionLabel: string = labels[predictionLabelIndex];
            const label: string = labels[labelIndex];
            // ---------------------------------------------------------------
            return { confusionMatrixPredict, predictionLabel, predictionLabelIndex, label, labelIndex, prediction };
            // ---------------------------------------------------------------
        }
    }
}
