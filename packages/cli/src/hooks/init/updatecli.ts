import {Hook} from '@oclif/config'
const latestVersion = require('latest-version')
const semver = require('semver')

const hook: Hook.Init = async function (opts) {
  try {
    let latest = await latestVersion(opts.config.name, {version: `>${opts.config.version}`})
    if (semver.gt(latest, opts.config.version)) {
      this.log('Update available ')
      this.log(`${latest}\n`)
      this.log('     Run ')
      this.log(`npm i -g ${opts.config.name} `)
    }
  /* tslint:disable:no-unused */
  } catch (err) {
      // swallow the exception; we don't want to crash the app
      // on a failed attempt to check version
  }
}

export default hook
