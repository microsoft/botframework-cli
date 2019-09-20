import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:update:endpointsettings', () => {
    before(async function() {
        await initTestConfigFile()
        // runs before all tests in this block
        const scope = nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
        .patch('/endpointSettings')
        .reply(200)    
    });

    after(async function(){
    await deleteTestConfigFile()
    })
      
    
    test
    .stdout()
    .command(['qnamaker:update:endpointsettings' ])
    .it('Updates knowledgebase', ctx => {
        expect(ctx.stdout).to.contain('')
    })
})
