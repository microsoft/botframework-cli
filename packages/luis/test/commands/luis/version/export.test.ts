import fs from 'fs-extra'
import rimraf from 'rimraf'
import sinon from 'sinon'
import uuidv1 from 'uuid/v1'
import {expect, test} from '@oclif/test'

const utils = require('../../../../src/utils/index')

describe('luis:version:export', () => {

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
  .command(['luis:version:export', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Exports a LUIS application to JSON format')
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:export', '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'appId' missing.`)
  })

  test
  .stdout()
  .stderr()
  .command(['luis:version:export', '--appId', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--subscriptionKey', uuidv1()])
  .exit(1)
  .it('displays an error if any required input parameters are missing', ctx => {
    expect(ctx.stderr).to.contain(`Required input property 'versionId' missing.`)
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('export'))
  .reply(200, {
    name: "Utilities.Cancel",
    inherits: {
      domain_name: "Utilities",
      model_name: "Cancel"
    },
    "features": []
})
  )
  .stdout()
  .command(['luis:version:export', '--appId', uuidv1(), '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('exports a luis app and displays the export contents in the console', ctx => {
    expect(ctx.stdout).to.contain('domain_name')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('export'))
  .reply(200, {name: 'testname'})
  )
  .stdout()
  .command(['luis:version:export', '--appId', uuidv1(), '--out', './testout/test.json', '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('exports a luis app, displays a success message in the console and the export contents to the specified file', ctx => {
    expect(ctx.stdout).to.contain('File successfully written:')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('export'))
  .reply(200, {name: 'testname'})
  )
  .stdout()
  .stderr()
  .command(['luis:version:export', '--appId', uuidv1(), '--out', 'xyz', '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .exit(1)
  .it('exports a luis app and displays a success message and the export contents in the console (since the target path provided is invalid)', ctx => {
    expect(ctx.stderr).to.contain('Target directory path doesn\'t exist:')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('export'))
  .reply(200, {name: 'testname'})
  )
  .stdout()
  .stderr()
  .command(['luis:version:export', '--appId', uuidv1(), '--out', './testout/test.json', '--force', '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('exports a luis app, displays a success message in the console and the export contents to the specified file, overwriting the existing file of the same name', ctx => {
    expect(ctx.stdout).to.contain('File successfully written')
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .get(uri => uri.includes('export'))
  .reply(200, {name: 'testname'})
  )
  .stdout()
  .command(['luis:version:export', '--appId', uuidv1(), '--out', './testout/test.json', '--versionId', '0.1', '--subscriptionKey', uuidv1(), '--endpoint', 'https://westus.api.cognitive.microsoft.com'])
  .it('exports a luis app, displays a success message in the console and the export contents to the specified file, incrementing the filename', ctx => {
    expect(ctx.stdout).to.contain('File successfully written')
    expect(ctx.stdout).to.contain('test(1).json')
  })

})
