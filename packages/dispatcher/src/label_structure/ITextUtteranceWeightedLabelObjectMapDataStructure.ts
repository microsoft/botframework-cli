/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITextUtteranceLabelObjectMapDataStructure } from "./ITextUtteranceLabelObjectMapDataStructure";

export interface ITextUtteranceWeightedLabelObjectMapDataStructure extends
ITextUtteranceLabelObjectMapDataStructure {
    utteranceWeightMap: Map<string, number>;
}
