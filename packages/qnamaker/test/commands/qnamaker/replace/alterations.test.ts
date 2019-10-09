import {expect, test} from '@oclif/test'
const nock = require('nock')
const path = require('path')
const fs = require('fs-extra')
import {initTestConfigFile, deleteTestConfigFile} from '../../../configfilehelper'

describe('qnamaker:replace:alterations', () => {
  before(async function(){
    await initTestConfigFile()
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
    .put('/alterations')
    .reply(204)
  })

  after(async function(){
    await deleteTestConfigFile()
  })


  test
    .stdout()
    .command(['qnamaker:replace:alterations', '--in', `${path.join(__dirname, '../../../fixtures/replacealt.json')}`])
    .it('runs qnamaker:replace:alterations', ctx => {
      expect(ctx.stdout).to.empty
    })

    test
    .stderr()
    .command(['qnamaker:replace:alterations'])
    .it('runs qnamaker:replace:alterations', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
