/**
  * Copyright (c) Microsoft Corporation. All rights reserved.
  * Licensed under the MIT License.
  */
 const {ServiceBase} = require('./serviceBase');
 class EndpointSettings extends ServiceBase {
     constructor() {
         super('/endpointSettings');
     }
 
     /**
     * Gets endpoint keys for an endpoint
     */
     getEndpointSettings(params) {
         return this.createRequest('', params, 'GET');
     }
    /**
    * Re-generates an endpoint key.
    */
    refreshEndpointSettings(params, body) {
        return this.createRequest('', params, 'PATCH', body);
    }
 }
 module.exports = EndpointSettings;