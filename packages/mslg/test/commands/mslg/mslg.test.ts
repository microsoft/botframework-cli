import {expect, test} from '@oclif/test'

describe('The mslg command', () => {
  test
    .stdout()
    .command(['mslg'])
    .it('outputs help contents when no arguments passed', ctx => {
      expect(ctx.stdout).to.contain('MSLG is a command line tool to parse, collate, expand and translate lg files.')
    })
  test
    .stdout()
    .command(['mslg', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('MSLG is a command line tool to parse, collate, expand and translate lg files.')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg', 'k'])
    .it('should print an error when an invalid command is passed', ctx => {
      expect(ctx.stderr).to.contain('Unexpected argument')
    })
  test
    .stdout()
    .stderr()
    .command(['mslg', '--k'])
    .it('should print an error when an invalid argument is passed', ctx => {
      expect(ctx.stderr).to.contain('Unexpected argument')
    })
})
