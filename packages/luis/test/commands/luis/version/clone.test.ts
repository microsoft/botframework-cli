import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:version:clone', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:version:clone', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Creates a new version equivalent to the current snapshot of the selected application version.')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:clone', '--versionId', '0.1', '--targetVersionId', '0.2', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:clone', '--appId', uuidv1(), '--versionId', '0.1', '--targetVersionId', '0.2', '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('clone'))
  .reply(201, '0.2')
  )
  .stdout()
  .command(['luis:version:clone', '--appId', uuidv1(), '--versionId', '0.1', '--targetVersionId', '0.2', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('clones a luis app and returns the new version number', ctx => {
    expect(ctx.stdout).to.contain('App successfully cloned.')
  })

})
