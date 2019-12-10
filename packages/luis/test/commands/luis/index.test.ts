import {expect, test} from '@oclif/test'
import LuisInit from '../../../src/commands/luis/init'
const sinon = require('sinon')

describe('luis:index', () => {

  test
  .stdout()
  .command(['luis', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Manages LUIS assets on service and/or locally.')
  })

})