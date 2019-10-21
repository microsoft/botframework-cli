import {expect, test} from '@oclif/test'

describe('qnamaker:operationdetails:index', () => {
  test
    .stdout()
    .command(['qnamaker:operationdetails:index'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
