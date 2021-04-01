/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITextUtteranceLabelStringMapDataStructure } from "./ITextUtteranceLabelStringMapDataStructure";

export interface ITextUtteranceWeightedLabelStringMapDataStructure extends
ITextUtteranceLabelStringMapDataStructure {
    utteranceWeightMap: Map<string, number>;
}
