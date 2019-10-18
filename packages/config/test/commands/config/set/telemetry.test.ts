import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'
const fs = require('fs-extra')

describe('config:set:telemetry', () => {
  test
    beforeEach(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });

      test
      .stdout()
      .command(['config:set:telemetry', '--disable'])
      .it('Disables telemetry in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.telemetry).to.be.false
      })

      test
      .stdout()
      .command(['config:set:telemetry'])
      .it('Shows help and keeps the same seetings', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.telemetry).to.be.true
        expect(ctx.stdout).to.be.contain('Enable or disable telemetry')
      })

      test
      .stdout()
      .command(['config:set:telemetry', '--enable'])
      .it('Enables telemetry in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.telemetry).to.be.true
      })
})
