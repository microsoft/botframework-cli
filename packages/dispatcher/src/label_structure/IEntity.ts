/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISpan } from "./ISpan";

export interface IEntity extends ISpan {
    entity: string;
}
