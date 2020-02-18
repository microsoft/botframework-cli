import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const response = require('./../../fixtures/translation/en/translateLuResponse.json')
const NEWLINE = require('os').EOL

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  expect(result).to.deep.equal(fixtureFile)
}

xdescribe('qnamaker:translate qna.lu', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, './../../../fr/'))
  })

  before(function(){
    nock('https://api.cognitive.microsofttranslator.com')
    .post(/.*/)
    .reply(200, response)

  })

  test
    .stdout()
    .command(['qnamaker:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/en/qna.lu')}`, '--tgtlang', 'fr', '--out', './'])
    .it('runs qnamaker:translate --translatekey xxxxxx --in file.lu --tgtlang fr --out ./', async (ctx) => {
      await compareLuFiles('./../../../fr/qna.lu', './../../fixtures/translation/fr/qna.lu')
    })
})

xdescribe('qnamaker:translate qna.json', () => {
    after(async function(){
      await fs.remove(path.join(__dirname, './../../../fr/'))
    })
  
    before(function(){
      nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)
  
    })
  
    test
      .stdout()
      .command(['qnamaker:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/en/qna.json')}`, '--tgtlang', 'fr', '--out', './'])
      .it('', async (ctx) => {
        await compareLuFiles('./../../../fr/qna.json', './../../fixtures/translation/fr/qna.json')
      })
  })

  xdescribe('qnamaker:translate QnA content is translated correctly', async () => {
    const response = require('./../../fixtures/translation/serviceresponses/qna.json')
    after(async function(){
      await fs.remove(path.join(__dirname, './../../../de/'))
    })
  
    before(function(){
      nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)
  
    })
  
    test
      .command(['qnamaker:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/qna.lu')}`, '--tgtlang', 'de', '--out', './'])
      .it('', async () => {
        await compareLuFiles('./../../../de/qna.lu', './../../fixtures/translation/translatedfiles/qna.lu')
      })
  })

  xdescribe('qnamaker:translate QnA content is translated correctly', async () => {
    const response = require('./../../fixtures/translation/serviceresponses/qnaContent.json')
    after(async function(){
      await fs.remove(path.join(__dirname, './../../../de/'))
    })
  
    before(function(){
      nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)
  
    })
  
    test
      .command(['qnamaker:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/qnaContent.lu')}`, '--tgtlang', 'de', '--out', './'])
      .it('', async () => {
        await compareLuFiles('./../../../de/qnaContent.lu', './../../fixtures/translation/translatedfiles/qnaContent.lu')
      })
  })

  xdescribe('qnamaker:translate QnA link references are translated correctly', async () => {
    const response = require('./../../fixtures/translation/serviceresponses/fileRef.json')
    after(async function(){
      await fs.remove(path.join(__dirname, './../../../de/'))
    })
  
    before(function(){
      nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)
  
    })
  
    test
      .command(['qnamaker:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/translation/files/fileRef.lu')}`, '--tgtlang', 'de', '--out', './', '--translate_link_text'])
      .it('', async () => {
        await compareLuFiles('./../../../de/fileRef.lu', './../../fixtures/translation/translatedfiles/fileRef.lu')
      })
  })