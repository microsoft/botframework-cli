import {expect, test} from '@oclif/test'

describe('dialog:verify', () => {
  test
    .stdout()
    .command(['dialog:verify'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['dialog:verify', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
