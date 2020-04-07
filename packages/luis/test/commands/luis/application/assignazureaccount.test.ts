import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:assignazureaccount', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {'code': 'Success'})
  )
  .stdout()
  .command(['luis:application:assignazureaccount', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--azureSubscriptionId', uuidv1(), '--resourceGroup', 'adfhrkg', '--accountName', 'sfgsgdszg', '--appId', uuidv1(), '--armToken', 'ljkdsfhlrebclf'])
  .it('Assigns an azure account to a Luis app', ctx => {
    expect(ctx.stdout).to.contain('Account successfully assigned.')
  })

})
