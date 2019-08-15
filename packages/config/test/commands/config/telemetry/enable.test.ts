import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from '../../../configfilehelper'
const fs = require('fs-extra')


describe('config:telemetry:enable', () => {

  before(async function() {
    await initTestConfigFile()
  });

  after(async function() {
    await deleteTestConfigFile()
  });

  test
    .command(['config:telemetry:enable'])
    .it('Enables telemetry in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.telemetry).to.be.true
    })
})
