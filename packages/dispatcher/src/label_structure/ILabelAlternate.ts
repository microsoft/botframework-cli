/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISpan } from "./ISpan";

export interface ILabelAlternate {
    name: string;
    label_type: number;
    span: ISpan;
}
