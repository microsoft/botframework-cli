import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'

describe('config:show:telemetry', () => {
    before(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });
  
    test
      .stdout()
      .command(['config:show:telemetry'])
      .it('Displays config file telemetry data', ctx => {
        expect(ctx.stdout).to.contain('true')
    })
})
