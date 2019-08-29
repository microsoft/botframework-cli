import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')


describe('qnamaker:list:alterations', () => {
  before(async function() {
    await initTestConfigFile()
    // runs before all tests in this block
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .get('/alterations')
    .reply(200,   
      {
        wordAlterations: []
      })
  
    })

    after(async function(){
      await deleteTestConfigFile()
    })

  test
    .stdout()
    .command(['qnamaker:list:alterations'])
    .it('List alterations', ctx => {
      expect(ctx.stdout).to.contain('"wordAlterations": []')
    })
})

