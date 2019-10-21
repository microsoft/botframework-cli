import {expect, test} from '@oclif/test'

describe('qnamaker:kb:index', () => {
  test
    .stdout()
    .command(['qnamaker:kb'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
