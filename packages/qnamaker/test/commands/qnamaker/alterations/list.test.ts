import {expect, test} from '@oclif/test'
const nock = require('nock')

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:alterations:list', () => {
  before(async function () {
    await initTestConfigFile()
    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/alterations')
      .reply(200,
      {
        wordAlterations: []
      })

  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:alterations:list'])
    .it('List alterations', ctx => {
      expect(ctx.stdout).to.contain('"wordAlterations": []')
    })
})
