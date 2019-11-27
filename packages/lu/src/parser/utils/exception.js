/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const exception = class {
    /**
     * 
     * @param {string} errCode 
     * @param {string} text 
     * @param {any[]} diagnostics
     */
    constructor(errCode, text, diagnostics) {
        if(errCode === Object(errCode)) {
            this.text = errCode.text?errCode.text:'';
            this.errCode = errCode.errCode?errCode.errCode:99;
        } else {
            this.text = text?text:'';
            this.errCode = errCode?errCode:99;
        }

        this.diagnostics = diagnostics
    }
};

module.exports = exception;