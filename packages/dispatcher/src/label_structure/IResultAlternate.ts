/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ILabelAlternate } from "./ILabelAlternate";

export interface IResultAlternate {
    label: ILabelAlternate;
    score: number;
    closest_text: string;
}
