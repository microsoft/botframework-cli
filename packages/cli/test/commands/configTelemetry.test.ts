import {expect, test} from '@oclif/test'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
const path = require('path')

const rootTelemetryDisabled = path.join(__dirname, '../fixtures/telemetrydisabled')
const rootTelemetryEnabled = path.join(__dirname, '../fixtures/telemetryenabled')
const rootTelemetryNull = path.join(__dirname, '../fixtures/telemetrynull')

const resetTelemetry = async (defaultVal: any) => {
  const pathToJson = path.resolve(__dirname, '../../package.json')
  const userConfig = await fs.readJSON(pathToJson)
  userConfig.telemetry = defaultVal
  await fs.writeFile(pathToJson, JSON.stringify(userConfig, null, 2))
}

after(() => {
  resetTelemetry(null)
})

describe('it should disable telemetry when a user opts out', () => {
  test
  .stub(cli, 'prompt', () => async () => 'Y')
  .loadConfig({root: rootTelemetryNull})
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).to.contain('Telemetry has been disabled'))
  .it()
})

describe('it should enable telemetry when a user opts in', () => {
  test
  .stub(cli, 'prompt', () => async () => 'N')
  .loadConfig({root: rootTelemetryNull})
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).to.contain('Telemetry will remain enabled'))
  .it()
})

describe('it should take no action when telemetry is already enabled', () => {
  test
  .loadConfig({root: rootTelemetryEnabled})
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).equal(''))
  .it()
})

describe('it should take no action when telemetry is already disabled', () => {
  test
  .loadConfig({root: rootTelemetryDisabled})
  .stdout()
  .hook('init', {argv: ['arg']}, {root: rootTelemetryNull})
  .do(output => expect(output.stdout).equal(''))
  .it()
})
