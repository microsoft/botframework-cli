import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../configfilehelper'

describe('config:show', () => {
    before(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });
  
    test
      .stdout()
      .command(['config:show'])
      .it('Displays config file data', ctx => {
        expect(ctx.stdout).to.contain('"qnamaker__subscriptionKey": "222222cccccctttttth223kk3k33"')
    })
})

