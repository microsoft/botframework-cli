/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Hook} from '@oclif/config'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
const chalk = require('chalk')
const path = require('path')
const latestVersion = require('latest-version')
const semver = require('semver')
const isCI = require('is-ci')

const hook: Hook<'init'> = async function (opts) {
  // get config settings
  let userConfig: any
  const curDateTime = new Date()
  const configFileExists = fs.existsSync(path.join(this.config.configDir, 'config.json'))

  const writeUserConfig = async (userconfig: any) => {
    await fs.mkdirp(this.config.configDir)
    await fs.writeFile(path.join(this.config.configDir, 'config.json'), JSON.stringify(userconfig, null, 2))
  }

  try {
    // if config file exists, load settings
    if (configFileExists) {
      userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
    } else {
      // otherwise create in-memory config
      userConfig = {
        telemetry: null,
        lastVersionCheck: null
      }
    }

    const checkForUpdate = async () => {
      const latest = await latestVersion(opts.config.name, {version: `>${opts.config.version}`})
      if (semver.gt(latest, opts.config.version)) {
        this.log('Update available ')
        this.log('     Run ')
        this.log(`npm i -g ${opts.config.name} `)
      }
    }

    const updateUserConfig = async (curVersionCheck: Date) => {
      userConfig.lastVersionCheck = curVersionCheck
      await writeUserConfig(userConfig)
    }

    const isToday = (dateObj: Date | null, today: Date) => {
      return dateObj && dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    }

    // if there's no timestamp in config, create one and check for updates
    // if there is a timestamp in config and it's not from today, check for updates
    const lastCheck = userConfig.lastVersionCheck ? new Date(userConfig.lastVersionCheck) : null
    if (!isToday(lastCheck, curDateTime)) {
      await checkForUpdate()
      await updateUserConfig(curDateTime)
    }

  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to check version
  }

  // Ensure telemetry is set
  try {
    if (process.env.BF_CLI_TELEMETRY) {
      userConfig.telemetry = process.env.BF_CLI_TELEMETRY.toLowerCase() === 'true' ? true : false
    } else if (userConfig.telemetry === null && !isCI) {
      const disableTelemetry = await cli.prompt(chalk.red('Help us improve products by allowing Microsoft to collect anonymous command and flags usage: (Y/N)'))
      if (disableTelemetry === 'Y' || disableTelemetry === 'y') {
        userConfig.telemetry = true
        this.log(chalk.blue('Telemetry has been enabled. You can disable at any time by running bf config:set:telemetry --disable'))
        this.log(chalk.blue('You can find Microsoft Privacy Statement at https://privacy.microsoft.com/en-US/privacystatement'))
        this.log(chalk.blue('we will gather some usage data as follows:'))
        this.log(chalk.blue('Command group calls'))
        this.log(chalk.blue('Flags used **excluding** specific values (i.e. if used parameter _--folder=name_, we will only gather the use of _--folder_ but will not capture _name_)'))
      } else {
        userConfig.telemetry = false
        this.log(chalk.blue('Telemetry will remain disabled'))
        this.log(chalk.blue('At any time you may enable collect anonymous command and flags usage by changing the configuration using command:'))
        this.log(chalk.blue('bf config:set:telemetry --enable'))
      }

      await writeUserConfig(userConfig)
    }

    this.config.pjson.telemetry = userConfig.telemetry === null ? false : userConfig.telemetry
  /* tslint:disable:no-unused */

  } catch (err) {
    this.config.pjson.telemetry = false
  }
}

export default hook
