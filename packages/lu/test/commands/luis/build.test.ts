import { expect, test } from '@oclif/test'
const path = require('path')
const uuidv1 = require('uuid/v1')

describe('luis:build cli parameters test', () => {
  test
    .stdout()
    .command(['luis:build', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Build lu files and train and publish luis applications')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botname', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`No authoring key is provided!`)
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringkey', uuidv1(), '--botname', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`No lu file or folder is provided!`)
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringkey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`No bot name is provided!`)
    })
})