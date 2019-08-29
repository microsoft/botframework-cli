import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from '../../../configfilehelper'
const fs = require('fs-extra')

describe('config:telemetry:disable', () => {
  before(async function() {
    await initTestConfigFile()
  });

  after(async function() {
    await deleteTestConfigFile()
  });

  test
    .stdout()
    .command(['config:telemetry:disable'])
    .it('Disables telemetry in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.telemetry).to.be.false
    })
})