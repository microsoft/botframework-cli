import {expect, test} from '@oclif/test'

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'
const path = require('path')
const nock = require('nock')

describe('qnamaker:kb:replace', () => {
  before(async function () {
    await initTestConfigFile()
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .put('/knowledgebases/287ce749-012c-4eed-a39c-e4f8f06616cf')
      .reply(204)
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:kb:replace', '--kbId', '287ce749-012c-4eed-a39c-e4f8f06616cf', '--in', `${path.join(__dirname, '../../../fixtures/replacekb.json')}`])
    .it('runs qnamaker:kb:replace --kbId xxxxxxxxxx --in replace.json', ctx => {
      expect(ctx.stdout).to.equal('')
    })

  test
    .stderr()
    .command(['qnamaker:kb:replace'])
    .it('runs qnamaker:kb:replace', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
