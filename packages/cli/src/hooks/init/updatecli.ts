import {Hook} from '@oclif/config'
const latestVersion = require('latest-version')
const semver = require('semver')
const version = {latestVersion}

const hook: Hook<'init'> = async function (opts) {
  try {
    const latest = await version.latestVersion(opts.config.name, {version: `>${opts.config.version}`})
    if (semver.gt(latest, opts.config.version)) {
      this.log('Update available ')
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
