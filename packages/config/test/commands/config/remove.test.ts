import {expect, test} from '@oclif/test'
import {initTestConfigFile, deleteTestConfigFile, getConfigFile} from './../../configfilehelper'

const fs = require('fs-extra')

describe('config:remove', () => {
  before(async function() {
    await initTestConfigFile()
  });

  after(async function() {
    await deleteTestConfigFile()
  });

  test
    .stdout()
    .command(['config:set', '--key', 'a', '--value', 'b'])
    .it('Adds a value in config file', async ctx => {
      let config = await fs.readJSON(getConfigFile())
      expect(config.a).to.contain('b')
  })

  test
  .stdout()
  .command(['config:remove', '--key', 'a'])
  .it('Removes value from config file', async ctx => {
    let config = await fs.readJSON(getConfigFile())
    expect(config.a).to.equal(undefined)
  })
})