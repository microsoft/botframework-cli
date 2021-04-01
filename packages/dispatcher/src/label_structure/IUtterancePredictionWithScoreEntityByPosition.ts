/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePrediction } from "./IUtterancePrediction";
import { IScoreEntityByPosition } from "./IScoreEntityByPosition";

export interface IUtterancePredictionWithScoreEntityByPosition extends IUtterancePrediction, IScoreEntityByPosition {
}
