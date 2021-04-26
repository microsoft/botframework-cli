/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Label } from "./Label";

export interface ITextUtteranceLabelObjectMapDataStructure {
    utteranceEntityLabelsMap: Map<string, Label[]>;
    utteranceEntityLabelDuplicateMap: Map<string, Label[]>;
}
