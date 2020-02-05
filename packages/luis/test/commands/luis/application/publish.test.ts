import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:publish', () => {

  before(() => {
    const newAppId = uuidv1()
  })

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:application:publish', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Publishes application\'s version')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:publish', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--appId', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'versionId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:publish', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--versionId', '0.01'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('publish'))
  .reply(201, {"versionId":"0.1","isStaging":true,"endpointUrl":"https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4e3d6aec-f79e-4688-b686-feaf6dc2feee","region":"westus","endpointRegion":"westus","failedRegions":"","publishedDateTime":"2019-11-21T21:54:30Z"})
  )
  .stdout()
  .command(['luis:application:publish', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--versionId', '0.01'])
  .it('publishes a luis app and displays the published app data', ctx => {
    expect(ctx.stdout).to.contain('versionId')
    expect(ctx.stdout).to.contain('isStaging')
    expect(ctx.stdout).to.contain('endpointUrl')
    expect(ctx.stdout).to.contain('publishedDateTime')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('publish'))
  .reply(201, {"versionId":"0.1","isStaging":true,"endpointUrl":"https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4e3d6aec-f79e-4688-b686-feaf6dc2feee","region":"westus","endpointRegion":"westus","failedRegions":"","publishedDateTime":"2019-11-21T21:54:30Z"})
  )
  .stdout()
  .command(['luis:application:publish', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--versionId', '0.01', '--direct', '--staging' ])
  .it('publishes a luis app with optional flags and displays the published app data', ctx => {
    expect(ctx.stdout).to.contain('versionId')
    expect(ctx.stdout).to.contain('isStaging')
    expect(ctx.stdout).to.contain('endpointUrl')
    expect(ctx.stdout).to.contain('publishedDateTime')
  })

})