/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ColumnarData } from "./data/ColumnarData";
import { Data } from "./data/Data";
import { DataUtility } from "./data/DataUtility";
import { EntityAnnotatedCorpusData } from "./data/EntityAnnotatedCorpusData";
import { LuData } from "./data/LuData";

import { DictionaryMapUtility } from "./data_structure/DictionaryMapUtility";
import { IDictionaryNumberIdGenericArray } from "./data_structure/IDictionaryNumberIdGenericArray";
import { IDictionaryNumberIdGenericArrays } from "./data_structure/IDictionaryNumberIdGenericArrays";
import { IDictionaryNumberIdGenericSet } from "./data_structure/IDictionaryNumberIdGenericSet";
import { IDictionaryNumberIdGenericValue } from "./data_structure/IDictionaryNumberIdGenericValue";
import { IDictionaryStringIdGenericArray } from "./data_structure/IDictionaryStringIdGenericArray";
import { IDictionaryStringIdGenericArrays } from "./data_structure/IDictionaryStringIdGenericArrays";
import { IDictionaryStringIdGenericSet } from "./data_structure/IDictionaryStringIdGenericSet";
import { IDictionaryStringIdGenericValue } from "./data_structure/IDictionaryStringIdGenericValue";
import { TMapGenericKeyGenericArray } from "./data_structure/TMapGenericKeyGenericArray";
import { TMapGenericKeyGenericArrays } from "./data_structure/TMapGenericKeyGenericArrays";
import { TMapGenericKeyGenericSet } from "./data_structure/TMapGenericKeyGenericSet";
import { TMapGenericKeyGenericValue } from "./data_structure/TMapGenericKeyGenericValue";
import { TMapNumberKeyGenericArray } from "./data_structure/TMapNumberKeyGenericArray";
import { TMapNumberKeyGenericArrays } from "./data_structure/TMapNumberKeyGenericArrays";
import { TMapNumberKeyGenericSet } from "./data_structure/TMapNumberKeyGenericSet";
import { TMapNumberKeyGenericValue } from "./data_structure/TMapNumberKeyGenericValue";
import { TMapStringKeyGenericArray } from "./data_structure/TMapStringKeyGenericArray";
import { TMapStringKeyGenericArrays } from "./data_structure/TMapStringKeyGenericArrays";
import { TMapStringKeyGenericSet } from "./data_structure/TMapStringKeyGenericSet";
import { TMapStringKeyGenericValue } from "./data_structure/TMapStringKeyGenericValue";

import { mainConfusionMatrix } from "./mathematics/confusion_matrix/AppConfusionMatrix";
import { mainConfusionMatrixFunction } from "./mathematics/confusion_matrix/AppConfusionMatrix";
import { BinaryConfusionMatrix } from "./mathematics/confusion_matrix/BinaryConfusionMatrix";
import { ConfusionMatrix } from "./mathematics/confusion_matrix/ConfusionMatrix";
import { ConfusionMatrixBase } from "./mathematics/confusion_matrix/ConfusionMatrixBase";
import { IConfusionMatrix } from "./mathematics/confusion_matrix/IConfusionMatrix";
import { IMultiLabelConfusionMatrix } from "./mathematics/confusion_matrix/IMultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrix } from "./mathematics/confusion_matrix/MultiLabelConfusionMatrix";
import { MultiLabelConfusionMatrixBase } from "./mathematics/confusion_matrix/MultiLabelConfusionMatrixBase";
import { MultiLabelConfusionMatrixSubset } from "./mathematics/confusion_matrix/MultiLabelConfusionMatrixSubset";
import { MultiLabelConfusionMatrixWithBinaryArrayBase } from "./mathematics/confusion_matrix/MultiLabelConfusionMatrixWithBinaryArrayBase";
import { MultiLabelConfusionMatrixWithBinaryBase } from "./mathematics/confusion_matrix/MultiLabelConfusionMatrixWithBinaryBase";

import { IMathematicsHelper } from "./mathematics/mathematics_helper/IMathematicsHelper";
import { MathematicsHelper } from "./mathematics/mathematics_helper/MathematicsHelper";

import { AbstractBaseBootstrapSampler } from "./mathematics/sampler/AbstractBaseBootstrapSampler";
import { AbstractBaseReservoirSampler } from "./mathematics/sampler/AbstractBaseReservoirSampler";
import { AbstractBaseSampler } from "./mathematics/sampler/AbstractBaseSampler";
import { BootstrapSampler } from "./mathematics/sampler/BootstrapSampler";
import { BootstrapSamplerDistribution } from "./mathematics/sampler/BootstrapSamplerDistribution";
import { BootstrapSamplerKeyMap } from "./mathematics/sampler/BootstrapSamplerKeyMap";
import { BootstrapSamplerKeyMapDistribution } from "./mathematics/sampler/BootstrapSamplerKeyMapDistribution";
import { ReservoirArraySampler } from "./mathematics/sampler/ReservoirArraySampler";
import { ReservoirSampler } from "./mathematics/sampler/ReservoirSampler";
import { ReservoirSamplerKeyMap } from "./mathematics/sampler/ReservoirSamplerKeyMap";

