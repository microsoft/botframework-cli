import sinon from 'sinon'
import uuidv1 from 'uuid/v1'
import {expect, test} from '@oclif/test'

const utils = require('../../../../src/utils/index')

describe('luis:train:run', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:train:run', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Issues asynchronous training request for LUIS application')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('train'))
  .reply(202, {"statusId": 2,"status": "UpToDate"})
  )
  .stdout()
  .command(['luis:train:run', '--appId', uuidv1(), '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('issues an asynchronous training request and reports when complete', ctx => {
    expect(ctx.stdout).to.contain('Training request successfully issued')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('train'))
  .reply(202, [{
    "modelId": "99999",
    "details": {
      "statusId": 0,
      "status": "Success"
    }
  }])
  .post(uri => uri.includes('train'))
  .reply(202, {"statusId": 2,"status": "UpToDate"})
  )
  .stdout()
  .command(['luis:train:run', '--appId', uuidv1(), '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--wait'])
  .it('issues an asynchronous training request and reports when complete', ctx => {
    expect(ctx.stdout).to.contain('Training request successfully issued')
    expect(ctx.stdout).to.contain('checking training status...')
  })

})
