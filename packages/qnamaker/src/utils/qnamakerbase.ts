/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const qnaconfig = require('./../../utils/qnaconfig')
const srvMan = require('./../../utils/servicemanifest')
const {ServiceBase} = require('./../../utils/api/serviceBase')
const file = require('@microsoft/bf-lu/lib/utils/filehelper')


export async function processInputs(flags: any, payload: any, configfile: string, stdin = '') {
  let result: Inputs = {}
  const config = await qnaconfig.composeConfig(flags, configfile)

  try {
    qnaconfig.buildConfig(flags, config)
    ServiceBase.config = flags
    await qnaconfig.validateConfig(flags)
    const serviceManifest = srvMan.getServiceManifest(payload)
    const input = flags.in
    flags.in = flags.in || stdin
    result.requestBody = await srvMan.validateArguments(serviceManifest, flags)
    if (flags.in) {
      result.requestBody = input ? await file.getContentFromFile(input) : stdin
      try {
        result.requestBody = JSON.parse(result.requestBody)
      } catch(ex) {
        flags.qnaFormat = true
      }
    }
    config.endpoint = flags.endpoint
    result.config = config
    result.serviceManifest = serviceManifest
  } catch (e) {
    throw new CLIError(e.message)
  }

  return result
}

export async function getFileInput(file: string) {
  // Let any errors fall through to the runProgram() promise
  let body = await fs.readJSON(path.resolve(file))
  return body
}

export async function updateQnAMakerConfig(config: any , configfile: string) {
  let userConfig: any = {}
  if (fs.existsSync(path.join(configfile, 'config.json'))) {
    userConfig = await fs.readJSON(path.join(configfile, 'config.json'))
  } else {
    await fs.mkdirp(configfile)
  }
  userConfig.qnamaker__subscriptionKey = config.subscriptionKey ? config.subscriptionKey : userConfig.qnamaker__subscriptionKey
  userConfig.qnamaker__kbId = config.kbId ? config.kbId : userConfig.qnamaker__kbId
  userConfig.qnamaker__endpointKey = config.endpointKey ? config.endpointKey : userConfig.qnamaker__endpointKey
  userConfig.qnamaker__hostname = config.hostname ? config.hostname : userConfig.qnamaker__hostname
  await fs.writeJson(path.join(configfile, 'config.json'), userConfig, {spaces: 2})
}

export interface Inputs {
  [key: string]: any
}
