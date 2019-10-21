import {expect, test} from '@oclif/test'
const nock = require('nock')
import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:endpointkeys:refresh', () => {
  before(async function () {
    await initTestConfigFile()
    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .patch('/endpointkeys/PrimaryKey')
      .reply(200,
      {
        primaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        secondaryEndpointKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        installedVersion: '4.0.5',
        lastStableVersion: '4.0.6'
      })
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:endpointkeys:refresh', '--keyType', 'PrimaryKey'])
    .it('Deletes kb', ctx => {
      expect(ctx.stdout).to.contain('"primaryEndpointKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"')
    })
})
