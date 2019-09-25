"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */

const intercept = require("intercept-stdout");
intercept(function(txt) {
    return `${process.env.PREFIX === 'prefix' ? `[${'ludown'}] ` : ''}${txt}`;
});
