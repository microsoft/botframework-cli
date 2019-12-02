/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppSoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { MathematicsHelper } from "../../../mathematics/mathematics_helper/MathematicsHelper";

import { ConfusionMatrix } from "../confusion_matrix/ConfusionMatrix";

// import { ColumnarData } from "../../../data/ColumnarData";
// import { LuData } from "../../../data/LuData";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { Utility } from "../../../utility/Utility";

export class Tester {

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

    public test(
        intents: string[],
        utterances: string[],
        labelIndexArray: number[],
        featureIndexArrays: number[][],
        // labelInstanceIndexMapArray: Map<string, number[]>
        ):
        ConfusionMatrix {
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
        Utility.debuggingLog(`labelIndexArray.length=` +
            `${labelIndexArray.length}`);
        Utility.debuggingLog(`featureIndexArrays.length=` +
            `${featureIndexArrays.length}`);
        // Utility.debuggingLog(`labelInstanceIndexMapArray.size=` +
        //     `${labelInstanceIndexMapArray.size}`);
        // -------------------------------------------------------------------
        const confusionMatrixTest =
            new ConfusionMatrix(labels, labelMap);
        const numberInstances: number =
            intents.length;
        if (utterances.length !== numberInstances) {
            Utility.debuggingThrow(
                `utterances.length|${utterances.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        if (labelIndexArray.length !== numberInstances) {
            Utility.debuggingThrow(
                `labelIndexArray.length|${labelIndexArray.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        if (featureIndexArrays.length !== numberInstances) {
            Utility.debuggingThrow(
                `featureIndexArrays.length|${featureIndexArrays.length}|!==` +
                `numberInstances|${numberInstances}|`);
        }
        const predictions: number[][] =
            model.predict(featureIndexArrays);
        for (let index: number = 0; index < numberInstances; index++) {
            // ---------------------------------------------------------------
            // const intent: string = intents[index];
            // const utterance: string = utterances[index];
            const labelIndex: number = labelIndexArray[index];
            // const featureIndexArray: number[] = featureIndexArrays[index];
            const prediction: number[] = predictions[index];
            // ---------------------------------------------------------------
            const argMax: { "indexMax": number, "max": number } =
                MathematicsHelper.getIndexOnFirstMaxEntry(prediction);
            const predictionLabelId: number =
                argMax.indexMax;
            confusionMatrixTest.addInstanceByLabelIndex(
                labelIndex,
                predictionLabelId);
            // ---------------------------------------------------------------
        }
        // -------------------------------------------------------------------
        return confusionMatrixTest;
        // -------------------------------------------------------------------
    }
}
