import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  expect(result).to.deep.equal(fixtureFile)
}

describe('luis:translate lu file', async () => {
  const response = require('./../../fixtures/translation/translateLuResponse.json')
  const response2 = require('./../../fixtures/translation/translateLuResponseSecond.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response2)
  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/file.lu')}`, '--tgtlang', 'fr', '--out', './'])
    .it('', async () => {
        await compareLuFiles('./../../../fr/file.lu', './../../fixtures/fr/file.lu')
    })
})

describe('luis:translate luis json', async () => {
  const responseLuis = require('./../../fixtures/translation/translateLuisResponse.json')
  const responseLuis2 = require('./../../fixtures/translation/translateLuisResponseSecond.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, responseLuis)

    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, responseLuis2)
  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/root.luis.json')}`, '--tgtlang', 'fr', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../fr/root.luis.json', './../../fixtures/translation/fr/root.luis.json')
    })
})

describe('luis:translate Phrase list entity references are translated correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/phraseList.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../de/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/phraseList.lu')}`, '--tgtlang', 'de', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../de/phraseList.lu', './../../fixtures/translation/translatedfiles/phraseList.lu')
    })
})

xdescribe('luis:translate References can be skipped from being translated', async () => {
  const response = {}
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../de/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/fileRef.lu')}`, '--tgtlang', 'de', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../de/fileRef.lu', './../../fixtures/translation/files/fileRef.lu')
    })
})

describe('luis:translate Intents and utterances are translated correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/intentsAndutterances.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/intentsAndUtterances.lu')}`, '--tgtlang', 'fr', '--out', './', '--translate_comments'])
    .it('', async () => {
      await compareLuFiles('./../../../fr/intentsAndUtterances.lu', './../../fixtures/translation/translatedfiles/intentsAndUtterances.lu')
    })
})

describe('luis:translate All entity types are translated correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/allEntities.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../de/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/allEntities.lu')}`, '--tgtlang', 'de', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../de/allEntities.lu', './../../fixtures/translation/translatedfiles/allEntities.lu')
    })
})

describe('luis:translate Labelled entity values are translated correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/labelledEntityValue.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../de/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/labelledEntityValue.lu')}`, '--tgtlang', 'de', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../de/labelledEntityValue.lu', './../../fixtures/translation/translatedfiles/labelledEntityValue.lu')
    })
})

describe('luis:translate Translate for new entity type is handled correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/newEntity.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/newEntity.lu')}`, '--tgtlang', 'fr', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../fr/newEntity.lu', './../../fixtures/translation/translatedfiles/newEntity.lu')
    })
})

describe('luis:translate For list entities, normalized value is added as synonym', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/normalizedValue.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/normalizedValue.lu')}`, '--tgtlang', 'fr', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../fr/normalizedValue.lu', './../../fixtures/translation/translatedfiles/normalizedValue.lu')
    })
})

describe('luis:translate Options in utterance are translated correctly', async () => {
  const response = require('./../../fixtures/translation/serviceresponses/options.json')
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../de/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/options.lu')}`, '--tgtlang', 'de', '--out', './'])
    .it('', async () => {
      await compareLuFiles('./../../../de/options.lu', './../../fixtures/translation/translatedfiles/options.lu')
    })
})