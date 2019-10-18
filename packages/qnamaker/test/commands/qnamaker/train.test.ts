import {expect, test} from '@oclif/test'

describe('qnamaker:train', () => {
    test
    .stderr()
    .command(['qnamaker:train'])
    .it('qnamaker:train no input passed', ctx => {
      expect(ctx.stderr).to.contain('No input. Please set file path with --in or pipe required data to the command')
    })
})
