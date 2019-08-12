import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'

describe('qnamaker:list:endpointkeys', () => {
  before(async function() {

    let config = {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
    
    await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})
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
      await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
    })

  test
    .stdout()
    .command(['qnamaker:list:endpointkeys'])
    .it('Lists all endpoints', ctx => {
      expect(ctx.stdout).to.contain('"secondaryEndpointKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"')
    })
})
