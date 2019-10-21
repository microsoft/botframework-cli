import {expect, test} from '@oclif/test'

describe('qnamaker:alterations:index', () => {
  test
    .stdout()
    .command(['qnamaker:alterations:index'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
