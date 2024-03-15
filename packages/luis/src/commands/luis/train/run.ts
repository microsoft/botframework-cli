/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, Flags} from '@microsoft/bf-cli-command'

import Train from './../../../api/train'

const utils = require('../../../utils/index')

export default class LuisTrainRun extends Command {
  static description = 'Issues asynchronous training request for LUIS application'

  static examples = [`
    $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags = {
    help: Flags.help({char: 'h'}),
    endpoint: Flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: Flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: Flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: Flags.string({description: '(required) Version to show training status (defaults to config:LUIS:versionId)'}),
    mode: Flags.string({description: 'Value specifying mode of training (Standard | Neural).'}),
    wait: Flags.boolean({description: 'Wait until training complete and then display status'}),
    json: Flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = await this.parse(LuisTrainRun)
    const flagLabels = Object.keys(LuisTrainRun.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId, versionId, wait} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId}
    utils.validateRequiredProps(requiredProps)

    try {
      const trainingRequestStatus = await Train.train({subscriptionKey, endpoint, appId}, versionId, flags.mode as string)
      if (trainingRequestStatus) {
        await utils.writeToConsole(trainingRequestStatus)
        const output = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : '\nTraining request successfully issued'
        this.log(output)
      }

      if (wait) {
        if (!flags.json) {
          this.log('checking training status...')
        }

        return this.checkTrainingStatus({subscriptionKey, endpoint, appId}, versionId, flags.json as boolean)
      }
    } catch (err) {
      throw new CLIError(`Failed to issue training request: ${err.message}`)
    }
  }

  timeout(ms: number) {
    // tslint:disable-next-line no-string-based-set-timeout
    return new Promise((resolve: any) => setTimeout(resolve, ms))
  }

  async checkTrainingStatus(params: any, versionId: string, jsonOutput: boolean) {
    try {
      const trainingStatusData = await Train.getStatus(params, versionId)
      const inProgress = trainingStatusData.filter((model: any) => {
        if (model.details && model.details.status) {
          return model.details.status === 'InProgress' || model.details.status === 'Queued'
        }
      })
      if (inProgress.length > 0) {
        await this.timeout(1000)
        await this.checkTrainingStatus(params, versionId, jsonOutput)
      } else {
        let completionMssg = ''
        trainingStatusData.map((model: any) => {
          if (model.details && model.details.status && model.details.status === 'Fail') {
            completionMssg += `Training failed for model id ${model.modelId}. Failure reason: ${model.details.failureReason}\n`
          }
        })

        completionMssg = completionMssg ? completionMssg : 'Success'
        const output = jsonOutput ? JSON.stringify({Status: completionMssg}, null, 2) : `${completionMssg} Training is complete`
        this.log(output)
      }
    } catch (err) {
      throw new CLIError(err)
    }
  }

}
