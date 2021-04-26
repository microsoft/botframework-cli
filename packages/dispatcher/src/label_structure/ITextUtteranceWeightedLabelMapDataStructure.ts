/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITextUtteranceLabelMapDataStructure } from "./ITextUtteranceLabelMapDataStructure";

export interface ITextUtteranceWeightedLabelMapDataStructure extends
ITextUtteranceLabelMapDataStructure {
    utteranceWeightMap: Map<string, number>;
}
