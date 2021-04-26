/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export interface ITextUtteranceLabelStringMapDataStructure {
    utteranceLabelsMap: Map<string, Set<string>>;
    utteranceLabelDuplicateMap: Map<string, Set<string>>;
}
