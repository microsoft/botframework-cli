/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Data } from "../../../data/Data";

import { AbstractBaseEvaluator } from "./AbstractBaseEvaluator";

import { Utility } from "../../../utility/Utility";

export abstract class AbstractBaseDataProfileEvaluator extends AbstractBaseEvaluator {

    protected data: Data;

    constructor(
        data: Data) {
        super();
        this.data = data;
    }

    public getData(): Data {
        return this.data;
    }
}
