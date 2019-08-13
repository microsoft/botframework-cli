import {expect, test} from '@oclif/test'
const nock = require('nock')
const path = require('path')
const fs = require('fs-extra')

describe('qnamaker:replace:kb', () => {

  before(async function(){
    let config = {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
    
    await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})

    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .put('/knowledgebases/287ce749-012c-4eed-a39c-e4f8f06616cf')
    .reply(204)
  })

  after(async function(){
    await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
  })

  test
    .stdout()
    .command(['qnamaker:replace:kb', '--kbId', '287ce749-012c-4eed-a39c-e4f8f06616cf', '--in', `${path.join(__dirname, '../../../fixtures/replacekb.json')}`])
    .it('runs qnamaker:replace:kb --kbId xxxxxxxxxx --in replace.json', ctx => {
      expect(ctx.stdout).to.equal('')
    })
})
