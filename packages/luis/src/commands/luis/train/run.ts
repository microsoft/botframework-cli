/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {CLIError, Command, flags} from '@microsoft/bf-cli-command'

const utils = require('../../../utils/index')

export default class LuisTrainRun extends Command {
  static description = 'Issues asynchronous training request for LUIS application'

  static examples = [`
    $ bf luis:train:run --appId {APPLICATION_ID} --versionId {VERSION_ID} --endpoint {ENDPOINT} --subscriptionKey {SUBSCRIPTION_KEY}
  `]

  static flags: any = {
    help: flags.help({char: 'h'}),
    endpoint: flags.string({description: 'LUIS endpoint hostname'}),
    subscriptionKey: flags.string({description: '(required) LUIS cognitive services subscription key (default: config:LUIS:subscriptionKey)'}),
    appId: flags.string({description: '(required) LUIS application Id (defaults to config:LUIS:appId)'}),
    versionId: flags.string({description: '(required) Version to show training status (defaults to config:LUIS:versionId)'}),
    wait: flags.boolean({description: 'Wait until training complete and then display status'}),
    json: flags.boolean({description: 'Display output as JSON'}),
  }

  async run() {
    const {flags} = this.parse(LuisTrainRun)
    const flagLabels = Object.keys(LuisTrainRun.flags)
    const configDir = this.config.configDir

    let {endpoint, subscriptionKey, appId, versionId, wait} = await utils.processInputs(flags, flagLabels, configDir)

    const requiredProps = {endpoint, subscriptionKey, appId, versionId}
    utils.validateRequiredProps(requiredProps)

    const client = utils.getLUISClient(subscriptionKey, endpoint)

    try {
      const trainingRequestStatus = await client.train.trainVersion(appId, versionId)
      if (trainingRequestStatus) {
        await utils.writeToConsole(trainingRequestStatus)
        const output = flags.json ? JSON.stringify({Status: 'Success'}, null, 2) : '\nTraining request successfully issued'
        this.log(output)
      }

      if (wait) {
        if (!flags.json) {
          this.log('checking training status...')
        }

        return this.checkTrainingStatus(client, appId, versionId, flags.json)
      }
    } catch (err) {
      throw new CLIError(`Failed to issue training request: ${err}`)
    }
  }

  timeout(ms: number) {
    // tslint:disable-next-line no-string-based-set-timeout
    return new Promise((resolve: any) => setTimeout(resolve, ms))
  }

  async checkTrainingStatus(client: any, appId: string, versionId: string, jsonOutput: boolean) {
    try {
      const trainingStatusData = await client.train.getStatus(appId, versionId)
      const inProgress = trainingStatusData.filter((model: any) => {
        if (model.details && model.details.status) {
          return model.details.status === 'InProgress' || model.details.status === 'Queued'
        }
      })
      if (inProgress.length > 0) {
        await this.timeout(1000)
        await this.checkTrainingStatus(client, appId, versionId, jsonOutput)
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
