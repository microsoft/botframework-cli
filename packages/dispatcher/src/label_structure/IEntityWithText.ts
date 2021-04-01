/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEntity } from "./IEntity";

export interface IEntityWithText extends IEntity {
    text: string;
}
