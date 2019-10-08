import {CLIError} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')
const qnaconfig = require('./../../utils/qnaconfig')
const srvMan = require('./../../utils/servicemanifest')
const {ServiceBase} = require('./../../utils/api/serviceBase')

export async function processInputs(flags: any, payload: any, configfile: string, stdin = '') {
  let result: Inputs = {}
  const config = await qnaconfig.composeConfig(flags, configfile)

  try {
    qnaconfig.buildConfig(flags, config)
    ServiceBase.config = flags
    await qnaconfig.validateConfig(flags)
    const serviceManifest = srvMan.getServiceManifest(payload)
    result.requestBody = await srvMan.validateArguments(serviceManifest, flags)
    if (stdin || flags.in) {
      result.requestBody = stdin ? stdin : await getFileInput(flags.in)
    }
    result.config = config
    result.serviceManifest = serviceManifest
  } catch (e) {
    throw new CLIError(e.message)
  }

  return result
}

async function getFileInput(file: string) {
  // Let any errors fall through to the runProgram() promise
  let body = await fs.readJSON(path.resolve(file))
  return body
}

export interface Inputs {
  [key: string]: any
}
