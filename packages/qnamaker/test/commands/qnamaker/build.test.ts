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

describe('qnamaker:build cli parameters test', () => {
  test
    .stdout()
    .command(['qnamaker:build', '--help'])
    .it('should print the help contents when --help is passed as an argument', ctx => {
      expect(ctx.stdout).to.contain('Build .qna files to create or update qnamaker knowledge bases and qnamaker alterations')
    })

  test
    .stdout()
    .stderr()
    .command(['qnamaker:build', '--in', `${path.join(__dirname, './../../fixtures/testcases/qnabuild')}`, '--botName', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing required flag:\n -s, --subscriptionKey SUBSCRIPTIONKEY  QnA maker subscription key')
    })

  test
    .stdout()
    .stderr()
    .command(['qnamaker:build', '--subscriptionKey', uuidv1(), '--botName', 'Contoso'])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing input. Please use stdin or pass a file or folder location with --in flag')
    })

  test
    .stdout()
    .stderr()
    .command(['qnamaker:build', '--subscriptionKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/qnabuild')}`])
    .it('displays an error if any required input parameters are missing', ctx => {
      expect(ctx.stderr).to.contain('Missing required flag:\n -b, --botName BOTNAME  Bot name')
    })
})

describe('qnamaker:build create a new knowledge base successfully', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('createasync'))
      .reply(202, {
        operationId: 'f8c64e2a-aaaa-3a09-8f78-39d7adc76ec5'
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('operations'))
      .reply(200, {
        operationState: 'Succeeded',
        resourceLocation: 'a/b/f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('knowledgebases'))
      .reply(204)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        hostName: 'https://myqnamakerbot.azurewebsites.net'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('alterations'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should create a new knowledge base successfully', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('Creating qnamaker KB: test(development).en-us.qna...')
      expect(ctx.stdout).to.contain('Creating finished')
      expect(ctx.stdout).to.contain('Publishing kb')
      expect(ctx.stdout).to.contain('Publishing finished')
      expect(ctx.stdout).to.contain('Replacing alterations...')
    })
})

describe('qnamaker:build update knowledge base succeed when qa changed', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['how many sandwich types do you have'],
          answer: '25 types',
          metadata: []
        }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('knowledgebases'))
      .reply(204)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich2.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should update a knowledge base when qa list changed', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('Updating to new version for kb test(development).en-us.qna')
      expect(ctx.stdout).to.contain('Updating finished')
      expect(ctx.stdout).to.contain('Publishing kb')
    })
})

describe('qnamaker:build not update knowledge if no changes', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['how many sandwich types do you have', 'how many tastes do you have'],
          answer: '25 types',
          metadata: []
        }]
      })
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich2.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should not update a knowledge base when no changes', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('qnamaker:build write dialog assets successfully if --dialog set', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['how many sandwich types do you have', 'how many tastes do you have'],
          answer: '25 types',
          metadata: []
        }]
      })
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich2.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--dialog', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write dialog assets successfully when --dialog set', async ctx => {
      expect(await compareFiles('./../../../results/qnamaker.settings.development.westus.json', './../../fixtures/testcases/qnabuild/sandwich/config/qnamaker.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/test.en-us.qna.dialog', './../../fixtures/testcases/qnabuild/sandwich/dialogs/test.en-us.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/test.qna.dialog', './../../fixtures/testcases/qnabuild/sandwich/dialogs/test.qna.dialog')).to.be.true
    })
})

describe('qnamaker:build write dialog assets successfully with multi locales', () => {
  before(async function () {
    await fs.ensureDir(path.join(__dirname, './../../../results/'))

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          },
          {
            name: 'test(development).fr-fr.qna',
            id: 'f8c64e2a-2222-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['who are you'],
          answer: 'I\'m Lucy',
          metadata: []
        },
        {
          id: 2,
          source: 'custom editorial',
          questions: ['weather'],
          answer: 'It\'s rainy',
          metadata: []
        }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['Météo'],
          answer: 'C\'est pluvieux',
          metadata: []
        }]
      })
  })

  after(async function () {
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/multi-locales/qnafiles', '--subscriptionKey', uuidv1(), '--botName', 'test', '--dialog', '--out', './results', '--log', '--suffix', 'development'])
    .it('should write dialog assets successfully with multi locales', async ctx => {
      expect(await compareFiles('./../../../results/qnamaker.settings.development.westus.json', './../../fixtures/testcases/qnabuild/multi-locales/config/qnamaker.settings.development.westus.json')).to.be.true
      expect(await compareFiles('./../../../results/test.en-us.qna.dialog', './../../fixtures/testcases/qnabuild/multi-locales/dialogs/test.en-us.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/test.fr-fr.qna.dialog', './../../fixtures/testcases/qnabuild/multi-locales/dialogs/test.fr-fr.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/test.qna.dialog', './../../fixtures/testcases/qnabuild/multi-locales/dialogs/test.qna.dialog')).to.be.true
    })
})

describe('qnamaker:build not update knowledge base if only cases are changed', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['HOW MANY sandwich types do you have', 'how many TASTES do you have'],
          answer: '25 types',
          metadata: []
        }]
      })
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich2.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should not update a knowledge base when only cases changed', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('no changes')
    })
})

describe('qnamaker:build create a new knowledge base with multiturn qna successfully', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('createasync'))
      .reply(202, {
        operationId: 'f8c64e2a-aaaa-3a09-8f78-39d7adc76ec5'
      })
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('operations'))
      .reply(200, {
        operationState: 'Succeeded',
        resourceLocation: 'a/b/f8c64e2a-2222-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('knowledgebases'))
      .reply(204)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
    
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
        hostName: 'https://myqnamakerbot.azurewebsites.net'
      })
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/multiturn/multiturn.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should create a new knowledge base with multiturn qna successfully', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('Creating qnamaker KB: test(development).en-us.qna...')
      expect(ctx.stdout).to.contain('Creating finished')
      expect(ctx.stdout).to.contain('Publishing kb')
      expect(ctx.stdout).to.contain('Publishing finished')
    })
})

describe('qnamaker:build update knowledge base with multiturn successfully when qa changed', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development).en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5',
            hostName: 'https://myqnamakerbot.azurewebsites.net'
          }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'custom editorial',
          questions: ['how many sandwich types do you have'],
          answer: '25 types',
          metadata: []
        }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('knowledgebases'))
      .reply(204)

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/multiturn/multiturn.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should update a knowledge base with multiturn when qa list changed', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('Updating to new version')
      expect(ctx.stdout).to.contain('Updating finished')
      expect(ctx.stdout).to.contain('Publishing kb')
    })
})