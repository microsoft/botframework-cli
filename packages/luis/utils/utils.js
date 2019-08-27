"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const pkg = require('../package.json');
const intercept = require("intercept-stdout");
intercept(function(txt) {
    return `${process.env.PREFIX === 'prefix' ? `[${pkg.name}] ` : ''}${txt}`;
});
