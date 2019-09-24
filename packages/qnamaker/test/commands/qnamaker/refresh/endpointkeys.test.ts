import {expect, test} from '@oclif/test'
const nock = require('nock')
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:refresh:endpointkeys', () => {
  before(async function() {
    await initTestConfigFile()
    // runs before all tests in this block
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .patch('/endpointkeys/PrimaryKey')
    .reply(200,   
      {
        primaryEndpointKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        secondaryEndpointKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        installedVersion: "4.0.5",
        lastStableVersion: "4.0.6"
      })
    });

    after(async function(){
      await deleteTestConfigFile()
    })

  test
  .stdout()
  .command(['qnamaker:refresh:endpointkeys', '--keyType', 'PrimaryKey'])
  .it('Deletes kb', ctx => {
    expect(ctx.stdout).to.contain('"primaryEndpointKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"')
  })
})
