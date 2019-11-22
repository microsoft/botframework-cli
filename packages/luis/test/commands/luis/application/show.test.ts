import {expect, test} from '@oclif/test'

describe('luis:application:show', () => {
  test
  .stdout()
  .command(['luis:application:show'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['luis:application:show', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
