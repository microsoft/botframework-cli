import {expect, test} from '@oclif/test'

describe('dialog:merge', () => {
  test
    .stdout()
    .command(['dialog:merge'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['dialog:merge', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
