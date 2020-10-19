import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:application:import', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
    
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:application:import', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Imports LUIS application from JSON or LU content.')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:import', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--name', 'sample_app'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(201, '99999')
  )
  .stdout()
  .stderr()
  .command(['luis:application:import', '--name', 'Sample', '--in', './test/fixtures/sample-app.json', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('imports a luis app from a file and returns the app\'s id', ctx => {
    expect(ctx.stdout).to.contain('App successfully imported with id 99999')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:import', '--name', 'Sample', '--in', './test/fixtures/xyz.json', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .exit(1)
  .it('displays an error message if the import file cannot be found', ctx => {
    expect(ctx.stderr).to.contain('Failed to read app JSON')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:application:import', '--name', 'Sample', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .exit(1)
  .it('displays an error message if no input data detected', ctx => {
    expect(ctx.stderr).to.contain('No import data found - please provide input through stdin or the --in flag')
  })

  test
  .stdin('{"luis_schema_version": "4.0.0","versionId": "0.1","name": "sampleapp","desc": "test description","culture": "en-us","tokenizerVersion": "1.0.0","intents": [{"name": "None"}],"entities": [],"composites": [],"closedLists": [],"patternAnyEntities": [],"regex_entities": [],"prebuiltEntities": [],"model_features": [],"regex_features": [],"patterns": [],"utterances": [],"settings": []}')
  .stdout()
  .stderr()
  .command(['luis:application:import', '--name', 'sampleapp', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .exit(1)
  .it('imports a luis app from stdin and returns the app\'s id', ctx => {
    process.stdin.setEncoding('utf8')
    process.stdin.once('data', data => {
      expect(ctx.stderr).to.contain('App successfully imported with id 99999')
    })
  })

})