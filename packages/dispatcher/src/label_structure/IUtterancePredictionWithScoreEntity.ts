/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUtterancePrediction } from "./IUtterancePrediction";
import { IScoreEntity } from "./IScoreEntity";

export interface IUtterancePredictionWithScoreEntity extends IUtterancePrediction, IScoreEntity {
}
