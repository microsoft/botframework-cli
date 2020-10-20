import {expect, test} from '@oclif/test'

describe('qnamaker:operationdetails:index', () => {
  test
    .stdout()
    .command(['qnamaker:operationdetails'])
    .exit(1)
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
