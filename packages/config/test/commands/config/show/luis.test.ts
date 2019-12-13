import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'

describe('config:show:luis', () => {
    before(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });
  
    test
      .stdout()
      .command(['config:show:luis'])
      .it('Displays config file luis data', ctx => {
        expect(ctx.stdout).to.contain('"luis__appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"')
    })
})
