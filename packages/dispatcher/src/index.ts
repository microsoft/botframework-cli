/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AppAutoActiveLearner } from "./model/supervised/classifier/auto_active_learning/AppAutoActiveLearner";

import { mainConfusionMatrix } from "./mathematics/confusion_matrix/AppConfusionMatrix";
import { mainConfusionMatrixFunction } from "./mathematics/confusion_matrix/AppConfusionMatrix";
import { ConfusionMatrix } from "./mathematics/confusion_matrix/ConfusionMatrix";

import { mainCrossValidatorWithColumnarContent } from "./model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidatorWithLuContent } from "./model/evaluation/cross_validation/AppCrossValidator";
import { mainCrossValidator } from "./model/evaluation/cross_validation/AppCrossValidator";

import { mainPredictor } from "./model/evaluation/predict/AppPredictor";

import { mainDataProfileReporter } from "./model/evaluation/report/AppDataProfileReporter";
import { mainModelMetaDataProfileReporter } from "./model/evaluation/report/AppModelMetaDataProfileReporter";
import { mainThresholdReporter } from "./model/evaluation/report/AppThresholdReporter";

export default {
    AppAutoActiveLearner,
    mainConfusionMatrix,
    mainConfusionMatrixFunction,
    ConfusionMatrix,
    mainCrossValidator,
    mainCrossValidatorWithLuContent,
    mainCrossValidatorWithColumnarContent,
    mainPredictor,
    mainDataProfileReporter,
    mainModelMetaDataProfileReporter,
    mainThresholdReporter,
};
