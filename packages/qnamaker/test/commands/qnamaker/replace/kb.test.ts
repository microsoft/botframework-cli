import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'
const path = require('path')
const nock = require('nock')

describe('qnamaker:replace:kb', () => {

  before(async function(){
    await initTestConfigFile()
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .put('/knowledgebases/287ce749-012c-4eed-a39c-e4f8f06616cf')
    .reply(204)
  })

  after(async function(){
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:replace:kb', '--kbId', '287ce749-012c-4eed-a39c-e4f8f06616cf', '--in', `${path.join(__dirname, '../../../fixtures/replacekb.json')}`])
    .it('runs qnamaker:replace:kb --kbId xxxxxxxxxx --in replace.json', ctx => {
      expect(ctx.stdout).to.equal('')
    })

    test
    .stderr()
    .command(['qnamaker:replace:kb'])
    .it('runs qnamaker:replace:kb', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })

    
})
