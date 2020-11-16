import {expect, test} from '@oclif/test'
const path = require('path')
const fs = require('fs-extra')
const uuidv1 = require('uuid/v1')
const nock = require('nock')

const compareFiles = async function (file1: string, file2: string) {
  let result: string = ''
  if (await fs.pathExists(path.join(__dirname, file1))) {
    result = await fs.readFile(path.join(__dirname, file1))
  }
  
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  return result === fixtureFile
}

describe('luis:build cli parameters test', () => {
  test
    .stdout()
    .command(['luis:build', '--help'])
    .exit(1)
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Build lu files to train and publish luis applications')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botName', 'Contoso'])
    .exit(1)
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing LUIS authoring key. Please pass authoring key with --authoringKey flag')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--botName', 'Contoso'])
    .exit(1)
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing input. Please use stdin or pass a file or folder location with --in flag')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`])
    .exit(1)
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing bot name. Please pass bot name with --botName flag')
    })
  
  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild/file-name-duplicated')}`, '--botName', 'Contoso'])
    .exit(1)
    .it('displays an error if files with same name and locale are found', ctx => {
      expect(ctx.stderr).to.contain('Files with same name and locale are found')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/invalid_import_file.lu')}`, '--botName', 'Contoso'])
    .exit(1)
    .it('displays an error if error occurs in parsing lu content', ctx => {
      expect(ctx.stderr).to.contain('Invalid LU file')
      expect(ctx.stderr).to.contain('bad3.lu')
      expect(ctx.stderr).to.contain('[ERROR] line 4:0 - line 4:16: Invalid intent body line, did you miss \'-\' at line begin')
    })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--authoringKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/lubuild')}`, '--botName', 'Contoso', '--dialog', 'cross-train'])
    .exit(1)
    .it('displays an error if option specified by --dialog is not right', ctx => {
      expect(ctx.stderr).to.contain('Recognizer type specified by --dialog is not right. Please specify [multiLanguage|crosstrained]')
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
        versionId: '0.1',
        isStaging: true
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich//lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--isStaging'])
    .it('should create a new application successfully', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      expect(ctx.stdout).to.contain('publishing finished for Staging slot')
    })
})

describe('luis:build update application succeed when utterances changed', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.utteranceChanged.en-us.lu.json')
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
      .get(uri => uri.includes('apps'))
      .reply(200, [
        {
          version: '0.2'
        },
        {
          version: '0.1'
        }])

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
        isStaging: false
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
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
      .get(uri => uri.includes('apps'))
      .reply(200, [
        {
          version: '0.2'
        },
        {
          version: '0.1'
        }])

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
        isStaging: false
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should not update a luis application when there are no changes for the coming lu file', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build not create application if kb name id only case different', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.en-us.lu.json')
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'TEST', '--log', '--suffix', 'development'])
    .it('should not create a luis application when an app with only case different name already existed in service', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build write dialog and settings assets successfully if --dialog set to multiLanguage', () => {
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--out', './results', '--dialog', 'multiLanguage', '--log', '--suffix', 'development'])
    .it('should write dialog and settings assets successfully when --dialog set to multiLanguage', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.en-us.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.dialog')).to.be.true
    })
})

describe('luis:build write dialog and settings assets successfully if --dialog set to crosstrained', () => {
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
    .it('should write dialog and settings assets successfully when --dialog set to crosstrained', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.qna.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.dialog')).to.be.true
    })
})