import { mainCrossValidatorWithColumnarContent } from "./model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidatorWithLuContent } from "./model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidator } from "./model/evaluation/cross_validation/AppCrossValidator";
import { CrossValidator } from "./model/evaluation/cross_validation/CrossValidator";

import { mainPredictor } from "./model/evaluation/predict/AppPredictor";
import { Predictor } from "./model/evaluation/predict/Predictor";

import { mainDataProfileReporter } from "./model/evaluation/report/AppDataProfileReporter";
import { DataProfileReporter } from "./model/evaluation/report/DataProfileReporter";
import { mainModelMetaDataProfileReporter } from "./model/evaluation/report/AppModelMetaDataProfileReporter";
import { ModelMetaDataProfileReporter } from "./model/evaluation/report/ModelMetaDataProfileReporter";
import { mainThresholdReporter } from "./model/evaluation/report/AppThresholdReporter";
import { ThresholdReporter } from "./model/evaluation/report/ThresholdReporter";

import { mainTester } from "./model/evaluation/test/AppTester";
import { Tester } from "./model/evaluation/test/Tester";

import { AppAutoActiveLearner } from "./model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";
import { AutoActiveLearner } from "./model/supervised/classifier/auto_active_learning/AutoActiveLearner";

import { AppSoftmaxRegressionSparse } from "./model/supervised/classifier/neural_network/learner/AppSoftmaxRegressionSparse";
import { SoftmaxRegressionSparse } from "./model/supervised/classifier/neural_network/learner/SoftmaxRegressionSparse";

import { Utility } from "./utility/Utility";
import { ListArrayUtility } from "./utility/ListArrayUtility";

export default {
    ColumnarData,
    Data,
    DataUtility,
    EntityAnnotatedCorpusData,
    LuData
    ,
    DictionaryMapUtility
    // IDictionaryNumberIdGenericArray,
    // IDictionaryNumberIdGenericArrays,
    // IDictionaryNumberIdGenericSet,
    // IDictionaryNumberIdGenericValue,
    // IDictionaryStringIdGenericArray,
    // IDictionaryStringIdGenericArrays,
    // IDictionaryStringIdGenericSet,
    // IDictionaryStringIdGenericValue,
    // TMapGenericKeyGenericArray,
    // TMapGenericKeyGenericArrays,
    // TMapGenericKeyGenericSet,
    // TMapGenericKeyGenericValue,
    // TMapNumberKeyGenericArray,
    // TMapNumberKeyGenericArrays,
    // TMapNumberKeyGenericSet,
    // TMapNumberKeyGenericValue,
    // TMapStringKeyGenericArray,
    // TMapStringKeyGenericArrays,
    // TMapStringKeyGenericSet,
    // TMapStringKeyGenericValue
    ,
    mainConfusionMatrix,
    mainConfusionMatrixFunction,
    BinaryConfusionMatrix,
    ConfusionMatrix,
    ConfusionMatrixBase,
    // IConfusionMatrix,
    // IMultiLabelConfusionMatrix,
    MultiLabelConfusionMatrix,
    MultiLabelConfusionMatrixBase,
    MultiLabelConfusionMatrixSubset,
    MultiLabelConfusionMatrixWithBinaryArrayBase,
    MultiLabelConfusionMatrixWithBinaryBase
    ,
    // IMathematicsHelper,
    MathematicsHelper
    ,
    AbstractBaseBootstrapSampler,
    AbstractBaseReservoirSampler,
    AbstractBaseSampler,
    BootstrapSampler,
    BootstrapSamplerDistribution,
    BootstrapSamplerKeyMap,
    BootstrapSamplerKeyMapDistribution,
    ReservoirArraySampler,
    ReservoirSampler,
    ReservoirSamplerKeyMap
    ,
    mainCrossValidatorWithColumnarContent,
    mainCrossValidatorWithLuContent,
    mainCrossValidator,
    CrossValidator
    ,
    mainPredictor,
    Predictor
    ,
    mainDataProfileReporter,
    DataProfileReporter,
    mainModelMetaDataProfileReporter,
    ModelMetaDataProfileReporter,
    mainThresholdReporter,
    ThresholdReporter
    ,
    mainTester,
    Tester
    ,
    AppAutoActiveLearner,
    AutoActiveLearner
    ,
    AppSoftmaxRegressionSparse,
    SoftmaxRegressionSparse
    ,
    Utility,
    ListArrayUtility
    ,
};
