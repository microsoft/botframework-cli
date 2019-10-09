import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const response = require('./../../fixtures/translation/translateLuResponse.json')
const response2 = require('./../../fixtures/translation/translateLuResponseSecond.json')
const responseLuis = require('./../../fixtures/translation/translateLuisResponse.json')
const responseLuis2 = require('./../../fixtures/translation/translateLuisResponseSecond.json')

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:translate lu file', async () => {
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
    .it('runs luis:translate --translatekey xxxxxx --in file.lu --tgtlang fr --out ./', async () => {
      expect(await compareLuFiles('./../../../fr/file.lu', './../../fixtures/fr/file.lu')).to.be.true
    })
})

describe('luis:translate luis json', async () => {
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
    .it('runs luis:translate --translatekey xxxxxx --in root.luis.json --tgtlang fr --out ./', async () => {
      expect(await compareLuFiles('./../../../fr/root.luis.json', './../../fixtures/translation/fr/root.luis.json')).to.be.true
    })
})