import {expect, test} from '@oclif/test'
import * as path from 'path'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')
const fs = require('fs-extra')

describe('qnamaker:list:endpointkeys', () => {
  before(async function() {

    await initTestConfigFile()
    // runs before all tests in this block
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .get('/endpointkeys')
    .reply(200,   
      {
        primaryEndpointKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        secondaryEndpointKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        installedVersion: "5.15.0",
        lastStableVersion: "5.15.0"
      })
    })

    after(async function(){
      await deleteTestConfigFile()
    })

  test
    .stdout()
    .command(['qnamaker:list:endpointkeys'])
    .it('Lists all endpoints', ctx => {
      expect(ctx.stdout).to.contain('"secondaryEndpointKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"')
    })
})
