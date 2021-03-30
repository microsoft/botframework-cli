/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Label } from "./Label";

export interface ITextUtteranceLabelMapDataStructure {
    utteranceLabelsMap: Map<string, Set<string>>;
    utteranceLabelDuplicateMap: Map<string, Set<string>>;
    utteranceEntityLabelsMap: Map<string, Label[]>;
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>;
}
