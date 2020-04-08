import {expect, test} from '@oclif/test'

import {deleteTestConfigFile, initTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:kb:export', () => {
  before(async function () {
    await initTestConfigFile()
      // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/knowledgebases/5690998c-4438-4ae1-900a-88a2aa3bfa68/Test/qna')
      .reply(200,
      {
        qnaDocuments: [
          {
            id: 1,
            answer: 'UNDP’s eRecruit System',
            source: 'Manual.pdf',
            questions: [
              'What is UNDP’s eRecruit system?'
            ],
            metadata: [],
            alternateQuestions: '',
            alternateQuestionClusters: [],
            changeStatus: 'Update',
            kbId: '4ccc5bcb-0dbe-4f20-ac11-14e5933e4b83',
            context: {
              isContextOnly: false,
              prompts: []
            }
          }
        ]
      })
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:kb:export', '--kbId', '5690998c-4438-4ae1-900a-88a2aa3bfa68', '--environment', 'Test'])
    .it('Exports kb', ctx => {
      expect(ctx.stdout).to.contain('"answer": "UNDP’s eRecruit System"')
      nock.cleanAll()
    })
})

describe('[qnaformat] qnamaker:kb:export', () => {
  before(async function () {
    await initTestConfigFile()
      // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/knowledgebases/5690998c-4438-4ae1-900a-88a2aa3bfa68/Test/qna?qnaformat=true')
      .reply(200,
      `## ? I need help
      - help
      - can you please help
      - what can I say
      - what can you do?
      
      **Filters:**
      - dialogname = adaptivedialog
      
      \`\`\`markdown
      Sure. Happy to help!
      \`\`\`
      `)
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:kb:export', '--kbId', '5690998c-4438-4ae1-900a-88a2aa3bfa68', '--environment', 'Test', '--qnaFormat'])
    .it('Exports kb', ctx => {
      console.log(ctx.stdout)
      expect(ctx.stdout).to.contain('Sure. Happy to help!')
      nock.cleanAll()
    })
})

