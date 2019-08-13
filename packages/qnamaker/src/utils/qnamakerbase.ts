const stdin = require('get-stdin')
const qnaconfig = require('./../../utils/qnaconfig')
const srvMan = require('./../../utils/servicemanifest')
const {ServiceBase} = require('./../../utils/api/serviceBase')

export async function processInputs(flags: any, payload: any, verb: string, target: string | undefined) {
  let result: Inputs = {}
  const config = await qnaconfig.composeConfig(flags)
  let service = {}
  if (flags.stdin) {
    let json = await stdin()
    service = await JSON.parse(json)
  }
  qnaconfig.buildConfig(flags, service, config)
  ServiceBase.config = flags
  await qnaconfig.validateConfig(flags)
  const serviceManifest = srvMan.getServiceManifest(verb, target, payload)
  result.requestBody = await srvMan.validateArguments(serviceManifest, flags)
  result.config = config
  result.serviceManifest = serviceManifest
  return result
}

export interface Inputs {
  [key: string]: any
}
