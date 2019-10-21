import {expect, test} from '@oclif/test'

import {
  deleteTestConfigFile,
  initTestConfigFile
} from '../../../configfilehelper'
const nock = require('nock')

describe('qnamaker:endpointsettings:get', () => {
  before(async function () {
    await initTestConfigFile()
    // runs before all tests in this block
    nock(
      'https://westus.api.cognitive.microsoft.com/qnamaker/v4.0'
    )
      .get('/endpointSettings')
      .reply(200, {
        activeLearning: {
          enable: 'True'
        }
      })
  })

  after(async function () {
    await deleteTestConfigFile()
  })

  test
    .stdout()
    .command(['qnamaker:endpointsettings:get'])
    .it('Get knowledbase data', ctx => {
      expect(ctx.stdout).to.contain(
        '{\n  "activeLearning": {\n    "enable": "True"\n  }\n}\n'
      )
    })
})
