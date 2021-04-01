/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PredictionType } from "./PredictionType";

export interface IUtterancePrediction {
    utterance: string;
    predictionType: PredictionType;
}
