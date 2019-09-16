import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../../configfilehelper'
const fs = require('fs-extra')

describe('config:set:qnamaker', () => {
    before(async function() {
      await initTestConfigFile()
    });
  
    after(async function() {
      await deleteTestConfigFile()
    });
  
    test
      .stdout()
      .command(['config:set:qnamaker', '--kbid', 'aaaaaaaa'])
      .it('Sets kbid in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.qnamaker.kbId).to.contain('aaaaaaaa')
    })
  
    test
      .stdout()
      .command(['config:set:qnamaker', '--subscriptionkey', 'aaaaaaaa'])
      .it('Sets subscriptionkey in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.qnamaker.subscriptionKey).to.contain('aaaaaaaa')
    })

    test
      .stdout()
      .command(['config:set:qnamaker'])
      .it('Asks for a flag', ctx => {
        expect(ctx.stdout).to.contain('Plase specify flag')
    })
})
