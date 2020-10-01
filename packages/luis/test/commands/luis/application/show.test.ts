import sinon from 'sinon'
import uuidv1 from 'uuid/v1'
import {expect, test} from '@oclif/test'

const utils = require('../../../../src/utils/index')

describe('luis:application:show', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:application:show', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Shows application information')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:show', '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('apps'))
  .reply(200, {id: '99999', name: 'test-app'})
  )
  .stdout()
  .command(['luis:application:show', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays a list of application versions', ctx => {
    expect(ctx.stdout).to.contain('99999')
    expect(ctx.stdout).to.contain('test-app')
  })

})
