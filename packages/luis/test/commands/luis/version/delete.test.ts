import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:version:delete', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:version:delete', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Deletes a LUIS application version')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:delete', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:delete', '--appId', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'versionId' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .delete(uri => uri.includes('version'))
  .reply(200)
  )
  .stdout()
  .command(['luis:version:delete', '--appId', uuidv1(), '--versionId', '0.2', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('deletes a luis app and displays a success message', ctx => {
    expect(ctx.stdout).to.contain('Successfully deleted version')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:delete', '--appId', uuidv1(), '--versionId', '0.2', '--endpoint', 'undefined', '--subscriptionKey', uuidv1()])
  .it('fails to delete an app and displays an error message if the endpoint is undefined', ctx => {
    expect(ctx.stderr).to.contain('Failed to delete app version')
  })

})
