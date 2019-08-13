import {expect, test} from '@oclif/test'
const nock = require('nock')
const fs = require('fs-extra')
import * as path from 'path'


describe('qnamaker:export:kb', () => {

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
      .get('/knowledgebases/5690998c-4438-4ae1-900a-88a2aa3bfa68/Test/qna')
      .reply(200,   
        {
          qnaDocuments: [
            {
              id: 1,
              answer: "UNDP’s eRecruit System",
              source: "Manual.pdf",
              questions: [
                "What is UNDP’s eRecruit system?"
              ],
              metadata: [],
              alternateQuestions: "",
              alternateQuestionClusters: [],
              changeStatus: "Update",
              kbId: "4ccc5bcb-0dbe-4f20-ac11-14e5933e4b83",
              context: {
                "isContextOnly": false,
                "prompts": []
              }
            }
          ]
        })
    })

    after(async function(){
      await fs.remove(path.join(process.cwd(), '.qnamakerrc'))
    })
  
    test
    .stdout()
    .command(['qnamaker:export:kb', '--kbId', '5690998c-4438-4ae1-900a-88a2aa3bfa68', '--environment', 'Test'])
    .it('Exports kb', ctx => {
      expect(ctx.stdout).to.contain('"answer": "UNDP’s eRecruit System"')
      nock.cleanAll()
    })
})
