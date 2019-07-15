import {Hook} from '@oclif/config'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
const chalk = require('chalk')
const path = require('path')

const hook: Hook<'init'> = async function () {
  try {
    if (this.config.pjson.telemetry === null) {
      const disableTelemetry = await cli.prompt(chalk.red('Telemetry is disabled. Would you like to opt in?. Only command and flags usage will be sent. (Y/N)'))
      if (disableTelemetry === 'Y' || disableTelemetry === 'y') {
        this.config.pjson.telemetry = true
        this.log(chalk.blue('Telemetry has been enabled.'))
        this.log(chalk.blue('You can find Microsoft Privacy Statement at https://privacy.microsoft.com/en-US/privacystatement'))
        this.log(chalk.blue('we will gather some usage data as follows:'))
        this.log(chalk.blue('Command group calls'))
        this.log(chalk.blue('Flags used **excluding** specific values (i.e. if used parameter _--folder=name_, we will only gather the use of _--folder_ but will not capture _name_)'))
      } else {
        this.config.pjson.telemetry = false
        this.log(chalk.blue('Telemetry will remain disabled'))
        this.log(chalk.blue('At any time you may disable data collection by changing the configuration using command:'))
        this.log(chalk.blue('bf config:telemetry:disable'))
      }
      const pathToJson = path.resolve(__dirname, '../../../package.json')
      const userConfig = await fs.readJSON(pathToJson)
      userConfig.telemetry = this.config.pjson.telemetry
      await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
    }
  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to set telemetry
  }
}

export default hook
