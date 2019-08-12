import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'

describe('qnamaker:list:alterations', () => {
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
    .get('/alterations')
    .reply(200,   
      {
        wordAlterations: []
      })
  
    })

    after(async function(){
      await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
    })

  test
    .stdout()
    .command(['qnamaker:list:alterations'])
    .it('List alterations', ctx => {
      expect(ctx.stdout).to.contain('"wordAlterations": []')
    })
})

