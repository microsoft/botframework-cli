import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:rename', () => {

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
  .command(['luis:application:rename', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Renames the application and updates its description')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--description', 'test description'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain('Missing required flag:')
    expect(ctx.stderr).to.contain('--name NAME')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--name', 'sample-app', '--description', 'test description'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .put(uri => uri.includes('apps'))
  .reply(200, {"code":"Success","message":"Operation Successful"})
  )
  .stdout()
  .stderr()
  .command(['luis:application:rename', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--appId', uuidv1(), '--name', 'sample-app', '--description', 'test description'])
  .it('renames a LUIS application and displays a success message', ctx => {
    expect(ctx.stdout).to.contain('App successfully renamed')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:rename', '--endpoint', 'undefined', '--subscriptionKey', uuidv1(), '--appId', uuidv1(), '--name', 'sample-app', '--description', 'test description'])
  .exit(1)
  .it('fails to create an app and displays an error message if the endpoint is undefined', ctx => {
    expect(ctx.stderr).to.contain('Failed to rename app: Error:')
  })

})
