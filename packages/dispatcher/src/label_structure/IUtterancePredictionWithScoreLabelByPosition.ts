/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePrediction } from "./IUtterancePrediction";
import { IScoreLabelByPosition } from "./IScoreLabelByPosition";

export interface IUtterancePredictionWithScoreLabelByPosition extends IUtterancePrediction, IScoreLabelByPosition {
}
