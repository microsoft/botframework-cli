import {expect, test} from '@oclif/test'

describe('evaluate', () => {
  test
  .stdout()
  .command(['evaluate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['evaluate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
