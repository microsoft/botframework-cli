import {Command} from 'cli-command'
import * as fs from 'fs-extra'
const path = require('path')

export default class ConfigTelemetryDisable extends Command {
  static description = 'Disable telemetry'

  async run() {
    const pathToJson = path.resolve(__dirname, '../../../../../cli/package.json')
    const userConfig = await fs.readJSON(pathToJson)
    userConfig.telemetry = false
    await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
    this.log('Telemetry has been disabled.')
  }
}
