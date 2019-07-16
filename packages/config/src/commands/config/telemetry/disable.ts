import {flags} from '@oclif/command'
import {Command} from '@microsoft/bf-cli-command'
const fs = require('fs-extra')
const path = require('path')

export default class ConfigTelemetryDisable extends Command {
  static description = 'Disable telemetry'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const pathToJson = path.resolve(__dirname, '../../../../../../../package.json')
    const userConfig = await fs.readJSON(pathToJson)
    userConfig.telemetry = false
    await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
    this.log('Telemetry has been disabled.')
  }
}
