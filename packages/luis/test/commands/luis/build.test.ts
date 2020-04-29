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
    .command(['luis:build', '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botName', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing luis authoring key. Please pass authoring key with --authoringKey flag')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--botName', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing input. Please use stdin or pass a file or folder location with --in flag')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing bot name. Please pass bot name with --botName flag')
    })
  
  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild/file-name-duplicated')}`, '--botName', 'Contoso'])
    .it('displays an error if files with same name and locale are found', ctx => {
      expect(ctx.stderr).to.contain('Files with same name and locale are found')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_import_file.lu')}`, '--botName', 'Contoso'])
    .it('displays an error if error occurs in parsing lu content', ctx => {
      expect(ctx.stderr).to.contain('Invalid LU file')
      expect(ctx.stderr).to.contain('bad3.lu')
      expect(ctx.stderr).to.contain('[ERROR] line 4:0 - line 4:16: Invalid intent body line, did you miss \'-\' at line begin')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botName', 'Contoso', '--dialog', 'cross-train'])
    .it('displays an error if option specified by --dialog is not right', ctx => {
      expect(ctx.stderr).to.contain('Recognizer type specified by --dialog is not right. Please specify [multiLanguage|crosstrained]')
    })
})

describe('luis:build create a new application successfully', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

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

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich//lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--out', './results'])
    .it('should create a new application successfully', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build update application succeed when utterances changed', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.utteranceChanged.en-us.lu.json')
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

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--out', './results'])
    .it('should update a luis application when utterances changed', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build update application succeed when utterances added', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.utteranceAdded.en-us.lu.json')
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

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--out', './results'])
    .it('should update a luis application when utterances added', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build not update application if no changes', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.en-us.lu.json')
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--out', './results'])
    .it('should not update a luis application when there are no changes for the coming lu file', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build write dialog assets successfully if --dialog set to multiLanguage', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.en-us.lu.json')
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'multiLanguage', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write dialog assets successfully when --dialog set to multiLanguage', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.en-us.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.dialog')).to.be.true
    })
})

describe('luis:build write dialog assets successfully if --dialog set to crosstrained', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.en-us.lu.json')
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'crosstrained', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write dialog assets successfully when --dialog set to crosstrained', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.qna.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.dialog')).to.be.true
    })
})

describe('luis:build create multiple applications successfully when input is a folder', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test.en-us.lu',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
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
    
    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: true
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: true
      })
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/foo/lufiles', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'multiLanguage', '--out', './results', '--log', '--suffix', 'development'])
    .it('should create multiple applications and write dialog assets successfully when input is a folder', async ctx => {
      expect(ctx.stdout).to.contain('foo.fr-fr.lu loaded')
      expect(ctx.stdout).to.contain('foo.lu loaded')
      expect(ctx.stdout).to.contain('foo.zh-cn.lu loaded')

      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      
      expect(ctx.stdout).to.contain('foo.fr-fr.lu publishing finished')
      expect(ctx.stdout).to.contain('foo.lu publishing finished')
      expect(ctx.stdout).to.contain('foo.zh-cn.lu publishing finished')

      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/foo/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/foo.lu.dialog', './../../fixtures/testcases/lubuild/foo/dialogs/foo.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.en-us.lu.dialog', './../../fixtures/testcases/lubuild/foo/dialogs/foo.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.fr-fr.lu.dialog', './../../fixtures/testcases/lubuild/foo/dialogs/foo.fr-fr.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.zh-cn.lu.dialog', './../../fixtures/testcases/lubuild/foo/dialogs/foo.zh-cn.lu.dialog')).to.be.true
    })
})

