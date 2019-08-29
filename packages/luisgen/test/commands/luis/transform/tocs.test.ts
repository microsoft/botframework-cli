import {expect, test} from '@oclif/test'

describe('luis:transform:tocs', () => {
  test
    .stdout()
    .command(['luis:transform:tocs'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['luis:transform:tocs', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
