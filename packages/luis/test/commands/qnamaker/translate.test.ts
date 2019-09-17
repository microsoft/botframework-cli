import {expect, test} from '@oclif/test'

describe('qnamaker:translate', () => {
  test
    .stdout()
    .command(['qnamaker:translate'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['qnamaker:translate', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
