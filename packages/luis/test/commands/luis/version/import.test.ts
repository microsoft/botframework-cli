import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const uuidv1 = require('uuid/v1')
const utils = require('../../../../src/utils/index')

describe('luis:version:import', () => {

  beforeEach(() => {
    sinon.stub(utils, 'processInputs').returnsArg(0)
    
  })

  afterEach(() => {
    sinon.restore();
  });

  test
  .stdout()
  .command(['luis:version:import', '--help'])
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Imports a new version into a LUIS application')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:import', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:import', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1()])
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'subscriptionKey' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(201, '0.9')
  )
  .stdout()
  .stderr()
  .command(['luis:version:import', '--appId', uuidv1(), '--in', './test/fixtures/sample-app-version.json', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--appId', uuidv1()])
  .it('imports a luis app version from a file and returns the app\'s new version id', ctx => {
    expect(ctx.stdout).to.contain('App version successfully imported as version 0.9')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(201, '0.7')
  )
  .stdout()
  .stderr()
  .command(['luis:version:import', '--versionId', '0.7', '--appId', uuidv1(), '--in', './test/fixtures/sample-app-version.json', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1(), '--appId', uuidv1()])
  .it('imports a luis app version from a file and returns the app\'s new version id, as specified by the versionId flag', ctx => {
    expect(ctx.stdout).to.contain('App version successfully imported as version 0.7')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:import', '--appId', uuidv1(), '--in', './test/fixtures/xyz.json', '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error message if the import file cannot be found', ctx => {
    expect(ctx.stderr).to.contain('Failed to read app JSON')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:import', '--appId', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('displays an error message if no input data detected', ctx => {
    expect(ctx.stderr).to.contain('No import data found - please provide input through stdin or the --in flag')
  })

  test
  .stdin('{"luis_schema_version": "4.0.0","versionId": "0.9","name": "sampleapp","desc": "test description","culture": "en-us","tokenizerVersion": "1.0.0","intents": [{"name": "None"}],"entities": [],"composites": [],"closedLists": [],"patternAnyEntities": [],"regex_entities": [],"prebuiltEntities": [],"model_features": [],"regex_features": [],"patterns": [],"utterances": [],"settings": []}')
  .stdout()
  .stderr()
  .command(['luis:version:import', '--appId', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .it('imports a luis app version from stdin and returns the app\'s id', ctx => {
    process.stdin.setEncoding('utf8')
    process.stdin.once('data', data => {
      expect(ctx.stderr).to.contain('App version successfully imported as version 0.9')
    })
  })

})