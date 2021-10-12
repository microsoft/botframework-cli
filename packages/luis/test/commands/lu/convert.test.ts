import {expect, test} from '@oclif/test'

describe('lu:convert', () => {
  test
  .stdout()
  .command(['lu:convert'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['lu:convert', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
