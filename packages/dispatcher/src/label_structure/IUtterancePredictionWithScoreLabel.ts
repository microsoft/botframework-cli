/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePrediction } from "./IUtterancePrediction";
import { IScoreLabel } from "./IScoreLabel";

export interface IUtterancePredictionWithScoreLabel extends IUtterancePrediction, IScoreLabel {
}
