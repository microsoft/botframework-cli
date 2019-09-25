/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const {ServiceBase} = require('./serviceBase');
class Train extends ServiceBase {
    constructor() {
        super('/qnamaker/knowledgebases/{kbId}/train', true /* useEndpoint */);
    }

    /**
    * 
    */
    train(params , trainBody) {
        return this.createRequest('', params, 'post', trainBody);
    }
}
module.exports = Train;
