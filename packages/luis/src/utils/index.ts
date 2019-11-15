/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, utils} from '@microsoft/bf-cli-command'
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

const filterByAllowedConfigValues = (configObj: any, prefix: string) => {
  const allowedConfigValues = [`${prefix}appId`, `${prefix}region`, `${prefix}subscriptionKey`, `${prefix}versionId`]
  const filtered = Object.keys(configObj)
  .filter(key => allowedConfigValues.includes(key))
  .reduce((filteredConfigObj: any, key) => {
    filteredConfigObj[key] = configObj[key]
    return filteredConfigObj
  }, {})
  return filtered
}

const processInputs = async (flags: any, flagLabels: string[], configDir: string) => {
  const configPrefix = 'luis__'
  let config = filterByAllowedConfigValues(await getUserConfig(configDir), configPrefix)
  config = config ? filterConfig(config, configPrefix) : config
  const input: any = {}
  flagLabels
    .filter(flag => flag !== 'help')
    .map((flag: string) => {
      input[flag] = flags[flag] || (config ? config[configPrefix + flag] : null)
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

const writeToConsole = (outputContents: string) => {
  const output = JSON.stringify(outputContents, null, 2)
  process.stdout.write(output, 'utf-8')
}

const writeToFile = async (outputLocation: string, content: any, force: boolean) => {
  const validatedPath = utils.validatePath(outputLocation, '', force)
  try {
    await fs.ensureFile(outputLocation)
    await fs.writeJson(validatedPath, content, {spaces: 2})
  } catch (error) {
    throw new CLIError(`Error writing exported app to file: ${error}`)
  }
  return validatedPath
}

module.exports.getLUISClient = getLUISClient
module.exports.getUserConfig = getUserConfig
module.exports.processInputs = processInputs
module.exports.validateRequiredProps = validateRequiredProps
module.exports.writeToConsole = writeToConsole
module.exports.writeToFile = writeToFile
