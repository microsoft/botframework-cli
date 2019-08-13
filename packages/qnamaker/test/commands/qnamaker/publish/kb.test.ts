import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'

describe('qnamaker:publish:kb', () => {

  before(async function(){
    let config = {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
    
    await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})
    const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .post('/knowledgebases/xxxx-xxxxxxx-xxxxxxx-xxxxx')
    .reply(204)
  })

  after(async function(){
    await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
  })

  
  test
    .stdout()
    .command(['qnamaker:publish:kb', '--kbId', 'xxxx-xxxxxxx-xxxxxxx-xxxxx'])
    .it('Publishes kb to production endpoint', ctx => {
      expect(ctx.stdout).to.equal('\n')
    })
})
