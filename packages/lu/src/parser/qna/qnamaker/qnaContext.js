/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class qnaContext { 
    /**
     * @property {Boolean} isContextOnly
     */
    /**
     * @property {qnaMetaData []} prompts
     */
    constructor(isContextOnly, prompts) {
        this.isContextOnly = isContextOnly ? isContextOnly : false;
        this.prompts = prompts ? prompts : [];
    }
}

module.exports = qnaContext;