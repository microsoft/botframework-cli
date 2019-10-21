import {expect, test} from '@oclif/test'

describe('qnamaker:endpointkeys:index', () => {
  test
    .stdout()
    .command(['qnamaker:endpointkeys:index'])
    .it('runs', ctx => {
      expect(ctx.stdout).to.contain('')
    })
})