describe('luis:build update dialog assets successfully when dialog assets exist', () => {
  const existingLuisApp_EN_US = require('./../../fixtures/testcases/lubuild/foo2/luis/test(development)-foo.en-us.lu.json')
  const existingLuisApp_FR_FR = require('./../../fixtures/testcases/lubuild/foo2/luis/test(development)-foo.fr-fr.lu.json')
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [
        {
          name: 'test(development)-foo.fr-fr.lu',
          id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
        },
        {
          name: 'test(development)-foo.en-us.lu',
          id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
        }
      ])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-3333-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps') && uri.includes('f8c64e2a-2222-3a09-8f78-39d7adc76ec5'))
      .reply(200, {
        name: 'test(development)-foo.en-us.lu',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps') && uri.includes('f8c64e2a-1111-3a09-8f78-39d7adc76ec5'))
      .reply(200, {
        name: 'test(development)-foo.fr-fr.lu',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export') && uri.includes('f8c64e2a-2222-3a09-8f78-39d7adc76ec5'))
      .reply(200, existingLuisApp_EN_US)

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('export') && uri.includes('f8c64e2a-1111-3a09-8f78-39d7adc76ec5'))
      .reply(200, existingLuisApp_FR_FR)


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

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/foo2/lufiles-and-dialog-assets', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'multiLanguage', '--out', './results', '--log', '--suffix', 'development'])
    .it('should update dialog assets successfully when dialog assets exist', async ctx => {
      expect(ctx.stdout).to.contain('foo.fr-fr.lu loaded')
      expect(ctx.stdout).to.contain('foo.lu loaded')
      expect(ctx.stdout).to.contain('foo.zh-cn.lu loaded')

      expect(ctx.stdout).to.contain('luis.settings.development.westus.json loaded')
      expect(ctx.stdout).to.contain('foo.lu.dialog loaded')

      expect(ctx.stdout).to.contain('Handling applications...')

      expect(ctx.stdout).to.contain('foo.en-us.lu.dialog loaded')
      expect(ctx.stdout).to.contain('foo.fr-fr.lu.dialog loaded')

      expect(ctx.stdout).to.contain('[WARN]: empty intent(s) # emptyIntent are filtered when handling luis application')

      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')

      expect(ctx.stdout).to.contain('foo.fr-fr.lu no changes')
      expect(ctx.stdout).to.contain('foo.lu no changes')
      expect(ctx.stdout).to.contain('foo.zh-cn.lu publishing finished')

      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/foo2/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/foo.lu.dialog', './../../fixtures/testcases/lubuild/foo2/dialogs/foo.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.en-us.lu.dialog', './../../fixtures/testcases/lubuild/foo2/dialogs/foo.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.fr-fr.lu.dialog', './../../fixtures/testcases/lubuild/foo2/dialogs/foo.fr-fr.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/foo.zh-cn.lu.dialog', './../../fixtures/testcases/lubuild/foo2/dialogs/foo.zh-cn.lu.dialog')).to.be.true
    })
})

describe('luis:build not update application if only cases of utterances or patterns are changed', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/case-insensitive/luis/test(development)-case-insensitive.en-us.lu.json')
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-case-insensitive.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'test(development)-case-insensitive.en-us.lu',
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/case-insensitive/lufiles/case-insensitive.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--out', './results'])
    .it('should not update a luis application when only cases of utterances or patterns are different for the coming lu file', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build update application succeed with parameters set from luconfig', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/luconfig/luis/MyProject(development)-test.en-us.lu.json')
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'MyProject(development)-test.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'MyProject(development)-test.en-us.lu',
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
      .get(uri => uri.includes('apps'))
      .reply(200, [
        {
          version: '0.1'
        },
        {
          version: '0.2'
        }
      ])
    
    nock('https://westus.api.cognitive.microsoft.com')
      .delete(uri => uri.includes('apps'))
      .reply(200)

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

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--authoringKey', uuidv1(), '--luConfig', './test/fixtures/testcases/lubuild/luconfig/lufiles/luconfig.json', '--log', '--suffix', 'development'])
    .it('should update a luis application when utterances changed', async ctx => {
      console.log(ctx)
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('deleting old version=0.1')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')

      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/luconfig/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/test.en-us.lu.dialog', './../../fixtures/testcases/lubuild/luconfig/dialogs/test.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/test.lu.dialog', './../../fixtures/testcases/lubuild/luconfig/dialogs/test.lu.dialog')).to.be.true
    })
})