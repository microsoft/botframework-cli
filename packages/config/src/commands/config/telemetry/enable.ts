import {Command, flags} from '@microsoft/bf-cli-command'

const fs = require('fs-extra')
const path = require('path')

export default class ConfigTelemetryEnable extends Command {
  static description = 'Enable Telemetry'

  static flags: flags.Input<any> = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const pathToJson = path.resolve(__dirname, '../../../../../../../package.json')
    const userConfig = await fs.readJSON(pathToJson)
    userConfig.telemetry = true
    await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
    this.log('Telemetry has been enabled.')
  }
}
