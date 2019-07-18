const {cli} = require('cli-ux')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const pathToJson = path.resolve(__dirname, '../../package.json')

const getUserConfig = async () => {
  return await fs.readJSON(pathToJson)
}

const resetTelemetry = async () => {
  const userConfig = await getUserConfig()
  userConfig.telemetry = null
  await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
}

const promptTelemetry = async () => {
  try {
    let telemetryOptIn = false;
    const userConfig = await getUserConfig()
    if (userConfig.telemetry === null) {
      const disableTelemetry = await cli.prompt(chalk.red('Telemetry is disabled. Would you like to opt in? Only command and flags usage will be sent. (Y/N)'))
      if (disableTelemetry === 'Y' || disableTelemetry === 'y') {
        telemetryOptIn = true
        console.log(chalk.blue('Telemetry has been enabled.'))
        console.log(chalk.blue('You can find Microsoft Privacy Statement at https://privacy.microsoft.com/en-US/privacystatement'))
        console.log(chalk.blue('we will gather some usage data as follows:'))
        console.log(chalk.blue('Command group calls'))
        console.log(chalk.blue('Flags used **excluding** specific values (i.e. if used parameter _--folder=name_, we will only gather the use of _--folder_ but will not capture _name_)'))
      } else {
        console.log(chalk.blue('Telemetry will remain disabled'))
        console.log(chalk.blue('At any time you may enable data collection by changing the configuration using command:'))
        console.log(chalk.blue('bf config:telemetry:enable'))
      }
      userConfig.telemetry = telemetryOptIn
      await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
    }
  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to set telemetry
  }
}

const init = async () => {
  await resetTelemetry()
  await promptTelemetry()
  process.exit(0)
}

init()


