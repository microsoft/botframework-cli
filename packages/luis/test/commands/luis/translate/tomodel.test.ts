import {expect, test} from '@oclif/test'

describe('luis:translate:tomodel', () => {
  test
    .stdout()
    .command(['luis:translate:tomodel'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['luis:translate:tomodel', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
