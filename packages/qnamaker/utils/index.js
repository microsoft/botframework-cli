/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const {ServiceBase} = require('./api/serviceBase');
const api = require('./api');
const dataModels = require('./api/dataModels');

/**
 * Entry into the program flow from the CLI
 *
 * This function orchestrates the instantiation
 * of the service containing the operation to call.
 * If a body is specified, the typed data model is
 * created and the source object containing the properties
 * is passed in. This is necessary to guarantee the
 * endpoint receives a clean data model.
 *
 * @param {*} config The .luisrc file containing the configuration options
 * @param {*} serviceManifest The manifest entry containing the details of the service to invoke.
 * @param {*} args The arguments to use as the params for the request
 * @param {*} requestBody The request body to send to the endpoint
 *
 * @returns {Promise<*|Promise|{enumerable}|void|JSON|Promise<any>>}
 */
module.exports = async function qnamaker(config, serviceManifest, args, requestBody) {
    // Provide the config to the ServiceBase
    ServiceBase.config = config;
    
    // If a request body is specified and a typed data model
    // is available, create it and pass the source in.
    // This guarantees the endpoint will get only the
    // properties it expects since the user can specify
    // any json file with any number of properties that
    // may or may not be valid.
    const {identifier, operation} = serviceManifest;
    let requestBodyDataModel;
    // Allow untyped request bodies to seep through unchanged
    if (requestBody && operation.entityType && dataModels[operation.entityType]) {
        requestBodyDataModel = dataModels[operation.entityType].fromJSON(requestBody);
    }
    // Create the target service and kick off the request.
    const service = new api[identifier]();

    try {
      const response = await service[operation.name](args, (requestBodyDataModel || requestBody));
      return response.data;
    }
    catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return error.response.data;

          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return error.request;
          } else {
            // Something happened in setting up the request that triggered an Error
            return error.message;
          }
    }
};
