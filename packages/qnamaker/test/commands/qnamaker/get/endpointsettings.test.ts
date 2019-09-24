import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:get:endpointsettings', () => {
    before(async function() {
        await initTestConfigFile()
        // runs before all tests in this block
        const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
        .get('/endpointSettings')
        .reply(200,   
            {
                activeLearning: {
                  enable: "True"
                }
              })
        })
        
        after(async function(){
          await deleteTestConfigFile()
        })
        
    
      test
        .stdout()
        .command(['qnamaker:get:endpointsettings'])
        .it('Get knowledbase data', ctx => {
          expect(ctx.stdout).to.contain('{\n  "activeLearning": {\n    "enable": "True"\n  }\n}\n')
        })
})
