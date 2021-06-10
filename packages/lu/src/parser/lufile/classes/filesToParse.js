/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class FileToParse {
    /**
     * @property {string} filePath 
     */
    /**
     * @property {Boolean} includeInCollate
     */
    /**
     * @property {string} intent
     */
    constructor(filePath, includeInCollate, intent = '') {
        this.filePath = filePath?filePath:'';
        if(includeInCollate === undefined) this.includeInCollate = true;
        else this.includeInCollate = includeInCollate;
        this.intent = intent
    }
}

module.exports = FileToParse;