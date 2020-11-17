const assert = require('chai').assert
const nock = require('nock')
const uuidv1 = require('uuid/v1')
const path = require('path')
const NEWLINE = require('os').EOL
const Builder = require('../../../src/parser/qnabuild/builder').Builder
const qnaObject = require('../../../src/parser/lu/qna')
const qnaOptions = require('../../../src/parser/lu/qnaOptions')
const txtfile = require('../../../src/parser/lufile/read-text-file');

const rootDir = path.join(__dirname, './../../fixtures/testcases/import-resolver/qna-import-resolver')

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
                            `# ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
                            `\`\`\`markdown${NEWLINE}` +
                            `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: importUrlOrFileReference function return lu content from file sucessfully when updating kb', () => {
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
      .delete(uri => uri.includes('knowledgebases'))
      .reply(200)

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

    nock('https://westus.api.cognitive.microsoft.com')
      .delete(uri => uri.includes('knowledgebases'))
      .reply(200)
  })

  it('should return lu content from file successfully when kb exists', async () => {
    const builder = new Builder()
    const luContent = await builder.importFileReference(
      'SurfaceManual.pdf',
      'https://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf',
      uuidv1(),
      'https://westus.api.cognitive.microsoft.com/qnamaker/v4.0',
      'test.en-us.qna')
    assert.equal(luContent, `> # QnA pairs${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
      `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
      `# ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: importUrlOrFileReference function return lu content from file sucessfully with multiturn extraction enabled', () => {
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
          questions: ['User Guide'],
          answer: 'More Answers',
          metadata: [],
          prompts: [{
            displayOrder: 0,
            displayText: 'With Windows 10',
            qnaId: 2
          }]
        },
        {
          id: 2,
          source: 'SurfaceManual.pdf',
          questions: ['With Windows 10'],
          answer: '**With Windows 10**',
          metadata: [],
          prompts: []
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
      'mytest.en-us.qna',
      true)
    
    assert.equal(luContent,
      `> # QnA pairs${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
      `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
      `# ? User Guide${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `More Answers${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
      `<a id = "2"></a>${NEWLINE}${NEWLINE}` +
      `# ? With Windows 10${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `**With Windows 10**${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
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
                            `# ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
                            `\`\`\`markdown${NEWLINE}` +
                            `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: importUrlOrFileReference function return lu content from url sucessfully with multiturn extraction enabled', () => {
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
          questions: ['User Guide'],
          answer: 'More Answers',
          metadata: [],
          prompts: [{
            displayOrder: 0,
            displayText: 'With Windows 10',
            qnaId: 2
          }]
        },
        {
          id: 2,
          source: 'SurfaceManual.pdf',
          questions: ['With Windows 10'],
          answer: '**With Windows 10**',
          metadata: [],
          prompts: []
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
      'mytest.en-us.qna',
      true)

    assert.equal(luContent,
      `> # QnA pairs${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
      `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
      `# ? User Guide${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `More Answers${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = SurfaceManual.pdf${NEWLINE}${NEWLINE}` +
      `<a id = "2"></a>${NEWLINE}${NEWLINE}` +
      `# ? With Windows 10${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `**With Windows 10**${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: importUrlOrFileReference function return lu content from url sucessfully when updating kb', () => {
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
      .delete(uri => uri.includes('knowledgebases'))
      .reply(200)

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
      'test.en-us.qna')
    assert.equal(luContent, `> # QnA pairs${NEWLINE}${NEWLINE}` +
      `> !# @qna.pair.source = faqs${NEWLINE}${NEWLINE}` +
      `<a id = "1"></a>${NEWLINE}${NEWLINE}` +
      `# ? how many sandwich types do you have${NEWLINE}${NEWLINE}` +
      `\`\`\`markdown${NEWLINE}` +
      `25 types${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}`)
  })
})

describe('builder: loadContents function can resolve import files with customized resolver', () => {
  it('should load contents sucessfully after resolving imports', async () => {
    let importResolver = async function (srcId, idsToFind) {
      let luObjects = []
      let parentFilePath = path.parse(path.resolve(srcId)).dir
      for (let idx = 0; idx < idsToFind.length; idx++) {
        let file = idsToFind[idx]
        if (!path.isAbsolute(file.filePath)) {
          file.filePath = path.resolve(parentFilePath, file.filePath)
        }

        if (file.filePath.endsWith(".qna") && !file.filePath.endsWith("en-us.qna")) {
          file.filePath = file.filePath.slice(0, file.filePath.length - 3) + "en-us.qna"
        }

        luObjects.push(new qnaObject(txtfile.readSync(file.filePath), new qnaOptions(file.filePath, file.includeInCollate)))
      }
      return luObjects
    };

    const builder = new Builder(() => { })
    const result = await builder.loadContents(
      [`${path.join(rootDir, "common.en-us.qna")}`], {
        culture: 'en-us',
        importResolver: importResolver
      })

    assert.equal(result.length, 1)
    assert.isTrue(result[0].content.includes(
      `!# @qna.pair.source = custom editorial${NEWLINE}${NEWLINE}# ? help${NEWLINE}- could you help${NEWLINE}${NEWLINE}\`\`\`markdown${NEWLINE}help answer${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}> !# @qna.pair.source = custom editorial${NEWLINE}${NEWLINE}# ? welcome${NEWLINE}${NEWLINE}\`\`\`markdown${NEWLINE}welcome here${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}> !# @qna.pair.source = custom editorial${NEWLINE}${NEWLINE}# ? cancel${NEWLINE}${NEWLINE}\`\`\`markdown${NEWLINE}cancel the task${NEWLINE}\`\`\`${NEWLINE}${NEWLINE}> !# @qna.pair.source = custom editorial${NEWLINE}${NEWLINE}# ? stop${NEWLINE}${NEWLINE}\`\`\`markdown${NEWLINE}stop that${NEWLINE}\`\`\``))
  })
})

describe('builder: build function can catch relative endpoint exception successfully', () => {
  it('should throw exception for non absolute endpoint', async () => {
    const builder = new Builder(() => { })
    try {
      await builder.build(
        [new qnaObject(`# ? Greeting${NEWLINE}\`\`\`${NEWLINE}hello${NEWLINE}\`\`\``, new qnaOptions('', true, 'en-us', ''))],
        "f8c64e2a-1111-3a09-8f78-39d7adc76ec5",
        "test", {
          endpoint: 'http:fsd'
        }
      )

      assert.fail("Relative endpoint exception is not thrown.")
    } catch (e) {
      assert.equal(e.text, `Qnamaker build failed: Only absolute URLs are supported. "http:fsd" is not an absolute qnamaker endpoint URL.`)
    }
  })

  it('should throw exception for non absolute endpoint', async () => {
    const builder = new Builder(() => { })
    try {
      await builder.build(
        [new qnaObject(`# ? Greeting${NEWLINE}\`\`\`${NEWLINE}hello${NEWLINE}\`\`\``, new qnaOptions('', true, 'en-us', ''))],
        "f8c64e2a-1111-3a09-8f78-39d7adc76ec5",
        "test", {
          endpoint: 'fsd'
        }
      )

      assert.fail("Relative endpoint exception is not thrown.")
    } catch (e) {
      assert.equal(e.text, `Qnamaker build failed: Only absolute URLs are supported. "fsd" is not an absolute qnamaker endpoint URL.`)
    }
  })
})