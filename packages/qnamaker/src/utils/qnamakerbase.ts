import {CLIError} from '@microsoft/bf-cli-command'
const stdin = require('get-stdin')
const qnaconfig = require('./../../utils/qnaconfig')
const srvMan = require('./../../utils/servicemanifest')
const {ServiceBase} = require('./../../utils/api/serviceBase')

export async function processInputs(flags: any, payload: any, configfile: string) {
  let result: Inputs = {}
  const config = await qnaconfig.composeConfig(flags, configfile)
  let service = {}

  try {
    if (flags.stdin) {
      let json = await stdin()
      service = await JSON.parse(json)
    }
    qnaconfig.buildConfig(flags, service, config)
    ServiceBase.config = flags
    await qnaconfig.validateConfig(flags)
    const serviceManifest = srvMan.getServiceManifest(payload)
    result.requestBody = await srvMan.validateArguments(serviceManifest, flags)
    result.config = config
    result.serviceManifest = serviceManifest
  } catch (e) {
    throw new CLIError(e.message)
  }

  return result
}

export interface Inputs {
  [key: string]: any
}
