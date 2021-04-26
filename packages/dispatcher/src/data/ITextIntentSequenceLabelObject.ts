/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntityObject } from "./IEntityObject";
import { IPartOfSpeechTagObject } from "./IPartOfSpeechTagObject";

export interface ITextIntentSequenceLabelObject {
    entities: IEntityObject[];
    partOfSpeechTags: IPartOfSpeechTagObject[];
    intent: string;
    text: string;
    weight: number;
}
