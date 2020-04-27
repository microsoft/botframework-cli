import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:delete', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:application:delete', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Deletes a LUIS application')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:delete', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:delete', '--appId', uuidv1(), '--subscriptionKey', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'endpoint' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .delete(uri => uri.includes('apps'))
  .reply(200, {'code': 'Success'})
  )
  .stdout()
  .command(['luis:application:delete', '--appId', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--force'])
  .it('deletes a luis app and displays a success message', ctx => {
    expect(ctx.stdout).to.contain('App successfully deleted')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:delete', '--appId', uuidv1(), '--endpoint', 'undefined', '--subscriptionKey', uuidv1(), '--force'])
  .it('fails to delete an app and displays an error message if the endpoint is undefined', ctx => {
    expect(ctx.stderr).to.contain('Failed to delete app')
  })

})
