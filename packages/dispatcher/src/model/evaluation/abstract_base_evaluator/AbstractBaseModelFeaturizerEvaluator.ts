/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "../../supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { NgramSubwordFeaturizer } from "../../language_understanding/featurizer/NgramSubwordFeaturizer";

import { AbstractBaseEvaluator } from "./AbstractBaseEvaluator";

import { DictionaryMapUtility } from "../../../data_structure/DictionaryMapUtility";

import { Utility } from "../../../utility/Utility";

export abstract class AbstractBaseModelFeaturizerEvaluator extends AbstractBaseEvaluator {

    protected modelFilename: string = "";
    protected featurizerFilename: string = "";

    protected modelNullable: SoftmaxRegressionSparse|null = null;
    protected featurizerNullable: NgramSubwordFeaturizer|null = null;

    protected labels: string[] = [];
    protected labelMap: Map<string, number> = new  Map<string, number>();

    constructor(
        modelFilename: string,
        featurizerFilename: string,
        modelNullable: SoftmaxRegressionSparse|null,
        featurizerNullable: NgramSubwordFeaturizer|null,
        labels: string[],
        labelMap: Map<string, number>) {
        super();
        if (!Utility.isEmptyString(modelFilename)) {
            this.modelNullable = this.deserializeModel(modelFilename);
            this.modelFilename = modelFilename;
        }
        if (!Utility.isEmptyString(featurizerFilename)) {
            this.featurizerNullable = this.deserializeFeaturizer(featurizerFilename);
            this.featurizerFilename = featurizerFilename;
        }
        if (this.modelNullable === null) {
            this.modelNullable = modelNullable;
        }
        if (this.featurizerNullable === null) {
            this.featurizerNullable = featurizerNullable;
        }
        if (this.featurizerNullable !== null) {
            this.labels = this.getFeaturizer().getLabels();
        }
        if (this.featurizerNullable !== null) {
            this.labelMap = this.getFeaturizer().getLabelMap();
        }
        if (Utility.isEmptyStringArray(this.labels)) {
            this.labels = labels;
        }
        if (DictionaryMapUtility.isEmptyStringKeyGenericValueMap(this.labelMap)) {
            this.labelMap = labelMap;
        }
        if ((!Utility.isEmptyStringArray(this.labels)) && (this.labelMap !== null)) {
            DictionaryMapUtility.validateStringArrayAndStringKeyNumberValueMap(this.labels, this.labelMap);
        }
    }

    public getModelFilename(): string {
        return this.modelFilename;
    }
    public getFeaturizerFilename(): string {
        return this.featurizerFilename;
    }

    public getModelNullable(): SoftmaxRegressionSparse|null {
        return this.modelNullable;
    }
    public getFeaturizerNullable(): NgramSubwordFeaturizer|null {
        return this.featurizerNullable;
    }

    public getModel(): SoftmaxRegressionSparse {
        const modelNullable: SoftmaxRegressionSparse|null =
            this.getModelNullable();
        if (modelNullable === null) {
            Utility.debuggingThrow("modelNullable is null");
        }
        return modelNullable as SoftmaxRegressionSparse;
    }
    public getFeaturizer(): NgramSubwordFeaturizer {
        const featurizerNullable: NgramSubwordFeaturizer|null =
            this.getFeaturizerNullable();
        if (featurizerNullable === null) {
            Utility.debuggingThrow("featurizerNullable is null");
        }
        return featurizerNullable as NgramSubwordFeaturizer;
    }

    public getLabels(): string[] {
        if (Utility.isEmptyStringArray(this.labels)) {
            Utility.debuggingThrow("this.labels is empty");
        }
        return this.labels;
    }
    public getLabelMap(): Map<string, number> {
        if (DictionaryMapUtility.isEmptyStringKeyGenericValueMap(this.labelMap)) {
            Utility.debuggingThrow("this.labelMap is empty");
        }
        return this.labelMap;
    }

    public getNumberLabels(): number {
        return this.getLabels().length;
    }

    public deserializeModel(
        modelFilename: string): SoftmaxRegressionSparse {
        if (Utility.isEmptyString(modelFilename)) {
            Utility.debuggingThrow(
                `modelFilename is empty`);
        }
        const modelFileDeserializedJsonString: string = Utility.loadFile(
            modelFilename);
        const model: SoftmaxRegressionSparse =
            new SoftmaxRegressionSparse();
        model.deserializeFromJsonString(modelFileDeserializedJsonString);
        return model;
    }

    public deserializeFeaturizer(
        featurizerFilename: string): NgramSubwordFeaturizer {
        if (Utility.isEmptyString(featurizerFilename)) {
            Utility.debuggingThrow(
                `featurizerFilename is empty`);
        }
        const featurizerFileDeserializedJsonString: string = Utility.loadFile(
            featurizerFilename);
        const featurizer: NgramSubwordFeaturizer =
            new NgramSubwordFeaturizer();
        featurizer.deserializeFromJsonString(featurizerFileDeserializedJsonString);
        return featurizer;
    }
}
