import {expect, test} from '@oclif/test'
const nock = require('nock')
const path = require('path')

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:alterations:replace', () => {
  before(async function () {
    await initTestConfigFile()
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .put('/alterations')
      .reply(204)
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:alterations:replace', '--in', `${path.join(__dirname, '../../../fixtures/replacealt.json')}`])
    .it('runs qnamaker:alterations:replace', ctx => {
      expect(ctx.stdout).to.empty
    })

  test
    .stderr()
    .command(['qnamaker:alterations:replace'])
    .exit(1)
    .it('runs qnamaker:alterations:replace', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
