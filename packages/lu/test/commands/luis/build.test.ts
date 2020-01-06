import {expect, test} from '@oclif/test'
const path = require('path')
const fs = require('fs-extra')
const uuidv1 = require('uuid/v1')
const nock = require('nock')

const compareFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  expect(fixtureFile).to.deep.equal(result)
  return result === fixtureFile
}

describe('luis:build cli parameters test', () => {
  test
    .stdout()
    .command(['luis:build', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Build lu files to train and publish luis applications')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botname', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`Missing required flag:\n --authoringkey AUTHORINGKEY`)
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringkey', uuidv1(), '--botname', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`Missing input. Please use stdin or pass a file or folder location with --in flag`)
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringkey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain(`Missing required flag:\n --botname BOTNAME  Bot name`)
    })
})

describe('luis:build create a new application successfully', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test.en-us.lu',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('train'))
      .reply(200, [{
        modelId: '99999',
        details: {
          statusId: 0,
          status: 'Success',
          exampleCount: 0
        }
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: true
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu', '--authoringkey', uuidv1(), '--botname', 'test'])
    .it('should create a new application successfully', ctx => {
      expect(ctx.stdout).to.contain('Start to handle applications')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build update application succeed when utterances changed', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/test(development)-sandwich.utteranceChanged.en-us.lu.json')
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export'))
      .reply(200, existingLuisApp)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, '0.2')

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('train'))
      .reply(200, [{
        modelId: '99999',
        details: {
          statusId: 0,
          status: 'Success',
          exampleCount: 0
        }
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: true
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu', '--authoringkey', uuidv1(), '--botname', 'test'])
    .it('should update a luis application when utterances changed', ctx => {
      expect(ctx.stdout).to.contain('Start to handle applications')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build update application succeed when utterances added', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/test(development)-sandwich.utteranceAdded.en-us.lu.json')
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export'))
      .reply(200, existingLuisApp)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, '0.2')

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('train'))
      .reply(200, [{
        modelId: '99999',
        details: {
          statusId: 0,
          status: 'Success',
          exampleCount: 0
        }
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: true
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu', '--authoringkey', uuidv1(), '--botname', 'test'])
    .it('should update a luis application when utterances added', ctx => {
      expect(ctx.stdout).to.contain('Start to handle applications')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build not update application if no changes', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/test(development)-sandwich.en-us.lu.json')
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export'))
      .reply(200, existingLuisApp)
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu', '--authoringkey', uuidv1(), '--botname', 'test'])
    .it('should not update a luis application when there are no changes for the coming lu file', ctx => {
      expect(ctx.stdout).to.contain('Start to handle applications')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build write dialog asserts successfully if --dialog set', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/test(development)-sandwich.en-us.lu.json')
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export'))
      .reply(200, existingLuisApp)
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu', '--authoringkey', uuidv1(), '--botname', 'test', '--dialog', '--out', './results'])
    .it('should write dialog asserts successfully when --dialog set', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.en-us.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/sandwich.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/sandwich.lu.dialog')).to.be.true
    })
})