import {expect, test} from '@oclif/test'
import * as path from 'path'
const fs = require('fs-extra')
const nock = require('nock')

describe('qnamaker:query', () => {
  before(async function() {
    let config = {
      subscriptionKey: "222222cccccctttttth223kk3k33",
      hostname: "https://somehost.net",
      endpointKey: "xxxxxxxxxxxxxxxxxxx",
      kbId: "xxxxxxxxxxxxxxxxxxxxxxx"
    }
    
    await fs.writeJson(path.join(process.cwd(), '.qnamakerrc'), config, {spaces: 2})
    nock('https://somehostname.net/qnamaker')
    .post('/knowledgebases/xxxxxxxxxxxxxxxxxxxxxxx/generateAnswer')
    .reply(200, {
      "answers": [
        {
          "questions": [
            "Error"
          ],
          "answer": "fiancé and £6,500",
          "score": 100,
          "id": 24,
          "source": "Custom Editorial",
          "metadata": [],
          "context": {
            "isContextOnly": false,
            "prompts": []
          }
        }
      ],
      "debugInfo": null
    })
  })

  after(async function(){
    await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
  })

  test
    .stdout()
    .command(['qnamaker:query', '--question', 'error', '--hostname', 'https://somehostname.net'])
    .it('qnamaker:query --question error', ctx => {
      expect(ctx.stdout).to.contain(' "answer": "fiancé and £6,500",')
    })
})
