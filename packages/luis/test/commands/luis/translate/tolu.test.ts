import {expect, test} from '@oclif/test'
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const response = require('../../../fixtures/translateresponse.json')
const response2 = require('../../../fixtures/translateresponsesecond.json')

describe('luis:translate:tolu', () => {
  after(async function(){
    await fs.remove(path.join(__dirname, '../../../../fr/'))
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
    .stderr()
    .command(['luis:translate:tolu', '--translate_key','xxxxxxx', '--in', `${path.join(__dirname, '../../../fixtures/file.lu')}`, '--to_lang', 'fr'])
    .it('luis:translate:tolu --translate_key xxxxxx --in file.lu --to_lang fr', async (ctx) => {
      let result = await fs.readFile(path.join(__dirname, '../../../../fr/file.lu')).toString().replace(/\r\n/g, "\n")
      let fixtureFile = await fs.readFile(path.join(__dirname, '../../../fixtures/fr/file.lu')).toString().replace(/\r\n/g, "\n")
      expect(result.includes(fixtureFile)).to.be.true
    })

  test
    .stderr()
    .command(['luis:translate:tolu', '--translate_key','xxxxxxxxxxxxxxxxxx', '--to_lang', 'fr, es'])
    .it('luis:translate:tolu --translate_key xxxxxxxxxxxxxxxxxx --to_lang fr, es', ctx => {
      expect(ctx.stderr).to.contain('No .lu file or folder specified')
    })
})
