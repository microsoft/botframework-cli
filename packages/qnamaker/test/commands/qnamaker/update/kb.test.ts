import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
import * as path from 'path'
const nock = require('nock')

describe('qnamaker:update:kb', () => {
  before(async function() {
    await initTestConfigFile()
      // runs before all tests in this block
      const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .patch('/knowledgebases/540c6c77-60e8-47df-a324-19f8c82bd692')
      .reply(200,   
        {
          operationState: "Succeeded",
          createdTimestamp: "2019-08-06T12:46:03Z",
          lastActionTimestamp: "2019-08-06T12:46:19Z",
          resourceLocation: "/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2",
          userId: "da.sfhl849qljkdhfalf",
          operationId: "4f2d3e54-e53e-471c-86bf-ef94bc562267"
        })
    
      const scope2 = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/operations/4f2d3e54-e53e-471c-86bf-ef94bc562267')
      .reply(200, 
        {
          operationState: "Succeeded",
          createdTimestamp: "2019-08-06T12:46:03Z",
          lastActionTimestamp: "2019-08-06T12:46:19Z",
          resourceLocation: "/knowledgebases/8600c573-2acf-4466-97e8-999ad4cecbc2",
          userId: "da.sfhl849qljkdhfalf",
          operationId: "4f2d3e54-e53e-471c-86bf-ef94bc562267"
        })
    
  
      });

      after(async function(){
        await deleteTestConfigFile()
      })
  

  test
    .stdout()
    .command(['qnamaker:update:kb', '--in', `${path.join(__dirname, '../../../fixtures/kb.json')}`, '--wait', '--kbId', '540c6c77-60e8-47df-a324-19f8c82bd692'])
    .it('Updates knowledgebase', ctx => {
      expect(ctx.stdout).to.contain('"operationId": "4f2d3e54-e53e-471c-86bf-ef94bc562267"')
    })

    test
    .stderr()
    .command(['qnamaker:update:kb'])
    .it('Updates knowledgebase no input', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
