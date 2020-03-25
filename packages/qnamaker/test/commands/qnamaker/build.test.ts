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
      expect(ctx.stdout).to.contain('Build qna files to create and publish qnamaker knowledge bases or update alterations')
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
      expect(ctx.stderr).to.contain('Missing bot name. Please pass bot name with --botName flag')
    })
  
  test
    .stdout()
    .stderr()
    .command(['qnamaker:build', '--subscriptionKey', uuidv1(), '--in', `${path.join(__dirname, './../../fixtures/testcases/qnabuild/file-name-duplicated')}`, '--botName', 'Contoso'])
    .it('displays an error if files with same name and locale are found', ctx => {
      expect(ctx.stderr).to.contain('Files with same name and locale are found')
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
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)

    nock('https://westus.api.cognitive.microsoft.com')
      .put(uri => uri.includes('alterations'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should create a new knowledge base successfully', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('creating qnamaker KB: test(development)-sandwich.en-us.qna...')
      expect(ctx.stdout).to.contain('creating finished')
      expect(ctx.stdout).to.contain('publishing...')
      expect(ctx.stdout).to.contain('publishing finished')
      expect(ctx.stdout).to.contain('replacing alterations...')
    })
})

describe('qnamaker:build update knowledge base succeed when qa changed', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development)-sandwich2.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
      .patch(uri => uri.includes('knowledgebases'))
      .reply(202, {
        operationId: 'f8c64e2a-aaaa-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('operations'))
      .reply(200, {
        operationState: 'Succeeded'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich2.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should update a knowledge when qa list changed', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('updating to new version')
      expect(ctx.stdout).to.contain('updating finished')
      expect(ctx.stdout).to.contain('publishing...')
    })
})

describe('qnamaker:build update knowledge base succeed when file and url added', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development)-sandwich3.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
      .patch(uri => uri.includes('knowledgebases'))
      .reply(202, {
        operationId: 'f8c64e2a-aaaa-3a09-8f78-39d7adc76ec5'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('operations'))
      .reply(200, {
        operationState: 'Succeeded'
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .post(uri => uri.includes('knowledgebases'))
      .reply(204)
  })

  test
    .stdout()
    .command(['qnamaker:build', '--in', './test/fixtures/testcases/qnabuild/sandwich/qnafiles/sandwich3.en-us.qna', '--subscriptionKey', uuidv1(), '--botName', 'test', '--log', '--suffix', 'development'])
    .it('should update a knowledge when qa list changed', ctx => {
      expect(ctx.stdout).to.contain('Handling qnamaker knowledge bases...')
      expect(ctx.stdout).to.contain('updating to new version')
      expect(ctx.stdout).to.contain('updating finished')
      expect(ctx.stdout).to.contain('publishing...')
    })
})

describe('qnamaker:build not update knowledge if no changes', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development)-sandwich2.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
            name: 'test(development)-sandwich2.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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
      expect(await compareFiles('./../../../results/sandwich2.en-us.qna.dialog', './../../fixtures/testcases/qnabuild/sandwich/dialogs/sandwich2.en-us.qna.dialog')).to.be.true
      expect(await compareFiles('./../../../results/sandwich2.qna.dialog', './../../fixtures/testcases/qnabuild/sandwich/dialogs/sandwich2.qna.dialog')).to.be.true
    })
})

describe('qnamaker:build not update knowledge base if only cases are changed', () => {
  before(function () {
    nock('https://westus.api.cognitive.microsoft.com')
      .get(uri => uri.includes('qnamaker'))
      .reply(200, {
        knowledgebases:
          [{
            name: 'test(development)-sandwich2.en-us.qna',
            id: 'f8c64e2a-1111-3a09-8f78-39d7adc76ec5'
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