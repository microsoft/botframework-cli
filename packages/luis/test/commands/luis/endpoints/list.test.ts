import fs from 'fs-extra'
import rimraf from 'rimraf'
import sinon from 'sinon'
import uuidv1 from 'uuid/v1'
import {expect, test} from '@oclif/test'

const utils = require('../../../../src/utils/index')

describe('luis:endpoints:list', () => {

  before(() => { 
    fs.mkdirSync('./testout');
  });

  after(() => {
    rimraf('./testout', (err) => {
      if (err) console.log(err);
    })
  });

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:endpoints:list', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Returns available deployment endpoints')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:endpoints:list', '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('endpoints'))
  .reply(200, {"westus": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/99999"})
  )
  .stdout()
  .command(['luis:endpoints:list', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays a list of endpoints', ctx => {
    expect(ctx.stdout).to.contain('westus')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('endpoints'))
  .reply(200, {"westus": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/99999"})
  )
  .stdout()
  .command(['luis:endpoints:list', '--out', './testout/test.json', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('export a list of endpoints to the specified file', ctx => {
    expect(ctx.stdout).to.contain('List successfully written to file')
    expect(ctx.stdout).to.contain('test.json')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('endpoints'))
  .reply(200, {"westus": "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/99999"})
  )
  .stdout()
  .stderr()
  .command(['luis:endpoints:list', '--appId', uuidv1(), '--out', 'xyz', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .exit(1)
  .it('displays a list of endpoints and a success message in the console (since the target path provided is invalid)', ctx => {
    expect(ctx.stderr).to.contain('Target directory path doesn\'t exist:')
  })

})
