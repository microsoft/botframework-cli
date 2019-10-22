import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'

describe('config:show:qnamaker', () => {
    before(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });
  
    test
      .stdout()
      .command(['config:show:qnamaker'])
      .it('Displays config file qnamaker data', ctx => {
        expect(ctx.stdout).to.contain('"qnamaker__subscriptionKey": "222222cccccctttttth223kk3k33",\n  "qnamaker__hostname": "https://somehost.net",\n ')
    })
})
