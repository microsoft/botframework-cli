/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ILabel } from "./ILabel";

export interface IResult {
    label: ILabel;
    score: number;
    closesttext: string;
}
