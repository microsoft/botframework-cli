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
      .command(['config:set:qnamaker', '--kbId', 'aaaaaaaa'])
      .it('Sets kbid in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.qnamaker__kbId).to.contain('aaaaaaaa')
    })
  
    test
      .stdout()
      .command(['config:set:qnamaker', '--subscriptionKey', 'aaaaaaaa'])
      .it('Sets subscriptionkey in config file', async ctx => {
        let config = await fs.readJSON(getConfigFile())
        expect(config.qnamaker__subscriptionKey).to.contain('aaaaaaaa')
    })

    test
    .stdout()
    .command(['config:set:qnamaker', '--endpointKey', 'aaaaaaaa'])
    .it('Sets endpointKey in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker__endpointKey).to.contain('aaaaaaaa')
    })

    test
    .stdout()
    .command(['config:set:qnamaker', '--hostname', 'aaaaaaaa'])
    .it('Sets hostname in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker__hostname).to.contain('aaaaaaaa')
    })

    test
      .stdout()
      .command(['config:set:qnamaker'])
      .it('Asks for a flag', ctx => {
        expect(ctx.stdout).to.contain('Plase specify flag')
    })
})

describe('config:set:qnamaker empty config file', () => {

  after(async function() {
    await deleteTestConfigFile()
  });

  test
    .stdout()
    .command(['config:set:qnamaker', '--kbId', 'aaaaaaaa'])
    .it('Sets kbid in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.qnamaker__kbId).to.contain('aaaaaaaa')
  })
})

