import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:create', () => {

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
  .command(['luis:application:create', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Creates a new LUIS application')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:create', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--culture', 'en-us', '--domain', 'Comics', '--description', 'test description', '--initialVersionId', '0.04', '--usageScenario', 'For use in our test app'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'name' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:create', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--name', 'orange_app', '--culture', 'en-us', '--domain', 'Comics', '--description', 'test description', '--initialVersionId', '0.04', '--usageScenario', 'For use in our test app'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(201, '99999')
  )
  .stdout()
  .command(['luis:application:create', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--name', 'orange_app', '--subscriptionKey', uuidv1(), '--culture', 'en-us', '--domain', 'Comics', '--description', 'test description', '--initialVersionId', '0.04', '--usageScenario', 'For use in our test app'])
  .it('creates a luis app and returns the new app\'s id', ctx => {
    expect(ctx.stdout).to.contain('App successfully created with id 99999')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:create', '--endpoint', 'undefined', '--name', 'orange_app', '--subscriptionKey', uuidv1(), '--culture', 'en-us', '--domain', 'Comics', '--description', 'test description', '--initialVersionId', '0.04', '--usageScenario', 'For use in our test app'])
  .it('fails to create an app and displays an error message if the endpoint is null', ctx => {
    expect(ctx.stderr).to.contain('Access denied due to invalid subscription key or wrong API endpoint.')
  })

})
