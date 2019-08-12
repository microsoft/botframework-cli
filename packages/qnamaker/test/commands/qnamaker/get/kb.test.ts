import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'
describe('qnamaker:get:kb', () => {

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
    .get('/knowledgebases/4317cfc6-b33a-40af-923a-7860f6610cd7')
    .reply(200,   
      {
        id: "4317cfc6-b33a-40af-923a-7860f6610cd7",
        hostName: "https://some.endpoint.net",
        lastAccessedTimestamp: "2019-08-06T18:00:50Z",
        lastChangedTimestamp: "2019-08-06T18:00:50Z",
        name: "QnA Maker FAQ",
        userId: "dr45hjjkyfsl8505pt8ffu",
        urls: [],
        sources: [
          "Manual.pdf",
          "Custom Editorial"
        ],
        language: "English",
        enableHierarchicalExtraction: false,
        createdTimestamp: "2019-08-06T18:00:50Z"
      })
  
    })
    
    after(async function(){
      await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
    })
    

  test
    .stdout()
    .command(['qnamaker:get:kb', '--kbId', '4317cfc6-b33a-40af-923a-7860f6610cd7'])
    .it('Get knowledbase data', ctx => {
      expect(ctx.stdout).to.contain('"name": "QnA Maker FAQ",')
    })
})