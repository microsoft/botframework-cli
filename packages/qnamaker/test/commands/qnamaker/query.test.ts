import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../configfilehelper'
const nock = require('nock')

describe('qnamaker:query', () => {
  before(async function() {
    await initTestConfigFile()
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
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:query', '--question', 'error', '--hostname', 'https://somehostname.net'])
    .it('qnamaker:query --question error', ctx => {
      expect(ctx.stdout).to.contain(' "answer": "fiancé and £6,500",')
    })
})
