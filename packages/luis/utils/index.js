
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const pjson = require('../package.json')
const msRest = require('ms-rest')
const { LUISAuthoringClient } = require('azure-cognitiveservices-luis-authoring')
const {CLIError} = require('@microsoft/bf-cli-command')

const windowsHomedriveHome = () => process.env.HOMEDRIVE && process.env.HOMEPATH && path.join(process.env.HOMEDRIVE, process.env.HOMEPATH)
const windowsUserprofileHome = () => process.env.USERPROFILE
const windowsHome = () => windowsHomedriveHome() || windowsUserprofileHome()

const packageName = pjson.name
const platform = os.platform()
const isWindows = platform === 'win32'
const home = process.env.HOME || (isWindows && windowsHome()) || os.homedir() || os.tmpdir()

const getConfigDir = (isWindows, home, pname) => {
    const base = process.env[`XDG_CONFIG_HOME`]
        || (isWindows && process.env.LOCALAPPDATA)
        || path.join(home, '.config')
    return path.join(base, pname)
}

const getUserConfig = async () => {
    const pathToConfigJson = getConfigDir(isWindows, home, packageName)
    if (fs.existsSync(path.join(pathToConfigJson, 'config.json'))) {
      return await fs.readJSON(path.join(pathToConfigJson, 'config.json'), { throws: false })
    }
}

const getLUISClient = (subscriptionKey, endpoint) => {
  const token = { 
    'inHeader': { 
      'Ocp-Apim-Subscription-Key': subscriptionKey 
    }
  };
  const creds = new msRest.ApiKeyCredentials(token)
  return new LUISAuthoringClient(creds, endpoint)
}

const getPropFromConfig = async(prop) => {
  const config = await getUserConfig()
  if (config && config[prop]) {
    return config[prop]
  }
}

const validateRequiredProps = configObj => {
  Object.keys(configObj).forEach(key=>{
    if (!configObj[key]) {
      throw new CLIError(`Required input property '${key}' missing. Please pass it in as a flag or set it in the config file.`)
    }
  });
}

module.exports.getLUISClient = getLUISClient
module.exports.getPropFromConfig = getPropFromConfig
module.exports.validateRequiredProps = validateRequiredProps
