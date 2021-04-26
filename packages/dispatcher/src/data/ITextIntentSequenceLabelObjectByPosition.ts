/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntityObjectByPosition } from "./IEntityObjectByPosition";
import { IPartOfSpeechTagObjectByPosition } from "./IPartOfSpeechTagObjectByPosition";

export interface ITextIntentSequenceLabelObjectByPosition {
    entities: IEntityObjectByPosition[];
    partOfSpeechTags: IPartOfSpeechTagObjectByPosition[];
    intent: string;
    text: string;
    weight: number;
}
