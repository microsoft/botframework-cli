import {expect, test} from '@oclif/test'
import LuisInit from '../../../src/commands/luis/init'
const sinon = require('sinon')

describe('luis:version:list', () => {

  beforeEach(() => {
    sinon.stub(LuisInit.prototype, 'promptSaveConfig').returns(true)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:init', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Stores default LUIS application values in global config.')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:init'])
  .it('displays an message indication nothing saved if no config values passed', ctx => {
    expect(ctx.stdout).to.contain('No config settings specified')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:init', '--appId', '9999'])
  .it('displays an message indication values saved successfully', ctx => {
    expect(ctx.stdout).to.contain('Config settings saved')
  })

})