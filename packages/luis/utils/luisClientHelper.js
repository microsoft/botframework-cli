
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { LUISAuthoringClient } = require('azure-cognitiveservices-luis-authoring')
const msRest = require('ms-rest')

const getClient = flags => {
    const endpoint = flags.endpoint
    const subscriptionKey = flags.subscriptionKey
    const token = { 
      "inHeader": { 
        'Ocp-Apim-Subscription-Key': subscriptionKey 
      }
    };
    const creds = new msRest.ApiKeyCredentials(token)
    const client = new LUISAuthoringClient(creds, endpoint)
    return client;
}

const getFlagFromConfig = flag => {
  // get from config
  return flag
}

module.exports = getClient;
