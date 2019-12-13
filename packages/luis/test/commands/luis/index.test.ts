import {expect, test} from '@oclif/test'

describe('luis:index', () => {

  test
  .stdout()
  .command(['luis', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Manages LUIS assets on service and/or locally.')
  })

})