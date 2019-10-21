import {expect, test} from '@oclif/test'
const nock = require('nock')
import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:kb:publish', () => {
  before(async function () {
    await initTestConfigFile()
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .post('/knowledgebases/xxxx-xxxxxxx-xxxxxxx-xxxxx')
      .reply(204)
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:kb:publish', '--kbId', 'xxxx-xxxxxxx-xxxxxxx-xxxxx'])
    .it('Publishes kb to production endpoint', ctx => {
      expect(ctx.stdout).to.equal('Successs\n')
    })
})
