/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISpan } from "./ISpan";

export interface ILabel {
    name: string;
    labeltype: number;
    span: ISpan;
}