describe('luis:build write crosstrained recognizer asset and settings successfully if lu file is empty and --dialog set to crosstrained', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test(development)-sandwich.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/empty-file/lufiles/empty.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'crosstrained', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write crosstrained recognizer asset successfully when lu file is empty and --dialog set to crosstrained', async ctx => {
      expect(await compareFiles('./../../../results/empty.lu.qna.dialog', './../../fixtures/testcases/lubuild/empty-file/dialogs/empty.lu.qna.dialog')).to.be.true
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
        isStaging: false
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: false
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
    .it('should create multiple applications and write dialog and settings assets successfully when input is a folder', async ctx => {
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

describe('luis:build not update application if only cases of utterances or patterns are changed', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/case-insensitive/luis/test(development)-case-insensitive.en-us.lu.json')
  before(function () {
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

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/case-insensitive/lufiles/case-insensitive.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should not update a luis application when only cases of utterances or patterns are different for the coming lu file', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('luis:build update application succeed with parameters set from luconfig', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/luconfig/luis/MyProject(development)-test.en-us.lu.json')
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'MyProject(development)-test.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('apps'))
      .reply(200, {
        name: 'MyProject(development)-test.en-us.lu',
        id: 'f8c64e2a-8635-3a09-8f78-39d7adc76ec5',
        activeVersion: '0.1'
      })

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('export'))
      .reply(200, existingLuisApp)

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('import'))
      .reply(201, '0.2')

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('apps'))
      .reply(200, [
        {
          version: '0.4'
        },
        {
          version: '0.3'
        },
        {
          version: '0.2'
        },
        {
          version: '0.1'
        }
      ])
    
    nock('https://chinaeast2.api.cognitive.azure.cn')
      .delete(uri => uri.includes('0.1'))
      .reply(200)

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .delete(uri => uri.includes('0.2'))
      .reply(200)

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .delete(uri => uri.includes('0.3'))
      .reply(200)

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('train'))
      .reply(200, [{
        modelId: '99999',
        details: {
          statusId: 0,
          status: 'Success',
          exampleCount: 0
        }
      }])

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: false
      })
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--authoringKey', uuidv1(), '--luConfig', './test/fixtures/testcases/lubuild/luconfig/lufiles/luconfig.json', '--log', '--suffix', 'development'])
    .it('should update a luis application when utterances changed', async ctx => {
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

describe('luis:build create a new application successfully with locale set to it-it', () => {
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
        isStaging: false
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/file-with-personName/personName.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--defaultCulture', 'it-it'])
    .it('should create a new application successfully for prebuilt entity personName with locale set to it-it', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      expect(ctx.stdout).to.contain('publishing finished')
      expect(ctx.stdout.includes('personName is not available for the requested locale: it-it')).to.be.false
    })
})

describe('luis:build update application succeed when activeVersion is null', () => {
  const existingLuisApp = require('./../../fixtures/testcases/lubuild/sandwich/luis/test(development)-sandwich.utteranceAdded.en-us.lu.json')
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
        activeVersion: null,
        endpoints: {
          PRODUCTION: {
            versionId: '0.1'
          }
        }
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
          version: '0.2'
        },
        {
          version: '0.1'
        }])

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
        isStaging: false
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should update a luis application when activeVersion is null', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('creating version=0.2')
      expect(ctx.stdout).to.contain('training version=0.2')
      expect(ctx.stdout).to.contain('waiting for training for version=0.2')
      expect(ctx.stdout).to.contain('publishing version=0.2')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build create a new application successfully with endpoint override', () => {
  before(function () {
    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test.en-us.lu',
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      })

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('train'))
      .reply(202, {
        statusId: 2,
        status: 'UpToDate'
      })

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .get(uri => uri.includes('train'))
      .reply(200, [{
        modelId: '99999',
        details: {
          statusId: 0,
          status: 'Success',
          exampleCount: 0
        }
      }])

    nock('https://chinaeast2.api.cognitive.azure.cn')
      .post(uri => uri.includes('publish'))
      .reply(201, {
        versionId: '0.2',
        isStaging: false
      })
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich//lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development', '--endpoint', 'https://chinaeast2.api.cognitive.azure.cn/'])
    .it('should create a new application successfully with endpoint override', ctx => {
      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      expect(ctx.stdout).to.contain('publishing finished')
    })
})

describe('luis:build write dialog and settings assets successfully if schema is specified', () => {
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--out', './results', '--log', '--suffix', 'development', '--dialog', 'crosstrained', '--schema', 'https://raw.githubusercontent.com/microsoft/BotFramework-Composer/stable/Composer/packages/server/schemas/sdk.schema'])
    .it('should write dialog and settings assets successfully if schema is specified', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.en-us.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs-with-schema/sandwich.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs-with-schema/sandwich.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.qna.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs-with-schema/sandwich.lu.qna.dialog')).to.be.true
    })
})

describe('luis:build write dialog and settings assets successfully when empty files exist', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(200, [{
        name: 'test.en-us.lu',
        id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      }])

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('import'))
      .reply(201, {
        appId: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
        versionId: '0.1',
        isStaging: false
      })
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/empty-file/lufiles', '--authoringKey', uuidv1(), '--botName', 'test', '--dialog', 'crosstrained', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write dialog and settings assets successfully when empty files exist', async ctx => {
      expect(ctx.stdout).to.contain('empty.lu loaded')
      expect(ctx.stdout).to.contain('non-empty.lu loaded')

      expect(ctx.stdout).to.contain('Handling applications...')
      expect(ctx.stdout).to.contain('Creating LUIS.ai application')
      expect(ctx.stdout).to.contain('training version=0.1')
      expect(ctx.stdout).to.contain('waiting for training for version=0.1')
      expect(ctx.stdout).to.contain('publishing version=0.1')
      
      expect(ctx.stdout).to.contain('non-empty.lu publishing finished')

      expect(await compareFiles('./../../../results/empty.lu.qna.dialog', './../../fixtures/testcases/lubuild/empty-file/dialogs/empty.lu.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/empty-file/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/non-empty.lu.dialog', './../../fixtures/testcases/lubuild/empty-file/dialogs/non-empty.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/non-empty.en-us.lu.dialog', './../../fixtures/testcases/lubuild/empty-file/dialogs/non-empty.en-us.lu.dialog')).to.be.true
      expect(await compareFiles('./../../../results/non-empty.lu.qna.dialog', './../../fixtures/testcases/lubuild/empty-file/dialogs/non-empty.lu.qna.dialog')).to.be.true
    })
})

describe('luis:build write settings assets only successfully if --dialog is not set', () => {
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
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich/lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write settings assets only successfully if --dialog is not set', async ctx => {
      expect(await compareFiles('./../../../results/luis.settings.development.westus.json', './../../fixtures/testcases/lubuild/sandwich/config/luis.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/sandwich.lu.qna.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.qna.dialog')).to.be.false
      expect(await compareFiles('./../../../results/sandwich.lu.dialog', './../../fixtures/testcases/lubuild/sandwich/dialogs/sandwich.lu.dialog')).to.be.false
    })
})

describe('luis:build throw luis build failed exception successfully', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('apps'))
      .reply(401, {
        error: {
          code: 401,
          message: 'Access denied due to invalid subscription key.'
        }
      })
  })

  test
    .stdout()
    .stderr()
    .command(['luis:build', '--in', './test/fixtures/testcases/lubuild/sandwich//lufiles/sandwich.en-us.lu', '--authoringKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .exit(1)
    .it('should throw luis build failed exception successfully', ctx => {
      expect(ctx.stderr).to.contain('Luis build failed: Access denied due to invalid subscription key.')
    })
})