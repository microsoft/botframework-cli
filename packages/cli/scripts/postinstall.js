const os = require('os')
const {cli} = require('cli-ux')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const pjson = require('../package.json');

const windowsHomedriveHome = () => process.env.HOMEDRIVE && process.env.HOMEPATH && path.join(process.env.HOMEDRIVE, process.env.HOMEPATH)
const windowsUserprofileHome = () => process.env.USERPROFILE
const windowsHome = () => windowsHomedriveHome() || windowsUserprofileHome()

const packageName = pjson.name
const platform = os.platform()
const isWindows = platform === 'win32'
const home = process.env.HOME || (isWindows && windowsHome()) || os.homedir() || os.tmpdir()

const getConfigDir = (isWindows, home, pname) => {
    const base = process.env[`XDG_CONFIG_HOME`]
        || (isWindows && process.env.LOCALAPPDATA)
        || path.join(home, '.config')
    return path.join(base, pname)
}

const pathToConfigJson = getConfigDir(isWindows, home, packageName)

const getUserConfig = async () => {
    if (fs.existsSync(path.join(pathToConfigJson, 'config.json'))) {
        return await fs.readJSON(path.join(pathToConfigJson, 'config.json'))
    } else {
        return {
            telemetry: null,
        }
    }
}

 const promptTelemetry = async () => {
  try {
    const userConfig = await getUserConfig()
    userConfig.lastVersionCheck = new Date()
    if (userConfig.telemetry === null) {
      const disableTelemetry = await cli.prompt(chalk.red('Telemetry is disabled. Would you like to opt in? Only command and flags usage will be sent. (Y/N)'))
      if (disableTelemetry === 'Y' || disableTelemetry === 'y') {
        userConfig.telemetry = true
        console.log(chalk.blue('Telemetry has been enabled.'))
        console.log(chalk.blue('You can find Microsoft Privacy Statement at https://privacy.microsoft.com/en-US/privacystatement'))
        console.log(chalk.blue('we will gather some usage data as follows:'))
        console.log(chalk.blue('Command group calls'))
        console.log(chalk.blue('Flags used **excluding** specific values (i.e. if used parameter _--folder=name_, we will only gather the use of _--folder_ but will not capture _name_)'))
      } else {
        userConfig.telemetry = false
        console.log(chalk.blue('Telemetry will remain disabled'))
        console.log(chalk.blue('At any time you may enable data collection by changing the configuration using command:'))
        console.log(chalk.blue('bf config:telemetry:enable'))
      }

      await fs.mkdirp(pathToConfigJson)
      await fs.writeFile(path.join(pathToConfigJson, 'config.json'), JSON.stringify(userConfig, null, 2))
    }
  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to set telemetry
  }
}

const init = async () => {
  await promptTelemetry()
  process.exit(0)
}

init()