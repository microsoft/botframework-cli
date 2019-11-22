import {expect, test} from '@oclif/test'

describe('luis:application:query', () => {
  test
  .stdout()
  .command(['luis:application:query'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['luis:application:query', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
