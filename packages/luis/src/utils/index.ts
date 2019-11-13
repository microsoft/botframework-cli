/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command'
const path = require('path')
const fs = require('fs-extra')
const msRest = require('ms-rest')
const {LUISAuthoringClient} = require('azure-cognitiveservices-luis-authoring')

const filterConfig = (config: any, prefix: string) => {
  return Object.keys(config)
    .filter((key: string) => key.startsWith(prefix))
    .reduce((filteredConfig: any, key: string) => {
      filteredConfig[key] = config[key]
      return filteredConfig
    }, {})
}

const getUserConfig = async (configPath: string) => {
  if (fs.existsSync(path.join(configPath, 'config.json'))) {
    return fs.readJSON(path.join(configPath, 'config.json'), {throws: false})
  }
}

const getLUISClient = (subscriptionKey: string, endpoint: string) => {
  const token = {
    inHeader: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  }
  const creds = new msRest.ApiKeyCredentials(token)
  const luisClient = new LUISAuthoringClient(creds, endpoint)
  luisClient.baseUri = 'https://westus.api.cognitive.microsoft.com/luis/authoring/v3.0-preview/'
  return luisClient
}

const getPropFromConfig = async (prop: string, configDir: string) => {
  const config = await getUserConfig(configDir)
  if (config && config[prop]) {
    return config[prop]
  }
}

const processInputs = async (flags: any, flagLabels: string[], configDir: string, prefix: string) => {
  let config = await getUserConfig(configDir)
  config = config ? filterConfig(config, prefix) : config
  const input: any = {}
  flagLabels
    .filter(flag => flag !== 'help')
    .map((flag: string) => {
      input[flag] = flags[flag] || (config ? config[`luis__${flag}`] : null)
    })

  return input
}

const validateRequiredProps = (configObj: any) => {
  Object.keys(configObj).forEach(key => {
    if (!configObj[key]) {
      throw new CLIError(`Required input property '${key}' missing. Please pass it in as a flag or set it in the config file.`)
    }
  })
}

module.exports.getLUISClient = getLUISClient
module.exports.getUserConfig = getUserConfig
module.exports.getPropFromConfig = getPropFromConfig
module.exports.processInputs = processInputs
module.exports.validateRequiredProps = validateRequiredProps
