import {expect, test} from '@oclif/test'

describe('luis:version:clone', () => {
  test
    .stdout()
    .command(['luis:version:clone'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['luis:version:clone', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
