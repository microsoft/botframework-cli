import {expect, test} from '@oclif/test'

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:endpointkeys:list', () => {
  before(async function () {
    await initTestConfigFile()
    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/endpointkeys')
      .reply(200,
      {
        primaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        secondaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        installedVersion: '5.15.0',
        lastStableVersion: '5.15.0'
      })
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:endpointkeys:list'])
    .it('Lists all endpoints', ctx => {
      expect(ctx.stdout).to.contain('"secondaryEndpointKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"')
    })
})
