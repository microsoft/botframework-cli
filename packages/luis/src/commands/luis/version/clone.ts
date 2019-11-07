/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {flags} from '@oclif/command'
import {CLIError, Command} from '@microsoft/bf-cli-command'
const getClient = require('../../../../utils/luisClientHelper')

export default class LuisVersionClone extends Command {
  static description = 'Creates a new version equivalent to the current snapshot of the selected application version.'

  static examples = [`
  $ bf luis:version:clone --appId 01234 --versionId 0.1 --targetVersionId 0.2 --endpoint https://westus.api.cognitive.microsoft.com --subscriptionKey 01234
  `]

  static flags = {
    help: flags.help({char: 'h'}),
    appId: flags.string({ description: 'LUIS application Id' }),
    versionId: flags.string({ description: 'LUIS version Id' }),
    targetVersionId: flags.string({ description: 'LUIS target version Id' }),
    endpoint: flags.string({ description: 'LUIS endpoint hostname' }),
    subscriptionKey: flags.string({ description: 'LUIS cognitive services subscription key (aka Ocp-Apim-Subscription-Key)' }),
  }

  async run() {
    try {
      const {flags} = this.parse(LuisVersionClone)

      const appId = flags.appId
      const versionId = flags.versionId
      
      const client = getClient(flags)
      const options = {
        versionCloneObject: {
          version: flags.targetVersionId
        }
      }

      try {
        const latestVersion = await client.versions.clone(appId, versionId, options)
        this.log(`App successfully cloned. Latest version is now: ${latestVersion}`)
      } catch (err) {
        throw new CLIError(`Failed to clone app: ${err}`)
      }

    } catch (err) {
      if (err.message.match(/Malformed configurations options detected/)) {
        throw new CLIError(err.message)
      }
      throw err
    }
    
  }
}
