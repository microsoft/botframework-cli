import {expect, test} from '@oclif/test'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
const path = require('path')
const semver = require('semver')
const os = require('os')
const isCI = require('is-ci')

const lastversioncheck = path.join(__dirname, '../fixtures/lastversioncheck')
const upgradeavailable = path.join(__dirname, '../fixtures/upgradeavailable')
const rootTelemetryNull = path.join(__dirname, '../fixtures/telemetrynull')

const windowsHomedriveHome = () => process.env.HOMEDRIVE && process.env.HOMEPATH && path.join(process.env.HOMEDRIVE, process.env.HOMEPATH)
const windowsUserprofileHome = () => process.env.USERPROFILE
const windowsHome = () => windowsHomedriveHome() || windowsUserprofileHome()

const packageName: string = 'hooktest'
const platform: string = os.platform()
const isWindows: boolean = platform === 'win32'
const home: string = process.env.HOME || (isWindows && windowsHome()) || os.homedir() || os.tmpdir()

const getConfigDir = (isWindows: boolean, home: string, pname: string) => {
const base: string = process.env[`XDG_CONFIG_HOME`]
|| (isWindows && process.env.LOCALAPPDATA)
|| path.join(home, '.config')
  return path.join(base, pname)
}

const pathToConfigJson = getConfigDir(isWindows, home, packageName)
const pathToConfigJsonUpdate = getConfigDir(isWindows, home, 'botbuilder')

describe('Check if telemetry is set if config is null', () => {

    beforeEach(function() {
      // runs before all tests in this block
      fs.mkdirSync(pathToConfigJson)
    });

    afterEach(function() {
      // runs after all tests in this block
      fs.removeSync(pathToConfigJson)
    });

    test
    .stub(cli, 'prompt', () => async () => 'N')
    .loadConfig({root: rootTelemetryNull})
    .stdout()
    .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
    .do(output => {
      if (!isCI) {
        expect(output.stdout).to.contain('Telemetry will remain disabled')
      } else {
        expect(output.stdout).to.be.empty
      }
    })
    .it('it should disable telemetry when a user opts out')

    test
    .stub(cli, 'prompt', () => async () => 'Y')
    .loadConfig({root: rootTelemetryNull})
    .stdout()
    .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
    .do(output => {
      if (!isCI) {
        expect(output.stdout).to.contain('Telemetry has been enabled')
      } else {
        expect(output.stdout).to.be.empty
      }
    })
    .it('it should enable telemetry when a user opts in')
})

describe('Check if telemetry is not changed if config is not null', () => {
  beforeEach(function() {
    // runs before all tests in this block
    fs.mkdirSync(pathToConfigJson)
    fs.writeFileSync(path.join(pathToConfigJson, 'config.json'), JSON.stringify({telemetry: true,}, null, 2))
  });

  afterEach(function() {
    // runs after all tests in this block
    fs.removeSync(pathToConfigJson)
  });

  test
  .loadConfig({root: rootTelemetryNull})
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).equal(''))
  .it('it should take no action when telemetry is already disabled')

  test
  .loadConfig({root: rootTelemetryNull})
  .stub(semver, 'gt', () => false)
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).equal(''))
  .it('it should take no action when telemetry is already enabled')
})

describe('Update available to stdout', () => {
  beforeEach(function() {
    // runs before all tests in this block
    fs.mkdirSync(pathToConfigJsonUpdate)
    fs.writeFileSync(path.join(pathToConfigJsonUpdate, 'config.json'), JSON.stringify({telemetry: true}, null, 2))
  });

  afterEach(function() {
    // runs after all tests in this block
    fs.removeSync(pathToConfigJsonUpdate)
  });

  test
    .loadConfig({root: upgradeavailable})
    .stub(semver, 'gt', () => true)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: upgradeavailable})
    .do(output => {
      expect(output.stdout).to.contain('Update available')
    })
    .it('it should output to stdout if update is available')

  test
    .loadConfig({root: upgradeavailable})
    .stub(semver, 'gt', () => false)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: upgradeavailable})
    .do(output => expect(output.stdout).to.equal(''))
    .it('it should not output anything if no update is available')

  test
    .loadConfig({root: lastversioncheck})
    .stub(semver, 'gt', () => true)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: lastversioncheck})
    .do(output => {
      expect(output.stdout).to.contain('Update available')
    })
    .it('it should write to message stdout if update is available and last checked timestamp is expired')

})

describe('bypass version update if it\'s already been checked today', async () => {
  let originalDate
  beforeEach(async () => {
    // runs before all tests in this block
    const today = new Date()
    let userConfig = await fs.readJSON(path.join(lastversioncheck, 'package.json'))
    originalDate = userConfig.lastversioncheck
    userConfig.lastversioncheck = today
    fs.writeFileSync(path.join(lastversioncheck, 'package.json'), JSON.stringify(userConfig, null, 2))
    fs.mkdirSync(pathToConfigJsonUpdate)
    fs.writeFileSync(path.join(pathToConfigJsonUpdate, 'config.json'), JSON.stringify({telemetry: true}, null, 2))
  });

  afterEach(async function() {
    // runs after all tests in this block
    fs.removeSync(pathToConfigJsonUpdate)
    let userConfig = await fs.readJSON(path.join(lastversioncheck, 'package.json'))
    userConfig.lastversioncheck = originalDate
    fs.writeFileSync(path.join(lastversioncheck, 'package.json'), JSON.stringify(userConfig, null, 2))
  });

  test
    .loadConfig({root: lastversioncheck})
    .stub(semver, 'gt', () => true)
    .stdout()
    .hook('init', {argv: ['arg']}, {root: lastversioncheck})
    .do(output => {
      expect(output.stdout).to.contain('')
    })
    .it('it should not output anything if last upgrade check was today')

});
