/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISpanByPosition } from "./ISpanByPosition";

export interface IEntityByPosition extends ISpanByPosition {
    entity: string;
}
