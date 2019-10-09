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
  return result === fixtureFile
}

const parseJsonFiles = async function(file1: string, file2: string) {
  let result = await fs.readJson(path.join(__dirname, file1))
  let fixtureFile = await fs.readJson(path.join(__dirname, file2))
  result = sanitizeExampleJson(JSON.stringify(result))
  fixtureFile = sanitizeExampleJson(JSON.stringify(fixtureFile))
  return [JSON.parse(result), JSON.parse(fixtureFile)]
}

function sanitizeExampleJson(fileContent: string) {
  let escapedExampleNewLine = JSON.stringify('\r\n').replace(/"/g, '').replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  let escapedNewLine = JSON.stringify(NEWLINE).replace(/"/g, '');
  return fileContent.replace(new RegExp(escapedExampleNewLine, 'g'), escapedNewLine);
}

describe('qnamaker:translate qna.lu', () => {
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
      expect(await compareLuFiles('./../../../fr/qna.lu', './../../fixtures/translation/fr/qna.lu')).to.be.true
    })
})

describe('qnamaker:translate qna.json', () => {
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
      .it('runs qnamaker:translate --translatekey xxxxxx --in file.lu --tgtlang fr --out ./', async (ctx) => {
        let parsedObjects = await parseJsonFiles('./../../../fr/qna.json', './../../fixtures/translation/fr/qna.json')
        expect(parsedObjects[0]).to.deep.equal(parsedObjects[1])
      })
  })