import {expect, test} from '@oclif/test'

describe('chatdown', () => {

    test
    .stdout()
    .command(['chatdown', '--help'])
    .exit(1)
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Converts chat dialog files in <filename>.')
    })

})
