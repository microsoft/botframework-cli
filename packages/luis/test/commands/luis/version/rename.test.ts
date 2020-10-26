import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:version:rename', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:version:rename', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Renames application version')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--newVersionId', '0.2'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'versionId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--versionId', '0.1', '--newVersionId', '0.2'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .put(uri => uri.includes('apps'))
  .reply(200)
  )
  .stdout()
  .command(['luis:version:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--appId', uuidv1(), '--versionId', '0.1', '--newVersionId', '0.2'])
  .it('renames a LUIS application version and displays a success message', ctx => {
    expect(ctx.stdout).to.contain('App version successfully renamed')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:rename', '--endpoint', 'undefined', '--subscriptionKey', uuidv1(), '--appId', uuidv1(), '--versionId', '0.1', '--newVersionId', '0.2'])
  .exit(1)
  .it('fails to rename application version and displays an error message if the endpoint is undefined', ctx => {
    expect(ctx.stderr).to.contain('Failed to rename app version: Error: connect ECONNREFUSED')
  })

})