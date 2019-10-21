import {expect, test} from '@oclif/test'

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:endpointsettings:update', () => {
  before(async function () {
    await initTestConfigFile()
        // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .patch('/endpointSettings')
      .reply(200)
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:endpointsettings:update'])
    .it('Updates knowledgebase', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
