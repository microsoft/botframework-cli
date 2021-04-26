/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntityByPosition } from "./IEntityByPosition";

export interface IEntityWithTextByPosition extends IEntityByPosition {
    text: string;
}
