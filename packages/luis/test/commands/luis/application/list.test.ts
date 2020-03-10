import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')
const fs = require('fs-extra')
import * as rimraf from 'rimraf'

describe('luis:application:list', () => {

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
  .command(['luis:application:list', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Lists all applications on LUIS service.')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:list', '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('apps'))
  .reply(200, {name: 'testapp'})
  )
  .stdout()
  .command(['luis:application:list', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays a list of applications', ctx => {
    expect(ctx.stdout).to.contain('"name": "testapp"\n ')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('apps'))
  .reply(200, {name: 'testapp'})
  )
  .stdout()
  .command(['luis:application:list', '--out', './testout/test.json', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('export a list of applications to the specified file', ctx => {
    expect(ctx.stdout).to.contain('List successfully written to file')
    expect(ctx.stdout).to.contain('test.json')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('apps'))
  .reply(200, {name: 'testapp'})
  )
  .stdout()
  .stderr()
  .command(['luis:application:list', '--out', 'xyz', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('displays a list of applications and a success message in the console (since the target path provided is invalid)', ctx => {
    expect(ctx.stderr).to.contain('Target directory path doesn\'t exist:')
  })

})
