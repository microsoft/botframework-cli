/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePrediction } from "./IUtterancePrediction";
import { IScoreIntent } from "./IScoreIntent";

export interface IUtterancePredictionWithScoreIntent extends IUtterancePrediction, IScoreIntent {
}
