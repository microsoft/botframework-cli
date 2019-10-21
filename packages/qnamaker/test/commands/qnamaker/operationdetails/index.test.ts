import {expect, test} from '@oclif/test'

describe('qnamaker:operationdetails:index', () => {
  test
    .stdout()
    .command(['qnamaker:operationdetails'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
