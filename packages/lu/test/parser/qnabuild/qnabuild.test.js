const assert = require('chai').assert
const nock = require('nock')
const uuidv1 = require('uuid/v1')
const NEWLINE = require('os').EOL
const Builder = require('../../../src/parser/qnabuild/builder').Builder

describe('builder: importUrlOrFileReference function return lu content from file sucessfully', () => {
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
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'SurfaceManual.pdf',
          questions: ['how many sandwich types do you have'],
          answer: '25 types',
          metadata: []
        }]
      })
  })

  nock('https://westus.api.cognitive.microsoft.com')
    .delete(uri => uri.includes('knowledgebases'))
    .reply(200)

  it('should return lu content from file successfully', async () => {
    const builder = new Builder()
    const luContent = await builder.importFileReference(
      'SurfaceManual.pdf',
      'https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf',
      uuidv1(),
      'https://westus.api.cognitive.microsoft.com/qnamaker/v4.0',
      'mytest.en-us.qna')
    assert.equal(luContent, `> # QnA pairs${NEWLINE}${NEWLINE}` +
                            `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
                            `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
                            `## ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
                            `\`\`\`markdown${NEWLINE}` +
                            `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: importUrlOrFileReference function return lu content from url sucessfully', () => {
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
      .get(uri => uri.includes('knowledgebases'))
      .reply(200, {
        qnaDocuments: [{
          id: 1,
          source: 'faqs',
          questions: ['how many sandwich types do you have'],
          answer: '25 types',
          metadata: []
        }]
      })

    nock('https://westus.api.cognitive.microsoft.com')
      .delete(uri => uri.includes('knowledgebases'))
      .reply(200)
  })

  it('should return lu content from url successfully', async () => {
    const builder = new Builder()
    const luContent = await builder.importUrlReference(
      'https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs',
      uuidv1(),
      'https://westus.api.cognitive.microsoft.com/qnamaker/v4.0',
      'mytest.en-us.qna')
    assert.equal(luContent, `> # QnA pairs${NEWLINE}${NEWLINE}` +
                            `> !# @qna.pair.source = faqs${NEWLINE}${NEWLINE}` +
                            `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
                            `## ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
                            `\`\`\`markdown${NEWLINE}` +
                            `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})