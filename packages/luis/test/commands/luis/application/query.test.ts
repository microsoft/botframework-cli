import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:query', () => {

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
  .command(['luis:application:query', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Queries application for intent predictions')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:query', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--staging', '--subscriptionKey', uuidv1()])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'query' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:query', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--staging', '--query', 'test query'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query": "test intent",
    "topScoringIntent": {
      "intent": "testIntent",
      "score": 0.9987
    }
  })
  )
  .stdout()
  .stderr()
  .command(['luis:application:query', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--staging', '--query', 'test query'])
  .it('queries an application for intent predictions and displays the results', ctx => {
    expect(ctx.stdout).to.contain('test intent')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:query', '--endpoint', 'undefined', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--staging', '--query', 'test query'])
  .exit(1)
  .it('fails to query app and displays an error message if the endpoint is null', ctx => {
    expect(ctx.stderr).to.contain('Failed to fetch prediction data')
  })

})