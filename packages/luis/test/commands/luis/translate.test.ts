import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const response = require('./../../fixtures/translateresponse.json')
const response2 = require('./../../fixtures/translateresponsesecond.json')

const compareLuFiles = async function(file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, "\n")
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, "\n")
  return result === fixtureFile
}

describe('luis:translate', () => {
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
    .stdout()
    .command(['luis:translate', '--translatekey','xxxxxxx', '--in', `${path.join(__dirname, './../../fixtures/file.lu')}`, '--tgtlang', 'fr', '--out', './'])
    .it('runs luis:translate --translatekey xxxxxx --in file.lu --tgtlang fr --out ./', async (ctx) => {
      expect(await compareLuFiles('./../../../fr/file.lu', './../../fixtures/fr/file.lu')).to.be.true
    })
})
