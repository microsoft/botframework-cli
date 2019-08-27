import {expect, test} from '@oclif/test'
const nock = require('nock')
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:publish:kb', () => {

  before(async function(){
    await initTestConfigFile()
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .post('/knowledgebases/xxxx-xxxxxxx-xxxxxxx-xxxxx')
    .reply(204)
  })

  after(async function(){
    await deleteTestConfigFile()
  })

  
  test
    .stdout()
    .command(['qnamaker:publish:kb', '--kbId', 'xxxx-xxxxxxx-xxxxxxx-xxxxx'])
    .it('Publishes kb to production endpoint', ctx => {
      expect(ctx.stdout).to.equal('\n')
    })
})
