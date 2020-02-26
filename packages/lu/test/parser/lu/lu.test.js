let chai = require('chai');
let expect = chai.expect;
const fs = require('fs-extra')
const path = require('path')
const nock = require('nock')
const LU = require('./../../../src/parser/lu/lu')

const compareLuFiles =  function(file1, file2) {
  let result = file1.toString().replace(/\r\n/g, "\n")
  let fixtureFile = file2.toString().replace(/\r\n/g, "\n")
  expect(result).to.deep.equal(fixtureFile)
}


describe('LU instance', function() {
    const response = require('./../../fixtures/translation/serviceresponses/intentsAndutterances.json')
  
    before(function(){
      nock('https://api.cognitive.microsofttranslator.com')
      .post(/.*/)
      .reply(200, response)
  
    })
    it('Transalte LU instance content', async () => {
        let luContent = await fs.readFile(path.join(__dirname, './../../fixtures/translation/files/intentsAndUtterances.lu'))
        let result = await fs.readFile(path.join(__dirname, './../../fixtures/translation/translatedfiles/intentsAndUtterances.lu'))
        const luInstance = new LU(luContent.toString(), '')
        await luInstance.translate('xxxxxxx', 'fr', true, false)
        compareLuFiles(luInstance.content, result)
    });
});