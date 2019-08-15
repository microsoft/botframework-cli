import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from '../../../configfilehelper'
const fs = require('fs-extra')

describe('config:qnamaker:set', () => {
  before(async function() {
    await initTestConfigFile()
  });

  after(async function() {
    await deleteTestConfigFile()
  });

  test
    .stdout()
    .command(['config:qnamaker:set', '--kbid', 'aaaaaaaa'])
    .it('Sets kbid in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker.kbId).to.contain('aaaaaaaa')
    })

  test
    .stdout()
    .command(['config:qnamaker:set', '--subscriptionkey', 'aaaaaaaa'])
    .it('Sets subscriptionkey in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker.subscriptionKey).to.contain('aaaaaaaa')
    })
})
