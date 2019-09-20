import {expect, test} from '@oclif/test'

describe('luis:generate:ts', () => {
  test
    .stdout()
    .command(['luis:generate:ts'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['luis:generate:ts', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
